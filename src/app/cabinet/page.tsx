import Link from "next/link";
import { getResidentContext } from "@/lib/user-data";
import { formatMoney, formatDate, currentPeriod, statusLabel } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AlertCircle, Gauge, CreditCard } from "lucide-react";

export default async function CabinetDashboard() {
  const ctx = await getResidentContext();
  if (!ctx?.plot) {
    return (
      <Card title="Личный кабинет">
        <p>Участок не привязан. Обратитесь к администратору СНТ.</p>
      </Card>
    );
  }

  const { session, plot, user } = ctx;
  const debt = plot.balance < 0 ? Math.abs(plot.balance) : 0;
  const period = currentPeriod();
  const hasReading = plot.meters.some((m) =>
    m.readings.some((r) => r.period === period)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Здравствуйте, {session.fullName.split(" ")[0]}!
        </h1>
        <p className="text-gray-600">Участок № {plot.number}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className={debt > 0 ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
          <p className="text-sm font-medium text-gray-600">Задолженность</p>
          <p className={`text-3xl font-bold ${debt > 0 ? "text-red-700" : "text-green-700"}`}>
            {debt > 0 ? formatMoney(debt) : "Нет долга"}
          </p>
          {debt > 0 && (
            <Button href="/cabinet/billing" className="mt-4" size="lg">
              Оплатить
            </Button>
          )}
        </Card>

        <Card>
          <p className="text-sm font-medium text-gray-600">Баланс участка</p>
          <p className="text-3xl font-bold text-gray-900">{formatMoney(plot.balance)}</p>
          <p className="mt-1 text-sm text-gray-500">
            Отрицательное значение — задолженность
          </p>
        </Card>
      </div>

      {!hasReading && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <AlertCircle className="h-6 w-6 shrink-0 text-amber-600" />
          <div>
            <p className="font-semibold text-amber-900">Передайте показания до 28 числа</p>
            <p className="text-amber-800">Период: {period}</p>
            <Button href="/cabinet/meters" variant="secondary" className="mt-3">
              Передать показания
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/cabinet/meters"
          className="flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-sm hover:border-emerald-300"
        >
          <Gauge className="h-10 w-10 text-emerald-800" />
          <div>
            <p className="font-semibold">Счётчики</p>
            <p className="text-sm text-gray-500">Передать показания</p>
          </div>
        </Link>
        <Link
          href="/cabinet/billing"
          className="flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-sm hover:border-emerald-300"
        >
          <CreditCard className="h-10 w-10 text-emerald-800" />
          <div>
            <p className="font-semibold">Оплата</p>
            <p className="text-sm text-gray-500">Начисления и квитанции</p>
          </div>
        </Link>
      </div>

      {user.notifications.length > 0 && (
        <Card title="Уведомления">
          <ul className="space-y-3">
            {user.notifications.map((n) => (
              <li key={n.id} className="rounded-xl bg-gray-50 p-4">
                <p className="font-semibold">{n.title}</p>
                <p className="text-gray-600">{n.body}</p>
                <p className="mt-1 text-sm text-gray-400">{formatDate(n.createdAt)}</p>
              </li>
            ))}
          </ul>
          <Button href="/cabinet/notifications" variant="ghost" className="mt-4">
            Все уведомления
          </Button>
        </Card>
      )}

      {user.tickets.length > 0 && (
        <Card title="Последние обращения">
          <ul className="space-y-2">
            {user.tickets.map((t) => (
              <li key={t.id} className="flex items-center justify-between rounded-xl border p-4">
                <span className="font-medium">{t.subject}</span>
                <Badge variant="info">{statusLabel(t.status)}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
