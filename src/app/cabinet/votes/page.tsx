import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { VoteForm } from "@/components/VoteForm";
import { Badge } from "@/components/ui/Badge";

export default async function VotesPage() {
  const session = await getSession();
  if (!session) return null;

  const votes = await prisma.vote.findMany({
    where: { status: { in: ["ACTIVE", "CLOSED"] } },
    include: {
      options: { include: { _count: { select: { ballots: true } } } },
      ballots: { where: { userId: session.id } },
    },
    orderBy: { startsAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Голосования</h1>
      {votes.length === 0 ? (
        <Card><p className="text-gray-600">Активных голосований нет</p></Card>
      ) : (
        votes.map((vote) => {
          const voted = vote.ballots.length > 0;
          const totalVotes = vote.options.reduce((s, o) => s + o._count.ballots, 0);
          return (
            <Card key={vote.id} title={vote.title}>
              <p className="mb-4 text-gray-600">{vote.description}</p>
              <p className="mb-4 text-sm text-gray-500">
                {formatDate(vote.startsAt)} — {formatDate(vote.endsAt)}
                {vote.status === "CLOSED" && (
                  <span className="ml-2">
                    <Badge variant="default">Завершено</Badge>
                  </span>
                )}
              </p>
              {vote.status === "ACTIVE" && !voted && (
                <VoteForm voteId={vote.id} options={vote.options} />
              )}
              {voted && <p className="font-semibold text-emerald-700">Вы уже проголосовали</p>}
              {(vote.status === "CLOSED" || vote.resultsPublic) && totalVotes > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="font-semibold">Результаты ({totalVotes} голосов):</p>
                  {vote.options.map((o) => (
                    <div key={o.id}>
                      <div className="flex justify-between text-sm">
                        <span>{o.label}</span>
                        <span>{o._count.ballots}</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-emerald-600"
                          style={{
                            width: `${totalVotes ? (o._count.ballots / totalVotes) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })
      )}
    </div>
  );
}
