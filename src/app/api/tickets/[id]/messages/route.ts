import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const schema = z.object({ body: z.string().min(1) });

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const { id } = await params;
  const ticket = await prisma.ticket.findUnique({ where: { id } });
  if (!ticket) {
    return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  }

  const data = schema.parse(await request.json());
  const isStaff = session.role === "ADMIN" || session.role === "SUPER_ADMIN";

  if (!isStaff && ticket.userId !== session.id) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  await prisma.ticketMessage.create({
    data: {
      ticketId: id,
      userId: session.id,
      body: data.body,
      isStaff,
    },
  });

  await prisma.ticket.update({
    where: { id },
    data: { status: isStaff ? "ANSWERED" : "IN_PROGRESS", updatedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
