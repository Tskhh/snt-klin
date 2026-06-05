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

  const reading = await prisma.meterReading.findUnique({
    where: { id },
    include: { meter: true },
  });

  if (!reading) {
    return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.meterReading.update({
      where: { id },
      data: {
        status: "APPROVED",
        reviewedById: session.id,
        reviewedAt: new Date(),
      },
    }),
    prisma.meter.update({
      where: { id: reading.meterId },
      data: { lastReading: reading.value },
    }),
    prisma.auditLog.create({
      data: {
        actorId: session.id,
        action: "meterReading.approve",
        entity: "MeterReading",
        entityId: id,
      },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
