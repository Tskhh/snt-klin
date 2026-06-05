import { prisma } from "@/lib/prisma";
import { currentPeriod } from "@/lib/utils";

export async function generateChargesForPeriod(period: string = currentPeriod()) {
  const plots = await prisma.plot.findMany({
    where: { status: "ACTIVE" },
    include: {
      meters: {
        include: {
          readings: {
            where: { period, status: "APPROVED" },
          },
        },
      },
      charges: { where: { period } },
    },
  });

  const tariffs = await prisma.tariff.findMany({
    where: {
      OR: [{ validTo: null }, { validTo: { gte: new Date() } }],
      validFrom: { lte: new Date() },
    },
  });

  const membershipTariff = tariffs.find((t) => t.type === "MEMBERSHIP");
  const electricityTariff = tariffs.find((t) => t.type === "ELECTRICITY");
  const waterTariff = tariffs.find((t) => t.type === "WATER");

  let created = 0;

  for (const plot of plots) {
    if (plot.charges.length > 0) continue;

    const charges: {
      plotId: string;
      period: string;
      type: "MEMBERSHIP" | "ELECTRICITY" | "WATER";
      amount: number;
      description: string;
      meterReadingId?: string;
    }[] = [];

    if (membershipTariff) {
      const amount =
        membershipTariff.unit === "per_plot"
          ? membershipTariff.pricePerUnit
          : (plot.areaSqm / 100) * membershipTariff.pricePerUnit;
      charges.push({
        plotId: plot.id,
        period,
        type: "MEMBERSHIP",
        amount: Math.round(amount * 100) / 100,
        description: `Членский взнос за ${period}`,
      });
    }

    for (const meter of plot.meters) {
      const reading = meter.readings[0];
      if (!reading) continue;

      if (meter.type === "ELECTRICITY" && electricityTariff) {
        charges.push({
          plotId: plot.id,
          period,
          type: "ELECTRICITY",
          amount:
            Math.round(reading.consumption * electricityTariff.pricePerUnit * 100) /
            100,
          description: `Электричество: ${reading.consumption} кВт·ч`,
          meterReadingId: reading.id,
        });
      }

      if (meter.type === "WATER" && waterTariff) {
        charges.push({
          plotId: plot.id,
          period,
          type: "WATER",
          amount:
            Math.round(reading.consumption * waterTariff.pricePerUnit * 100) / 100,
          description: `Вода: ${reading.consumption} м³`,
          meterReadingId: reading.id,
        });
      }
    }

    if (charges.length === 0) continue;

    const total = charges.reduce((s, c) => s + c.amount, 0);

    await prisma.$transaction(async (tx) => {
      for (const c of charges) {
        await tx.charge.create({
          data: { ...c, status: "ISSUED" },
        });
      }
      await tx.plot.update({
        where: { id: plot.id },
        data: { balance: { decrement: total } },
      });
    });

    created += charges.length;
  }

  return { created, period };
}

export async function processDemoPayment(paymentId: string) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { plot: { include: { charges: { where: { status: { in: ["ISSUED", "PARTIALLY_PAID"] } } } } } },
  });

  if (!payment || payment.status === "PAID") return null;

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: paymentId },
      data: { status: "PAID", paidAt: new Date() },
    });

    let remaining = payment.amount;
    const charges = payment.plot.charges.sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );

    for (const charge of charges) {
      if (remaining <= 0) break;
      const alloc = Math.min(remaining, charge.amount);
      remaining -= alloc;
      await tx.paymentAllocation.create({
        data: { paymentId, chargeId: charge.id, amount: alloc },
      });
      await tx.charge.update({
        where: { id: charge.id },
        data: { status: alloc >= charge.amount ? "PAID" : "PARTIALLY_PAID" },
      });
    }

    await tx.plot.update({
      where: { id: payment.plotId },
      data: { balance: { increment: payment.amount } },
    });
  });

  return prisma.payment.findUnique({ where: { id: paymentId } });
}
