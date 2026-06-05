import { prisma } from "@/lib/prisma";
import { formatDate, statusLabel } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ApproveUserButton } from "@/components/admin/ApproveUserButton";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const users = await prisma.user.findMany({
    where: status ? { status: status as "PENDING" | "ACTIVE" | "BLOCKED" } : undefined,
    orderBy: { createdAt: "desc" },
    include: { plots: { include: { plot: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Пользователи</h1>
      <div className="flex gap-2">
        <a href="/admin/users" className="rounded-lg bg-gray-100 px-3 py-1">Все</a>
        <a href="/admin/users?status=PENDING" className="rounded-lg bg-amber-100 px-3 py-1">Ожидают</a>
        <a href="/admin/users?status=ACTIVE" className="rounded-lg bg-green-100 px-3 py-1">Активные</a>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2">ФИО</th>
                <th className="py-2">Email</th>
                <th className="py-2">Участок</th>
                <th className="py-2">Статус</th>
                <th className="py-2">Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-100">
                  <td className="py-3">{u.fullName}</td>
                  <td className="py-3">{u.email}</td>
                  <td className="py-3">
                    {u.plots.map((p) => `№${p.plot.number}`).join(", ") || "—"}
                  </td>
                  <td className="py-3">
                    <Badge variant={u.status === "ACTIVE" ? "success" : "warning"}>
                      {statusLabel(u.status)}
                    </Badge>
                  </td>
                  <td className="py-3">
                    {u.status === "PENDING" && <ApproveUserButton userId={u.id} />}
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
