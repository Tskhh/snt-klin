import { Card } from "@/components/ui/Card";
import { NewsForm } from "@/components/admin/NewsForm";
import Link from "next/link";

export default function AdminNewsNewPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/news" className="text-emerald-800 hover:underline">
          ← К списку новостей
        </Link>
        <h1 className="mt-2 text-3xl font-bold">Добавить новость</h1>
      </div>
      <Card>
        <NewsForm />
      </Card>
    </div>
  );
}
