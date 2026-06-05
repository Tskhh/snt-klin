import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default async function AdminPlotsPage() {
  const plots = await prisma.plot.findMany({
    orderBy: { number: "asc" },
    include: { users: { include: { user: { select: { fullName: true, email: true } } } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Участки</h1>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2">№</th>
                <th className="py-2">Площадь</th>
                <th className="py-2">Владелец</th>
                <th className="py-2">Баланс</th>
                <th className="py-2">Статус</th>
              </tr>
            </thead>
            <tbody>
              {plots.map((p) => (
                <tr key={p.id} className="border-b border-gray-100">
                  <td className="py-3 font-semibold">{p.number}</td>
                  <td className="py-3">{p.areaSqm} м²</td>
                  <td className="py-3">
                    {p.users[0]?.user.fullName || "—"}
                    <br />
                    <span className="text-gray-500">{p.users[0]?.user.email}</span>
                  </td>
                  <td className={`py-3 font-semibold ${p.balance < 0 ? "text-red-600" : ""}`}>
                    {formatMoney(p.balance)}
                  </td>
                  <td className="py-3">
                    <Badge variant={p.status === "ACTIVE" ? "success" : "default"}>
                      {p.status === "ACTIVE" ? "Занят" : "Свободен"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
