import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/jwt";
import { getSession } from "@/lib/session";
import { generateChargesForPeriod } from "@/lib/billing";
import { prisma } from "@/lib/prisma";

const schema = z.object({ period: z.string() });

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !isAdmin(session.role)) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  try {
    const { period } = schema.parse(await request.json());
    const result = await generateChargesForPeriod(period);

    await prisma.auditLog.create({
      data: {
        actorId: session.id,
        action: "charges.generate",
        entity: "Charge",
        payload: JSON.stringify(result),
      },
    });

    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
