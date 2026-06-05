import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { processDemoPayment } from "@/lib/billing";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.status !== "ACTIVE") {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const { id } = await params;
  const payment = await processDemoPayment(id);

  if (!payment) {
    return NextResponse.json({ error: "Платёж не найден" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, status: payment.status });
}
