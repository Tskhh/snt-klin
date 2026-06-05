import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-emerald-950 text-emerald-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <h3 className="mb-2 text-lg font-bold">СНТ «Клин»</h3>
          <p className="text-sm text-emerald-200">
            Московская область, д. Клин
            <br />
            Садовое некоммерческое товарищество
          </p>
        </div>
        <div>
          <h3 className="mb-2 text-lg font-bold">Разделы</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/news" className="hover:underline">
                Новости
              </Link>
            </li>
            <li>
              <Link href="/documents" className="hover:underline">
                Документы
              </Link>
            </li>
            <li>
              <Link href="/cabinet" className="hover:underline">
                Личный кабинет
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-lg font-bold">Контакты</h3>
          <p className="text-sm text-emerald-200">
            Тел.: +7 (495) 123-45-67
            <br />
            Email: info@snt-klin.ru
            <br />
            Председатель: пн, ср 18:00–20:00
          </p>
        </div>
      </div>
      <div className="border-t border-emerald-900 px-4 py-4 text-center text-sm text-emerald-300">
        © {new Date().getFullYear()} СНТ «Клин». Все права защищены.
      </div>
    </footer>
  );
}
