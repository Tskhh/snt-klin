import { BOARD, SITE } from "@/config/site";
import { Phone } from "lucide-react";

export function BoardSection({ compact = false }: { compact?: boolean }) {
  const chairman = BOARD[0];
  const members = BOARD.slice(1);

  return (
    <section id="board" className="scroll-mt-24">
      <div className="mb-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--gold)]">
          Знакомьтесь!
        </p>
        <h2 className="mt-2 font-serif text-3xl font-bold text-[var(--charcoal)] md:text-4xl">
          Правление {SITE.shortName}
        </h2>
        <div className="mx-auto mt-4 h-px w-24 bg-[var(--gold)]" />
      </div>

      <div
        className={`grid gap-4 ${compact ? "md:grid-cols-2" : "lg:grid-cols-2 xl:grid-cols-3"}`}
      >
        <article className="rounded-2xl border-2 border-[var(--gold)]/40 bg-white p-6 shadow-sm lg:col-span-2 xl:col-span-1">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--sage-dark)]">
            {chairman.role}
          </p>
          <h3 className="mt-2 font-serif text-xl font-bold text-[var(--charcoal)]">
            {chairman.name}
          </h3>
          {chairman.plot && (
            <p className="mt-1 text-sm text-gray-600">{chairman.plot}</p>
          )}
          <a
            href={`tel:${chairman.tel}`}
            className="mt-4 inline-flex items-center gap-2 text-lg font-semibold text-[var(--sage-dark)] hover:text-[var(--gold)]"
          >
            <Phone className="h-5 w-5 shrink-0" />
            {chairman.phone}
          </a>
        </article>

        {members.map((m) => (
          <article
            key={m.name}
            className="rounded-2xl border border-[var(--sage)]/20 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              {m.role}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-[var(--charcoal)]">
              {m.name}
            </h3>
            {m.plot && <p className="mt-1 text-sm text-gray-600">{m.plot}</p>}
            <a
              href={`tel:${m.tel}`}
              className="mt-3 inline-flex items-center gap-2 font-medium text-[var(--sage-dark)] hover:text-[var(--gold)]"
            >
              <Phone className="h-4 w-4 shrink-0" />
              {m.phone}
            </a>
          </article>
        ))}
      </div>

      <p className="mt-6 rounded-xl bg-[var(--cream)] px-5 py-4 text-center text-sm leading-relaxed text-gray-700 md:text-base">
        {SITE.officeNote}
      </p>
    </section>
  );
}
