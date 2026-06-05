import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const schema = z.object({
  meterId: z.string(),
  value: z.number().positive(),
  period: z.string().regex(/^\d{4}-\d{2}$/),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.status !== "ACTIVE") {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = schema.parse(body);

    const meter = await prisma.meter.findUnique({
      where: { id: data.meterId },
      include: { plot: { include: { users: { where: { userId: session.id } } } } },
    });

    if (!meter || meter.plot.users.length === 0) {
      return NextResponse.json({ error: "Счётчик не найден" }, { status: 404 });
    }

    if (data.value < meter.lastReading) {
      return NextResponse.json(
        { error: "Показание не может быть меньше предыдущего" },
        { status: 400 }
      );
    }

    const existing = await prisma.meterReading.findUnique({
      where: { meterId_period: { meterId: data.meterId, period: data.period } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Показания за этот период уже переданы" },
        { status: 400 }
      );
    }

    const consumption = data.value - meter.lastReading;

    await prisma.meterReading.create({
      data: {
        meterId: data.meterId,
        period: data.period,
        value: data.value,
        consumption,
        submittedById: session.id,
        status: "SUBMITTED",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
