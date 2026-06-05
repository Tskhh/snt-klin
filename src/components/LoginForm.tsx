"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/cabinet";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Ошибка входа");
      return;
    }

    if (data.status === "PENDING") {
      router.push("/pending");
      return;
    }

    if (data.role === "ADMIN" || data.role === "SUPER_ADMIN") {
      router.push("/admin");
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="ivanov@mail.ru"
        />
        <Input
          label="Пароль"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
        {error && (
          <p className="rounded-xl bg-red-50 p-3 text-red-700">{error}</p>
        )}
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Вход..." : "Войти"}
        </Button>
      </form>
      <p className="mt-6 text-center text-gray-600">
        Нет аккаунта?{" "}
        <Link href="/register" className="font-semibold text-emerald-800 hover:underline">
          Зарегистрироваться
        </Link>
      </p>
      <div className="mt-6 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
        <p className="font-semibold">Демо-доступ:</p>
        <p>Админ: admin@snt-klin.ru / admin123</p>
        <p>Житель: petrov@example.ru / resident123</p>
      </div>
    </>
  );
}
