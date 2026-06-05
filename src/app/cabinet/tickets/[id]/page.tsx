import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { formatDateTime, statusLabel } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TicketReplyForm } from "@/components/TicketReplyForm";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  const { id } = await params;

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      messages: { orderBy: { createdAt: "asc" }, include: { user: { select: { fullName: true } } } },
    },
  });

  if (!ticket || ticket.userId !== session?.id) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="info">{statusLabel(ticket.status)}</Badge>
        <h1 className="mt-2 text-2xl font-bold">{ticket.subject}</h1>
      </div>

      <Card>
        <div className="space-y-4">
          {ticket.messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-xl p-4 ${
                m.isStaff ? "bg-emerald-50 border border-emerald-100" : "bg-gray-50"
              }`}
            >
              <p className="text-sm font-semibold text-gray-600">
                {m.isStaff ? "Администрация" : m.user.fullName} · {formatDateTime(m.createdAt)}
              </p>
              <p className="mt-2 whitespace-pre-wrap">{m.body}</p>
            </div>
          ))}
        </div>
        {ticket.status !== "CLOSED" && (
          <div className="mt-6 border-t pt-6">
            <TicketReplyForm ticketId={ticket.id} />
          </div>
        )}
      </Card>
    </div>
  );
}
