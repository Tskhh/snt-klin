import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, statusLabel } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default async function AdminTicketsPage() {
  const tickets = await prisma.ticket.findMany({
    orderBy: { updatedAt: "desc" },
    include: { user: { select: { fullName: true, email: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Обращения жителей</h1>
      <Card>
        <ul className="divide-y">
          {tickets.map((t) => (
            <li key={t.id} className="py-4">
              <Link href={`/admin/tickets/${t.id}`} className="block hover:text-emerald-800">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold">{t.subject}</span>
                  <Badge variant="info">{statusLabel(t.status)}</Badge>
                </div>
                <p className="text-sm text-gray-500">
                  {t.user.fullName} · {formatDate(t.updatedAt)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
        {tickets.length === 0 && <p className="text-gray-600">Обращений нет</p>}
      </Card>
    </div>
  );
}
