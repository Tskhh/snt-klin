import { prisma } from "@/lib/prisma";
import { formatDate, formatDateTime } from "@/lib/utils";
import { Card } from "@/components/ui/Card";

export default async function OutagesPage() {
  const outages = await prisma.outage.findMany({
    orderBy: { startsAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-8 text-4xl font-bold">График отключений</h1>
      {outages.length === 0 ? (
        <Card><p>Запланированных отключений нет</p></Card>
      ) : (
        <ul className="space-y-4">
          {outages.map((o) => (
            <li key={o.id}>
              <Card className="border-amber-200 bg-amber-50">
                <h2 className="text-xl font-bold text-amber-900">{o.title}</h2>
                <p className="mt-2 text-gray-700">{o.description}</p>
                <p className="mt-3 font-medium">
                  {formatDateTime(o.startsAt)}
                  {o.endsAt && ` — ${formatDateTime(o.endsAt)}`}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
