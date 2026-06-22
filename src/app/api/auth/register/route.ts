import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { PLOT_NUMBERS } from "@/config/site";

const schema = z.object({
  fullName: z.string().min(3, "Укажите ФИО"),
  plotNumber: z.string().min(1, "Укажите номер участка"),
  phone: z.string().min(10, "Укажите телефон"),
  email: z.string().email("Некорректный email"),
  password: z.string().min(8, "Пароль минимум 8 символов"),
  consent: z.literal(true, { message: "Необходимо согласие на обработку данных" }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже зарегистрирован" },
        { status: 400 }
      );
    }

    if (!PLOT_NUMBERS.includes(data.plotNumber)) {
      return NextResponse.json(
        { error: "Указан несуществующий номер участка" },
        { status: 400 }
      );
    }

    let plot = await prisma.plot.findUnique({
      where: { number: data.plotNumber },
    });

    if (!plot && PLOT_NUMBERS.includes(data.plotNumber)) {
      plot = await prisma.plot.create({
        data: {
          number: data.plotNumber,
          areaSqm: 600,
          status: "ACTIVE",
        },
      });
    }

    if (!plot) {
      return NextResponse.json(
        { error: "Участок с таким номером не найден. Обратитесь к администратору." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        phone: data.phone,
        passwordHash,
        status: "PENDING",
        plots: {
          create: { plotId: plot.id, isPrimary: true },
        },
      },
    });

    for (const type of ["ELECTRICITY", "WATER"] as const) {
      const exists = await prisma.meter.findUnique({
        where: { plotId_type: { plotId: plot.id, type } },
      });
      if (!exists) {
        await prisma.meter.create({
          data: { plotId: plot.id, type, lastReading: 0 },
        });
      }
    }

    return NextResponse.json({
      ok: true,
      message: "Регистрация отправлена на проверку администратору",
      userId: user.id,
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
