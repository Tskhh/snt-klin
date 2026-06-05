import { getResidentContext } from "@/lib/user-data";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/Card";

export default async function NotificationsPage() {
  const ctx = await getResidentContext();
  if (!ctx) return null;

  const notifications = await prisma.notification.findMany({
    where: { userId: ctx.session.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Уведомления</h1>
      {notifications.length === 0 ? (
        <Card><p className="text-gray-600">Уведомлений нет</p></Card>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`rounded-2xl border p-5 ${n.readAt ? "bg-white" : "border-emerald-200 bg-emerald-50"}`}
            >
              <p className="font-semibold">{n.title}</p>
              <p className="mt-1 text-gray-600">{n.body}</p>
              <p className="mt-2 text-sm text-gray-400">{formatDate(n.createdAt)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
