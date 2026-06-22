/**
 * Добавляет участки 1–205 и 219, если их ещё нет в базе.
 * Запуск: npx tsx scripts/ensure-plots.ts
 */
import "dotenv/config";
import { createPrismaClient } from "../src/lib/create-prisma";
import { PLOT_NUMBERS } from "../src/config/site";

const prisma = createPrismaClient();

async function main() {
  const existing = await prisma.plot.findMany({ select: { number: true } });
  const existingSet = new Set(existing.map((p) => p.number));

  const missing = PLOT_NUMBERS.filter((n) => !existingSet.has(n));
  if (missing.length === 0) {
    console.log("Все участки уже в базе.");
    return;
  }

  await prisma.plot.createMany({
    data: missing.map((number) => ({
      number,
      areaSqm: 600,
      status: "ACTIVE" as const,
    })),
  });

  console.log(`Добавлено участков: ${missing.length}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
