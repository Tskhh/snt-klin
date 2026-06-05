import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const schema = z.object({
  plotId: z.string(),
  amount: z.number().positive(),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.status !== "ACTIVE") {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = schema.parse(body);

    const link = await prisma.userPlot.findFirst({
      where: { userId: session.id, plotId: data.plotId },
    });
    if (!link) {
      return NextResponse.json({ error: "Нет доступа к участку" }, { status: 403 });
    }

    const payment = await prisma.payment.create({
      data: {
        plotId: data.plotId,
        userId: session.id,
        amount: data.amount,
        provider: "DEMO",
        status: "PENDING",
        description: "Оплата взносов СНТ (демо)",
      },
    });

    return NextResponse.json({ paymentId: payment.id });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
