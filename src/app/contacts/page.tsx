import { Card } from "@/components/ui/Card";
import { Phone, Mail, MapPin, Clock, Shield, AlertTriangle } from "lucide-react";

export default function ContactsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-8 text-4xl font-bold">Контакты</h1>

      <section id="chairman" className="mb-8 scroll-mt-24">
        <Card>
          <Clock className="mb-3 h-8 w-8 text-emerald-800" />
          <h2 className="text-xl font-bold">Председатель (часы приёма)</h2>
          <p className="mt-2 text-lg">Понедельник, среда — 18:00–20:00</p>
          <p className="text-gray-600">Иванов Иван Иванович</p>
          <p className="mt-2 text-gray-600">Тел.: +7 (495) 123-45-67</p>
        </Card>
      </section>

      <section id="accounting" className="mb-8 scroll-mt-24">
        <Card>
          <Mail className="mb-3 h-8 w-8 text-emerald-800" />
          <h2 className="text-xl font-bold">Бухгалтерия</h2>
          <p className="mt-2 text-lg">info@snt-klin.ru</p>
          <p className="text-gray-600">Вопросы по взносам, квитанциям и задолженности</p>
        </Card>
      </section>

      <section id="security" className="mb-8 scroll-mt-24">
        <Card>
          <Shield className="mb-3 h-8 w-8 text-emerald-800" />
          <h2 className="text-xl font-bold">Охрана / КПП</h2>
          <p className="mt-2 text-lg">+7 (495) 123-45-69</p>
          <p className="text-gray-600">Круглосуточно</p>
        </Card>
      </section>

      <section id="emergency" className="mb-8 scroll-mt-24">
        <Card>
          <AlertTriangle className="mb-3 h-8 w-8 text-emerald-800" />
          <h2 className="text-xl font-bold">Аварийные службы</h2>
          <p className="mt-2 text-lg">+7 (495) 123-45-68</p>
          <p className="text-gray-600">Вода, электричество, прорывы — звоните сразу</p>
        </Card>
      </section>

      <section id="map" className="scroll-mt-24">
        <Card>
          <MapPin className="mb-3 h-8 w-8 text-emerald-800" />
          <h2 className="text-xl font-bold">Карта проезда</h2>
          <p className="mt-2 text-lg">
            Московская область, д. Полуханово
            <br />
            СНТ «Клин», Ленинградское ш., ~72 км от МКАД
          </p>
          <p className="mt-4 text-gray-600">
            Схему проезда можно запросить у охраны на КПП или у председателя на приёме.
          </p>
        </Card>
      </section>
    </div>
  );
}
