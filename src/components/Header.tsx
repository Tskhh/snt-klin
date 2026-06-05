import Link from "next/link";
import { isAdmin } from "@/lib/jwt";
import { getSession } from "@/lib/session";
import { User, LogIn } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";

export async function Header() {
  const session = await getSession();
  const paymentsHref = session ? "/cabinet/billing" : "/login";

  return (
    <header className="relative sticky top-0 z-50 border-b border-emerald-900/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-800 text-lg font-bold text-white">
            К
          </span>
          <div>
            <div className="text-lg font-bold text-emerald-900">СНТ «Клин»</div>
            <div className="text-xs text-gray-500">Садовое товарищество</div>
          </div>
        </Link>

        <SiteNav paymentsHref={paymentsHref} />

        <div className="flex shrink-0 items-center gap-2">
          {session ? (
            <>
              {isAdmin(session.role) && (
                <Link
                  href="/admin"
                  className="hidden rounded-xl border border-emerald-800 px-4 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 sm:inline-flex"
                >
                  Админка
                </Link>
              )}
              <Link
                href="/cabinet"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-4 py-2.5 text-base font-semibold text-white hover:bg-emerald-900"
              >
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">Кабинет</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-emerald-800 px-4 py-2.5 text-base font-semibold text-emerald-800 hover:bg-emerald-50"
              >
                <LogIn className="h-5 w-5" />
                <span className="hidden sm:inline">Войти</span>
              </Link>
              <Link
                href="/register"
                className="hidden rounded-xl bg-emerald-800 px-4 py-2.5 text-base font-semibold text-white hover:bg-emerald-900 sm:inline-flex"
              >
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
