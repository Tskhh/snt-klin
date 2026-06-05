"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function GenerateChargesButton({ period }: { period: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function generate() {
    setLoading(true);
    const res = await fetch("/api/admin/charges/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ period }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setResult(`Создано начислений: ${data.created}`);
      router.refresh();
    } else {
      setResult(data.error || "Ошибка");
    }
  }

  return (
    <div>
      <Button onClick={generate} disabled={loading}>
        {loading ? "Расчёт..." : "Создать начисления"}
      </Button>
      {result && <p className="mt-3 text-emerald-700">{result}</p>}
    </div>
  );
}
