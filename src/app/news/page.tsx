import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/Card";

export default async function NewsListPage() {
  const news = await prisma.news.findMany({
    orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-4 text-4xl font-bold">Доска объявлений</h1>
      <p className="mb-8 text-lg text-gray-600">
        Сообщения правления, графики работ и объявления соседей.
      </p>

      <section id="pravlenie" className="mb-10 scroll-mt-24">
        <h2 className="mb-4 text-2xl font-bold">Оперативные сообщения от правления</h2>
      </section>

      <section id="sadovody" className="mb-6 scroll-mt-24">
        <h2 className="mb-4 text-2xl font-bold">Объявления от садоводов</h2>
        <p className="mb-6 text-sm text-gray-500">
          Все новости ниже; от правления — с пометкой «Важно».
        </p>
      </section>

      <ul className="space-y-4">
        {news.map((item) => (
          <li key={item.id}>
            <Link href={`/news/${item.slug}`}>
              <Card className="transition hover:border-emerald-300 hover:shadow-md">
                <div className="flex flex-wrap items-center gap-2">
                  {item.isPinned && (
                    <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                      Важно
                    </span>
                  )}
                  <span className="text-sm text-gray-500">{formatDate(item.publishedAt)}</span>
                </div>
                <h2 className="mt-2 text-2xl font-bold hover:text-emerald-800">{item.title}</h2>
                {item.excerpt && <p className="mt-2 text-gray-600">{item.excerpt}</p>}
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
