import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DeleteNewsButton } from "@/components/admin/DeleteNewsButton";

export default async function AdminNewsPage() {
  const news = await prisma.news.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Новости</h1>
        <Button href="/admin/news/new" size="lg">
          + Добавить новость
        </Button>
      </div>

      <Card>
        {news.length === 0 ? (
          <p className="text-gray-600">Новостей пока нет. Нажмите «Добавить новость».</p>
        ) : (
          <ul className="divide-y">
            {news.map((n) => (
              <li key={n.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    {n.isPinned && <Badge variant="warning">Закреплено</Badge>}
                    {n.isEmergency && <Badge variant="danger">Авария</Badge>}
                    <Badge variant="info">
                      {n.category === "announcement" ? "Объявление" : "Новость"}
                    </Badge>
                  </div>
                  <Link
                    href={`/news/${n.slug}`}
                    className="text-lg font-semibold hover:text-emerald-800"
                    target="_blank"
                  >
                    {n.title}
                  </Link>
                  <p className="text-sm text-gray-500">{formatDate(n.publishedAt)}</p>
                </div>
                <DeleteNewsButton id={n.id} title={n.title} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
