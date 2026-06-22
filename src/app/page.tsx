import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BoardSection } from "@/components/BoardSection";
import { SITE, formatAddress } from "@/config/site";
import {
  AlertTriangle,
  Newspaper,
  FileText,
  Droplets,
  MapPin,
  Mail,
  LogIn,
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
        <div className="bg-red-700 px-4 py-4 text-white">
          <div className="mx-auto flex max-w-6xl items-start gap-3">
            <AlertTriangle className="mt-1 h-6 w-6 shrink-0" />
            <div>
              <p className="text-lg font-bold">{emergency.title}</p>
              <p className="text-base opacity-95">{emergency.excerpt}</p>
            </div>
          </div>
        </div>
      )}

      <section className="hero-pattern px-4 py-12 text-white md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Image
            src="/logo.png"
            alt={SITE.shortName}
            width={120}
            height={120}
            className="mx-auto mb-6 h-24 w-24 rounded-2xl object-contain md:h-28 md:w-28"
            priority
          />
          <h1 className="font-serif text-3xl font-bold tracking-wide md:text-5xl">
            {SITE.shortName}
          </h1>
          <div className="gold-divider">
            <span />
          </div>
          <p className="text-sm font-medium uppercase tracking-widest text-[var(--gold-light)] md:text-base">
            {SITE.fullName}
          </p>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/90 md:text-xl">
            {SITE.slogan}
            <br />
            <span className="text-base text-white/75">{SITE.sloganSub}</span>
          </p>
          <div className="mt-8">
            <Button
              href="/login"
              size="lg"
              className="!bg-[var(--gold)] !text-[var(--charcoal)] hover:!bg-[var(--gold-light)]"
            >
              <LogIn className="h-5 w-5" />
              Вход в личный кабинет
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/news", icon: Newspaper, label: "Доска объявлений" },
            { href: "/cabinet/meters", icon: Droplets, label: "Показания счётчиков" },
            { href: "/cabinet/billing", icon: FileText, label: "Оплата взносов" },
            { href: "/contacts", icon: MapPin, label: "Контакты" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center rounded-2xl border border-[var(--sage)]/20 bg-white p-6 text-center shadow-sm transition hover:border-[var(--gold)]/50 hover:shadow-md"
            >
              <item.icon className="mb-3 h-10 w-10 text-[var(--sage-dark)]" />
              <span className="text-base font-semibold md:text-lg">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="mb-14">
          <BoardSection />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card title="Последние новости">
              <ul className="divide-y divide-gray-100">
                {news.length === 0 ? (
                  <li className="py-4 text-gray-600">Пока нет новостей</li>
                ) : (
                  news.map((item) => (
                    <li key={item.id} className="py-4 first:pt-0 last:pb-0">
                      <Link href={`/news/${item.slug}`} className="group block">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          {item.isPinned && (
                            <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                              Важно
                            </span>
                          )}
                          <span className="text-sm text-gray-500">
                            {formatDate(item.publishedAt)}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold group-hover:text-[var(--sage-dark)] md:text-xl">
                          {item.title}
                        </h3>
                        {item.excerpt && (
                          <p className="mt-1 text-gray-600">{item.excerpt}</p>
                        )}
                      </Link>
                    </li>
                  ))
                )}
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

            <Card title="Как нас найти">
              <p className="whitespace-pre-line text-gray-700">{formatAddress()}</p>
              <a
                href={`mailto:${SITE.email}`}
                className="mt-3 inline-flex items-center gap-2 font-medium text-[var(--sage-dark)] hover:text-[var(--gold)]"
              >
                <Mail className="h-4 w-4" />
                {SITE.email}
              </a>
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
