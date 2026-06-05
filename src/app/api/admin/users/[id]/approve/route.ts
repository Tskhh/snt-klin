import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/jwt";
import { getSession } from "@/lib/session";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !isAdmin(session.role)) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const { id } = await params;

  await prisma.$transaction([
    prisma.user.update({
      where: { id },
      data: { status: "ACTIVE", emailVerifiedAt: new Date() },
    }),
    prisma.userPlot.updateMany({
      where: { userId: id },
      data: { approvedAt: new Date() },
    }),
    prisma.notification.create({
      data: {
        userId: id,
        title: "Регистрация подтверждена",
        body: "Добро пожаловать! Вам открыт доступ к личному кабинету.",
      },
    }),
    prisma.auditLog.create({
      data: {
        actorId: session.id,
        action: "user.approve",
        entity: "User",
        entityId: id,
      },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
