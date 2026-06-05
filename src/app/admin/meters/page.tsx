import { prisma } from "@/lib/prisma";
import { currentPeriod, statusLabel } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { ApproveReadingButton } from "@/components/admin/ApproveReadingButton";

export default async function AdminMetersPage() {
  const period = currentPeriod();
  const readings = await prisma.meterReading.findMany({
    where: { period },
    orderBy: { createdAt: "desc" },
    include: {
      meter: { include: { plot: true } },
      submittedBy: { select: { fullName: true } },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Показания ({period})</h1>
      <Card>
        {readings.length === 0 ? (
          <p className="text-gray-600">Показаний за период нет</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Участок</th>
                  <th className="py-2">Тип</th>
                  <th className="py-2">Значение</th>
                  <th className="py-2">Расход</th>
                  <th className="py-2">Житель</th>
                  <th className="py-2">Статус</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {readings.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100">
                    <td className="py-3">№{r.meter.plot.number}</td>
                    <td className="py-3">{r.meter.type}</td>
                    <td className="py-3">{r.value}</td>
                    <td className="py-3">{r.consumption}</td>
                    <td className="py-3">{r.submittedBy.fullName}</td>
                    <td className="py-3">{statusLabel(r.status)}</td>
                    <td className="py-3">
                      {r.status === "SUBMITTED" && (
                        <ApproveReadingButton readingId={r.id} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
