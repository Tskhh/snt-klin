"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function NewsForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/admin/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        excerpt: form.get("excerpt") || "",
        body: form.get("body"),
        category: form.get("category"),
        isPinned: form.get("isPinned") === "on",
        isEmergency: form.get("isEmergency") === "on",
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Не удалось сохранить");
      return;
    }

    router.push("/admin/news");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input label="Заголовок" name="title" required placeholder="Заголовок новости" />

      <label className="block">
        <span className="mb-1.5 block text-base font-medium text-gray-800">
          Краткое описание (для главной)
        </span>
        <input
          name="excerpt"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg"
          placeholder="1–2 предложения"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-base font-medium text-gray-800">
          Текст новости
        </span>
        <textarea
          name="body"
          required
          rows={8}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg"
          placeholder="Полный текст..."
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-base font-medium text-gray-800">Категория</span>
        <select
          name="category"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg"
        >
          <option value="news">Новость</option>
          <option value="announcement">Объявление</option>
        </select>
      </label>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-3">
          <input type="checkbox" name="isPinned" className="h-5 w-5" />
          <span className="text-base">Закрепить на главной</span>
        </label>
        <label className="flex items-center gap-3">
          <input type="checkbox" name="isEmergency" className="h-5 w-5" />
          <span className="text-base">Аварийное уведомление (красная полоса)</span>
        </label>
      </div>

      {error && <p className="rounded-xl bg-red-50 p-3 text-red-700">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={loading} size="lg">
          {loading ? "Сохранение..." : "Опубликовать"}
        </Button>
        <Button href="/admin/news" variant="secondary" size="lg">
          Отмена
        </Button>
      </div>
    </form>
  );
}
