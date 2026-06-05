"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function ApproveReadingButton({ readingId }: { readingId: string }) {
  const router = useRouter();

  async function approve() {
    await fetch(`/api/admin/meter-readings/${readingId}/approve`, { method: "POST" });
    router.refresh();
  }

  return (
    <Button onClick={approve} size="md" className="!min-h-0 !py-1.5 !text-sm">
      Одобрить
    </Button>
  );
}
