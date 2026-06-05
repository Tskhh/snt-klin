import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { isAdmin } from "@/lib/jwt";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !isAdmin(session.role)) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const { id } = await params;

  await prisma.news.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      actorId: session.id,
      action: "news.delete",
      entity: "News",
      entityId: id,
    },
  });

  return NextResponse.json({ ok: true });
}
