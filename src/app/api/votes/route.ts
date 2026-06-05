import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const schema = z.object({
  voteId: z.string(),
  optionId: z.string(),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.status !== "ACTIVE") {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const data = schema.parse(await request.json());

    const vote = await prisma.vote.findUnique({
      where: { id: data.voteId },
      include: { options: true },
    });

    if (!vote || vote.status !== "ACTIVE") {
      return NextResponse.json({ error: "Голосование недоступно" }, { status: 400 });
    }

    const now = new Date();
    if (now < vote.startsAt || now > vote.endsAt) {
      return NextResponse.json({ error: "Голосование закрыто" }, { status: 400 });
    }

    if (!vote.options.some((o) => o.id === data.optionId)) {
      return NextResponse.json({ error: "Неверный вариант" }, { status: 400 });
    }

    const existing = await prisma.voteBallot.findUnique({
      where: { voteId_userId: { voteId: data.voteId, userId: session.id } },
    });
    if (existing) {
      return NextResponse.json({ error: "Вы уже голосовали" }, { status: 400 });
    }

    await prisma.voteBallot.create({
      data: {
        voteId: data.voteId,
        userId: session.id,
        optionId: data.optionId,
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
