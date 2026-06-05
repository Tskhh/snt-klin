import { currentPeriod } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { GenerateChargesButton } from "@/components/admin/GenerateChargesButton";

export default function AdminChargesPage() {
  const period = currentPeriod();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Начисления</h1>
      <Card title={`Создать начисления за ${period}`}>
        <p className="mb-4 text-gray-600">
          Система рассчитает членский взнос и коммунальные услуги по одобренным
          показаниям счётчиков.
        </p>
        <GenerateChargesButton period={period} />
      </Card>
    </div>
  );
}
