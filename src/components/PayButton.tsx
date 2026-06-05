"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CreditCard } from "lucide-react";

export function PayButton({ plotId, amount }: { plotId: string; amount: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function pay() {
    setLoading(true);
    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plotId, amount }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Ошибка оплаты");
      return;
    }

    if (data.paymentId) {
      const confirmRes = await fetch(`/api/payments/${data.paymentId}/confirm`, {
        method: "POST",
      });
      if (confirmRes.ok) {
        router.refresh();
        alert("Оплата успешно проведена! (демо-режим)");
      }
    }
  }

  return (
    <Button onClick={pay} disabled={loading} size="lg">
      <CreditCard className="h-5 w-5" />
      {loading ? "Обработка..." : `Оплатить ${amount.toLocaleString("ru-RU")} ₽`}
    </Button>
  );
}
