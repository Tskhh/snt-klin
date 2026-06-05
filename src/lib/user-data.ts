import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function getResidentContext() {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      plots: {
        where: { isPrimary: true },
        include: {
          plot: {
            include: {
              meters: { include: { readings: { orderBy: { createdAt: "desc" }, take: 5 } } },
              charges: { orderBy: { createdAt: "desc" }, take: 12 },
              payments: { orderBy: { createdAt: "desc" }, take: 10 },
            },
          },
        },
      },
      notifications: { where: { readAt: null }, orderBy: { createdAt: "desc" }, take: 10 },
      tickets: { orderBy: { updatedAt: "desc" }, take: 5 },
    },
  });

  if (!user) return null;

  const primaryPlot = user.plots[0]?.plot ?? null;

  return { session, user, plot: primaryPlot };
}
