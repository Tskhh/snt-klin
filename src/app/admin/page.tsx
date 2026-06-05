import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { currentPeriod } from "@/lib/utils";

export default async function AdminDashboard() {
  const period = currentPeriod();

  const [usersCount, plotsCount, pendingUsers, readingsSubmitted, openTickets] =
    await Promise.all([
      prisma.user.count({ where: { role: "RESIDENT", status: "ACTIVE" } }),
      prisma.plot.count({ where: { status: "ACTIVE" } }),
      prisma.user.count({ where: { status: "PENDING" } }),
      prisma.meterReading.count({ where: { period } }),
      prisma.ticket.count({ where: { status: { in: ["NEW", "IN_PROGRESS"] } } }),
    ]);

  const totalDebt = Math.abs(
    (await prisma.plot.findMany({ where: { balance: { lt: 0 } } })).reduce(
      (s, p) => s + p.balance,
      0
    )
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Админ-панель СНТ «Клин»</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-sm text-gray-500">Жителей</p>
          <p className="text-3xl font-bold">{usersCount}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Участков</p>
          <p className="text-3xl font-bold">{plotsCount}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Задолженность</p>
          <p className="text-3xl font-bold text-red-600">{formatMoney(totalDebt)}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Показаний за {period}</p>
          <p className="text-3xl font-bold">{readingsSubmitted}</p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Требуют внимания">
          <ul className="space-y-3">
            <li>
              <Link href="/admin/users?status=PENDING" className="text-emerald-800 hover:underline">
                Регистрации на проверке: <strong>{pendingUsers}</strong>
              </Link>
            </li>
            <li>
              <Link href="/admin/tickets" className="text-emerald-800 hover:underline">
                Открытые обращения: <strong>{openTickets}</strong>
              </Link>
            </li>
            <li>
              <Link href="/admin/meters" className="text-emerald-800 hover:underline">
                Проверить показания →
              </Link>
            </li>
          </ul>
        </Card>
        <Card title="Быстрые действия">
          <ul className="space-y-2 text-emerald-800">
            <li>
              <Link href="/admin/charges" className="hover:underline">
                Создать начисления за месяц
              </Link>
            </li>
            <li>
              <Link href="/admin/news" className="hover:underline">
                Добавить новость
              </Link>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
