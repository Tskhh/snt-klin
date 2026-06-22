"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function TicketReplyForm({ ticketId }: { ticketId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch(`/api/tickets/${ticketId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Не удалось отправить сообщение");
      setLoading(false);
      return;
    }
    setBody("");
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
        rows={3}
        placeholder="Ваше сообщение..."
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base md:text-lg"
      />
      {error && (
        <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}
      <Button type="submit" disabled={loading}>
        Отправить
      </Button>
    </form>
  );
}
