import { getResidentContext } from "@/lib/user-data";
import { formatDate, statusLabel, currentPeriod } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { MeterSubmitForm } from "@/components/MeterSubmitForm";
import { Badge } from "@/components/ui/Badge";

const meterLabels: Record<string, string> = {
  ELECTRICITY: "Электричество",
  WATER: "Вода",
  GAS: "Газ",
};

const meterUnits: Record<string, string> = {
  ELECTRICITY: "кВт·ч",
  WATER: "м³",
  GAS: "м³",
};

export default async function MetersPage() {
  const ctx = await getResidentContext();
  if (!ctx?.plot) return <Card title="Счётчики"><p>Участок не найден</p></Card>;

  const period = currentPeriod();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Счётчики</h1>
      <p className="text-gray-600">
        Передайте показания за период <strong>{period}</strong> (с 20 по 28 число)
      </p>

      {ctx.plot.meters.map((meter) => {
        const currentReading = meter.readings.find((r) => r.period === period);
        return (
          <Card key={meter.id} title={meterLabels[meter.type] || meter.type}>
            <p className="mb-4 text-gray-600">
              Предыдущее показание: <strong>{meter.lastReading}</strong> {meterUnits[meter.type]}
            </p>

            {currentReading ? (
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-lg font-semibold">
                    Передано: {currentReading.value} ({currentReading.consumption}{" "}
                    {meterUnits[meter.type]})
                  </span>
                  <Badge
                    variant={
                      currentReading.status === "APPROVED"
                        ? "success"
                        : currentReading.status === "REJECTED"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {statusLabel(currentReading.status)}
                  </Badge>
                </div>
                {currentReading.rejectReason && (
                  <p className="mt-2 text-red-600">{currentReading.rejectReason}</p>
                )}
              </div>
            ) : (
              <MeterSubmitForm
                meterId={meter.id}
                lastReading={meter.lastReading}
                unit={meterUnits[meter.type]}
                period={period}
              />
            )}

            {meter.readings.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-2 font-semibold">История</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2">Период</th>
                        <th className="py-2">Значение</th>
                        <th className="py-2">Расход</th>
                        <th className="py-2">Статус</th>
                      </tr>
                    </thead>
                    <tbody>
                      {meter.readings.map((r) => (
                        <tr key={r.id} className="border-b border-gray-100">
                          <td className="py-2">{r.period}</td>
                          <td className="py-2">{r.value}</td>
                          <td className="py-2">{r.consumption}</td>
                          <td className="py-2">{statusLabel(r.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
