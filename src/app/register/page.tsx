"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: form.get("fullName"),
        plotNumber: form.get("plotNumber"),
        phone: form.get("phone"),
        email: form.get("email"),
        password: form.get("password"),
        consent: form.get("consent") === "on",
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Ошибка регистрации");
      return;
    }

    router.push("/pending");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <Card title="Регистрация жителя СНТ">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="ФИО" name="fullName" required placeholder="Иванов Иван Иванович" />
          <Input label="Номер участка" name="plotNumber" required placeholder="1" />
          <Input label="Телефон" name="phone" type="tel" required placeholder="+79001234567" />
          <Input label="Email" name="email" type="email" required placeholder="ivanov@mail.ru" />
          <Input
            label="Пароль (минимум 8 символов)"
            name="password"
            type="password"
            required
            minLength={8}
          />
          <label className="flex items-start gap-3">
            <input name="consent" type="checkbox" required className="mt-1 h-5 w-5" />
            <span className="text-base text-gray-700">
              Согласен на обработку персональных данных в соответствии с политикой СНТ
            </span>
          </label>
          {error && (
            <p className="rounded-xl bg-red-50 p-3 text-red-700">{error}</p>
          )}
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Отправка..." : "Зарегистрироваться"}
          </Button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="font-semibold text-emerald-800 hover:underline">
            Войти
          </Link>
        </p>
      </Card>
    </div>
  );
}
