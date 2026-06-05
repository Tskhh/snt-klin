import { getResidentContext } from "@/lib/user-data";
import { formatDate, statusLabel } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TicketForm } from "@/components/TicketForm";
import Link from "next/link";

export default async function TicketsPage() {
  const ctx = await getResidentContext();
  if (!ctx) return null;

  const tickets = await import("@/lib/prisma").then(({ prisma }) =>
    prisma.ticket.findMany({
      where: { userId: ctx.session.id },
      orderBy: { updatedAt: "desc" },
      include: { messages: { take: 1, orderBy: { createdAt: "desc" } } },
    })
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Обращения</h1>
      <Card title="Новое обращение">
        <TicketForm />
      </Card>
      <Card title="Мои обращения">
        {tickets.length === 0 ? (
          <p className="text-gray-600">Обращений пока нет</p>
        ) : (
          <ul className="divide-y">
            {tickets.map((t) => (
              <li key={t.id} className="py-4">
                <Link href={`/cabinet/tickets/${t.id}`} className="block hover:text-emerald-800">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-lg font-semibold">{t.subject}</span>
                    <Badge variant="info">{statusLabel(t.status)}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{formatDate(t.updatedAt)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
