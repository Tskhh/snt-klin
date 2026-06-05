"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function MeterSubmitForm({
  meterId,
  lastReading,
  unit,
  period,
}: {
  meterId: string;
  lastReading: number;
  unit: string;
  period: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const consumption = value ? Math.max(0, Number(value) - lastReading) : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/meter-readings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meterId, value: Number(value), period }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Ошибка отправки");
      return;
    }

    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label={`Текущее показание (${unit})`}
        type="number"
        step="0.01"
        min={lastReading}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
      />
      <p className="text-gray-600">
        Расход: <strong>{consumption}</strong> {unit}
      </p>
      {error && <p className="text-red-600">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Отправка..." : "Передать показания"}
      </Button>
    </form>
  );
}
