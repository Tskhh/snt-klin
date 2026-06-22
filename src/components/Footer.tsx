import Link from "next/link";
import { SITE, formatAddressInline } from "@/config/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--sage)]/20 bg-[var(--charcoal)] text-[var(--cream)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <h3 className="mb-2 font-serif text-lg font-bold">{SITE.shortName}</h3>
          <p className="text-sm leading-relaxed text-gray-300">
            {SITE.fullName}
            <br />
            {formatAddressInline()}
          </p>
        </div>
        <div>
          <h3 className="mb-2 text-lg font-bold">Разделы</h3>
          <ul className="space-y-1.5 text-sm text-gray-300">
            <li>
              <Link href="/news" className="hover:text-[var(--gold-light)]">
                Доска объявлений
              </Link>
            </li>
            <li>
              <Link href="/documents" className="hover:text-[var(--gold-light)]">
                Уставные документы
              </Link>
            </li>
            <li>
              <Link href="/contacts" className="hover:text-[var(--gold-light)]">
                Контакты и правление
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-[var(--gold-light)]">
                Вход в личный кабинет
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-lg font-bold">Контакты</h3>
          <p className="text-sm leading-relaxed text-gray-300">
            <a
              href={`mailto:${SITE.email}`}
              className="font-medium text-[var(--gold-light)] hover:underline"
            >
              {SITE.email}
            </a>
            <br />
            Приём: {SITE.officeHours}
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} {SITE.shortName}. Все права защищены.
      </div>
    </footer>
  );
}
