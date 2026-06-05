import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  AlertTriangle,
  Newspaper,
  FileText,
  Droplets,
  Phone,
} from "lucide-react";

export default async function HomePage() {
  const [news, emergency, outages] = await Promise.all([
    prisma.news.findMany({
      orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
      take: 4,
    }),
    prisma.news.findFirst({
      where: { isEmergency: true },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.outage.findMany({
      where: { startsAt: { gte: new Date() } },
      orderBy: { startsAt: "asc" },
      take: 3,
    }),
  ]);

  return (
    <div>
      {emergency && (
        <div className="bg-red-600 px-4 py-4 text-white">
          <div className="mx-auto flex max-w-6xl items-start gap-3">
            <AlertTriangle className="mt-1 h-6 w-6 shrink-0" />
            <div>
              <p className="text-lg font-bold">{emergency.title}</p>
              <p className="text-base opacity-95">{emergency.excerpt}</p>
            </div>
          </div>
        </div>
      )}

      <section className="bg-gradient-to-br from-emerald-900 to-emerald-700 px-4 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Садовое товарищество «Клин»
          </h1>
          <p className="mb-8 max-w-2xl text-xl text-emerald-100">
            Новости, показания счётчиков, оплата взносов и обращения — всё в
            одном месте. Простой сайт для каждого садовода.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href="/register" size="lg">
              Зарегистрироваться
            </Button>
            <Button href="/login" variant="secondary" size="lg" className="!border-white !text-white hover:!bg-white/10">
              Войти в кабинет
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/cabinet/meters", icon: Droplets, label: "Показания счётчиков" },
            { href: "/cabinet/billing", icon: FileText, label: "Оплата взносов" },
            { href: "/news", icon: Newspaper, label: "Новости СНТ" },
            { href: "/contacts", icon: Phone, label: "Контакты" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:border-emerald-300 hover:shadow-md"
            >
              <item.icon className="mb-3 h-10 w-10 text-emerald-800" />
              <span className="text-lg font-semibold">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card title="Последние новости">
              <ul className="divide-y divide-gray-100">
                {news.map((item) => (
                  <li key={item.id} className="py-4 first:pt-0 last:pb-0">
                    <Link href={`/news/${item.slug}`} className="group block">
                      <div className="mb-1 flex items-center gap-2">
                        {item.isPinned && (
                          <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                            Важно
                          </span>
                        )}
                        <span className="text-sm text-gray-500">
                          {formatDate(item.publishedAt)}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold group-hover:text-emerald-800">
                        {item.title}
                      </h3>
                      {item.excerpt && (
                        <p className="mt-1 text-gray-600">{item.excerpt}</p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Button href="/news" variant="secondary">
                  Все новости
                </Button>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Ближайшие отключения">
              {outages.length === 0 ? (
                <p className="text-gray-600">Нет запланированных отключений</p>
              ) : (
                <ul className="space-y-3">
                  {outages.map((o) => (
                    <li key={o.id} className="rounded-xl bg-amber-50 p-4">
                      <p className="font-semibold">{o.title}</p>
                      <p className="text-sm text-gray-600">{o.description}</p>
                      <p className="mt-1 text-sm font-medium text-amber-800">
                        {formatDate(o.startsAt)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              <Button href="/outages" variant="ghost" className="mt-4 w-full">
                График отключений
              </Button>
            </Card>

            <Card title="Контакты">
              <p className="text-gray-700">
                <strong>Телефон:</strong> +7 (495) 123-45-67
                <br />
                <strong>Email:</strong> info@snt-klin.ru
                <br />
                <strong>Приём:</strong> пн, ср 18:00–20:00
              </p>
              <Button href="/contacts" variant="secondary" className="mt-4 w-full">
                Подробнее
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
