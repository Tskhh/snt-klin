import { Card } from "@/components/ui/Card";
import { BoardSection } from "@/components/BoardSection";
import { SITE, formatAddress } from "@/config/site";
import { Mail, MapPin, Clock } from "lucide-react";

export default function ContactsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <h1 className="mb-2 font-serif text-4xl font-bold text-[var(--charcoal)]">
        Контакты
      </h1>
      <p className="mb-10 text-lg text-gray-600">{SITE.fullName}</p>

      <div className="mb-12 grid gap-6 md:grid-cols-2">
        <section id="map" className="scroll-mt-24">
          <Card>
            <MapPin className="mb-3 h-8 w-8 text-[var(--sage-dark)]" />
            <h2 className="text-xl font-bold">Адрес</h2>
            <p className="mt-3 whitespace-pre-line text-lg leading-relaxed text-gray-700">
              {formatAddress()}
            </p>
          </Card>
        </section>

        <section id="email" className="scroll-mt-24">
          <Card>
            <Mail className="mb-3 h-8 w-8 text-[var(--sage-dark)]" />
            <h2 className="text-xl font-bold">Электронная почта</h2>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-3 inline-block text-lg font-medium text-[var(--sage-dark)] hover:text-[var(--gold)]"
            >
              {SITE.email}
            </a>
            <p className="mt-2 text-gray-600">
              По вопросам взносов, документов и обращений
            </p>
          </Card>
        </section>

        <section id="hours" className="scroll-mt-24 md:col-span-2">
          <Card>
            <Clock className="mb-3 h-8 w-8 text-[var(--sage-dark)]" />
            <h2 className="text-xl font-bold">Часы приёма звонков</h2>
            <p className="mt-2 text-lg">{SITE.officeHours}</p>
            <p className="mt-3 text-gray-600">{SITE.officeNote}</p>
          </Card>
        </section>
      </div>

      <BoardSection />
    </div>
  );
}
