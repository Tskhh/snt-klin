"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function VoteForm({
  voteId,
  options,
}: {
  voteId: string;
  options: { id: string; label: string }[];
}) {
  const router = useRouter();
  const [optionId, setOptionId] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!optionId) return;
    setLoading(true);
    const res = await fetch("/api/votes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voteId, optionId }),
    });
    setLoading(false);
    if (res.ok) router.refresh();
    else alert("Ошибка голосования");
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      {options.map((o) => (
        <label
          key={o.id}
          className="flex cursor-pointer items-center gap-3 rounded-xl border p-4 hover:bg-emerald-50"
        >
          <input
            type="radio"
            name="option"
            value={o.id}
            checked={optionId === o.id}
            onChange={() => setOptionId(o.id)}
            className="h-5 w-5"
          />
          <span className="text-lg">{o.label}</span>
        </label>
      ))}
      <Button type="submit" disabled={loading || !optionId}>
        Проголосовать
      </Button>
    </form>
  );
}
