import { getResidentContext } from "@/lib/user-data";
import { formatMoney, formatDate, statusLabel } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { PayButton } from "@/components/PayButton";
import { Badge } from "@/components/ui/Badge";

export default async function BillingPage() {
  const ctx = await getResidentContext();
  if (!ctx?.plot) return <Card title="Оплата"><p>Участок не найден</p></Card>;

  const { plot } = ctx;
  const debt = plot.balance < 0 ? Math.abs(plot.balance) : 0;
  const unpaidCharges = plot.charges.filter((c) =>
    ["ISSUED", "PARTIALLY_PAID"].includes(c.status)
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Мои платежи</h1>
      <p className="text-gray-600">
        Членские и целевые взносы, электроэнергия и реквизиты — всё в одном разделе.
      </p>

      <section id="membership" className="scroll-mt-24">
        <h2 className="mb-3 text-xl font-bold">Членские взносы</h2>
      </section>

      <Card className={debt > 0 ? "border-red-200" : ""}>
        <p className="text-gray-600">К оплате</p>
        <p className="text-4xl font-bold text-gray-900">{formatMoney(debt)}</p>
        {debt > 0 && (
          <div className="mt-4">
            <PayButton plotId={plot.id} amount={debt} />
          </div>
        )}
      </Card>

      <section id="target" className="scroll-mt-24">
        <h2 className="mb-3 text-xl font-bold">Целевые взносы</h2>
        <p className="mb-4 text-sm text-gray-500">
          Ремонт дорог, ограждение, общие работы — отображаются в начислениях ниже.
        </p>
      </section>

      <section id="electricity" className="scroll-mt-24">
        <h2 className="mb-3 text-xl font-bold">Оплата электроэнергии</h2>
        <p className="mb-4 text-sm text-gray-500">
          По показаниям счётчика; передавайте показания до 28 числа каждого месяца.
        </p>
      </section>

      <Card title="Начисления">
        {plot.charges.length === 0 ? (
          <p className="text-gray-600">Начислений пока нет</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-sm text-gray-500">
                  <th className="py-3">Период</th>
                  <th className="py-3">Описание</th>
                  <th className="py-3">Сумма</th>
                  <th className="py-3">Статус</th>
                </tr>
              </thead>
              <tbody>
                {plot.charges.map((c) => (
                  <tr key={c.id} className="border-b border-gray-100">
                    <td className="py-3">{c.period}</td>
                    <td className="py-3">{c.description}</td>
                    <td className="py-3 font-semibold">{formatMoney(c.amount)}</td>
                    <td className="py-3">
                      <Badge
                        variant={c.status === "PAID" ? "success" : "warning"}
                      >
                        {statusLabel(c.status)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <section id="requisites" className="scroll-mt-24">
        <Card title="Реквизиты для оплаты">
          <p className="text-gray-700">
            Получатель: СНТ «Клин»
            <br />
            ИНН 5020016449 · р/с уточняйте в бухгалтерии
            <br />
            Назначение платежа: участок № {plot.number}, ФИО плательщика
          </p>
        </Card>
      </section>

      <Card title="История платежей">
        {plot.payments.length === 0 ? (
          <p className="text-gray-600">Платежей пока нет</p>
        ) : (
          <ul className="divide-y">
            {plot.payments.map((p) => (
              <li key={p.id} className="flex justify-between py-4">
                <div>
                  <p className="font-semibold">{formatMoney(p.amount)}</p>
                  <p className="text-sm text-gray-500">
                    {p.description || "Оплата взносов"}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant={p.status === "PAID" ? "success" : "warning"}>
                    {statusLabel(p.status)}
                  </Badge>
                  <p className="mt-1 text-sm text-gray-400">
                    {p.paidAt ? formatDate(p.paidAt) : formatDate(p.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
