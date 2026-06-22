import Link from "next/link";
import Image from "next/image";
import { isAdmin } from "@/lib/jwt";
import { getSession } from "@/lib/session";
import { User, LogIn } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SITE } from "@/config/site";

export async function Header() {
  const session = await getSession();
  const paymentsHref = session ? "/cabinet/billing" : "/login";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--sage)]/15 bg-[var(--cream)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex min-w-0 shrink items-center gap-3">
          <Image
            src="/logo.png"
            alt={SITE.shortName}
            width={48}
            height={48}
            className="h-11 w-11 shrink-0 rounded-lg object-contain"
            priority
          />
          <div className="min-w-0">
            <div className="truncate font-serif text-base font-bold text-[var(--charcoal)] sm:text-lg">
              {SITE.shortName}
            </div>
            <div className="hidden truncate text-xs text-gray-500 sm:block">
              Садовое некоммерческое товарищество
            </div>
          </div>
        </Link>

        <SiteNav paymentsHref={paymentsHref} />

        <div className="flex shrink-0 items-center gap-2">
          {session ? (
            <>
              {isAdmin(session.role) && (
                <Link
                  href="/admin"
                  className="hidden rounded-xl border border-[var(--sage-dark)] px-3 py-2 text-sm font-semibold text-[var(--sage-dark)] hover:bg-white sm:inline-flex"
                >
                  Админка
                </Link>
              )}
              <Link
                href={isAdmin(session.role) ? "/admin" : "/cabinet"}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--sage-dark)] px-3 py-2.5 text-sm font-semibold text-white hover:bg-[var(--charcoal)] sm:px-4 sm:text-base"
              >
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">Кабинет</span>
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--sage-dark)] px-3 py-2.5 text-sm font-semibold text-white hover:bg-[var(--charcoal)] sm:px-4 sm:text-base"
            >
              <LogIn className="h-5 w-5 shrink-0" />
              <span className="max-w-[9rem] leading-tight sm:max-w-none">
                Вход в личный кабинет
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
