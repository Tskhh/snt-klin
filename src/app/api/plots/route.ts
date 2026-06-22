import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PLOT_NUMBERS } from "@/config/site";

export async function GET() {
  const plots = await prisma.plot.findMany({
    select: { number: true, status: true },
    orderBy: { number: "asc" },
  });

  if (plots.length === 0) {
    return NextResponse.json(
      PLOT_NUMBERS.map((number) => ({ number, status: "ACTIVE" }))
    );
  }

  const sorted = [...plots].sort(
    (a, b) => Number(a.number) - Number(b.number)
  );

  return NextResponse.json(sorted);
}
