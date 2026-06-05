"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function ApproveUserButton({ userId }: { userId: string }) {
  const router = useRouter();

  async function approve() {
    await fetch(`/api/admin/users/${userId}/approve`, { method: "POST" });
    router.refresh();
  }

  return (
    <Button onClick={approve} size="md" className="!min-h-0 !py-1.5 !text-sm">
      Подтвердить
    </Button>
  );
}
