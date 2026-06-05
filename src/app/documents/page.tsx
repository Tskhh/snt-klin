import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { FileText, Download } from "lucide-react";

export default async function DocumentsPage() {
  const docs = await prisma.document.findMany({
    where: { accessLevel: "PUBLIC" },
    orderBy: { title: "asc" },
  });

  const sections = [
    { id: "ustav", title: "Устав СНТ" },
    { id: "protocols", title: "Протоколы общих собраний" },
    { id: "budget", title: "Приходно-расходная смета" },
    { id: "revision", title: "Отчёты ревизионной комиссии" },
    { id: "rules", title: "Правила внутреннего распорядка" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-4 text-4xl font-bold">Уставные документы</h1>
      <p className="mb-8 text-lg text-gray-600">
        Официальные документы товарищества — для ознакомления и скачивания.
      </p>

      <nav className="mb-10 flex flex-wrap gap-2">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-100"
          >
            {s.title}
          </a>
        ))}
      </nav>

      {sections.map((s) => (
        <section key={s.id} id={s.id} className="mb-8 scroll-mt-24">
          <h2 className="mb-4 text-2xl font-bold">{s.title}</h2>
        </section>
      ))}

      <h2 className="mb-4 text-xl font-bold">Все документы</h2>
      <div className="grid gap-4">
        {docs.map((doc) => (
          <Card key={doc.id}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-emerald-800" />
                <p className="text-lg font-semibold">{doc.title}</p>
              </div>
              <a
                href={doc.fileUrl || "#"}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-800 px-4 py-2.5 font-semibold text-white"
              >
                <Download className="h-5 w-5" />
                PDF
              </a>
            </div>
          </Card>
        ))}
      </div>
      <p className="mt-8 text-gray-600">
        Документы для жителей доступны после входа в личный кабинет.
      </p>
    </div>
  );
}
