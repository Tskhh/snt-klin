import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const schema = z.object({
  subject: z.string().min(3),
  category: z.string(),
  body: z.string().min(10),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.status !== "ACTIVE") {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const data = schema.parse(await request.json());

    const ticket = await prisma.ticket.create({
      data: {
        userId: session.id,
        subject: data.subject,
        category: data.category,
        messages: {
          create: {
            userId: session.id,
            body: data.body,
            isStaff: false,
          },
        },
      },
    });

    return NextResponse.json({ id: ticket.id });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
