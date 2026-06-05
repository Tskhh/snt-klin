import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await prisma.news.findUnique({ where: { slug } });
  if (!item) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/news" className="text-emerald-800 hover:underline">
        ← Все новости
      </Link>
      <p className="mt-4 text-gray-500">{formatDate(item.publishedAt)}</p>
      <h1 className="mt-2 text-4xl font-bold">{item.title}</h1>
      <div className="prose mt-8 whitespace-pre-wrap text-lg leading-relaxed text-gray-800">
        {item.body}
      </div>
    </article>
  );
}
