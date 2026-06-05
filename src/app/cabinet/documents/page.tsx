import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { FileText, Download } from "lucide-react";

export default async function CabinetDocumentsPage() {
  const docs = await prisma.document.findMany({
    where: { accessLevel: { in: ["PUBLIC", "RESIDENTS"] } },
    orderBy: { createdAt: "desc" },
  });

  const categories: Record<string, string> = {
    charter: "Устав",
    tariffs: "Тарифы",
    protocols: "Протоколы",
    instructions: "Инструкции",
    reports: "Отчёты",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Документы</h1>
      <div className="grid gap-4">
        {docs.map((doc) => (
          <Card key={doc.id}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-emerald-800" />
                <div>
                  <p className="font-semibold">{doc.title}</p>
                  <p className="text-sm text-gray-500">
                    {categories[doc.category] || doc.category}
                  </p>
                </div>
              </div>
              <a
                href={doc.fileUrl || "#"}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-4 py-2.5 font-semibold text-white hover:bg-emerald-900"
              >
                <Download className="h-5 w-5" />
                Скачать
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
