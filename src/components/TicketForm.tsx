"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function TicketForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: form.get("subject"),
        category: form.get("category"),
        body: form.get("body"),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Ошибка");
      return;
    }

    router.push(`/cabinet/tickets/${data.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Тема" name="subject" required />
      <label className="block">
        <span className="mb-1.5 block text-base font-medium">Категория</span>
        <select
          name="category"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg"
        >
          <option value="general">Общий вопрос</option>
          <option value="payment">Оплата</option>
          <option value="meters">Счётчики</option>
          <option value="infrastructure">Инфраструктура</option>
        </select>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-base font-medium">Сообщение</span>
        <textarea
          name="body"
          required
          rows={4}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg"
        />
      </label>
      {error && <p className="text-red-600">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Отправка..." : "Отправить обращение"}
      </Button>
    </form>
  );
}
