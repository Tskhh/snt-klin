/**
 * Добавляет участки 1–205 и 219, если их ещё нет в базе.
 * Запуск: npx tsx scripts/ensure-plots.ts
 */
import "dotenv/config";
import { createPrismaClient } from "../src/lib/create-prisma";
import { PLOT_NUMBERS } from "../src/config/site";

const prisma = createPrismaClient();
const BATCH = 25;

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const existing = await prisma.plot.findMany({ select: { number: true } });
      const existingSet = new Set(existing.map((p) => p.number));
      const missing = PLOT_NUMBERS.filter((n) => !existingSet.has(n));

      if (missing.length === 0) {
        console.log("Все участки уже в базе.");
        return;
      }

      for (let i = 0; i < missing.length; i += BATCH) {
        const chunk = missing.slice(i, i + BATCH);
        await prisma.plot.createMany({
          data: chunk.map((number) => ({
            number,
            areaSqm: 600,
            status: "ACTIVE" as const,
          })),
        });
        console.log(`Добавлено ${Math.min(i + BATCH, missing.length)} / ${missing.length}`);
        await sleep(300);
      }

      console.log(`Готово. Добавлено участков: ${missing.length}`);
      return;
    } catch (err) {
      console.warn(`Попытка ${attempt} не удалась, повтор...`);
      if (attempt === 3) throw err;
      await sleep(3000);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
