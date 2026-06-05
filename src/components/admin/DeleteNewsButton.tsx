"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function DeleteNewsButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();

  async function remove() {
    if (!confirm(`Удалить новость «${title}»?`)) return;

    const res = await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Не удалось удалить");
      return;
    }
    router.refresh();
  }

  return (
    <Button onClick={remove} variant="danger" size="md" className="!min-h-0 !py-1.5 !text-sm">
      Удалить
    </Button>
  );
}
