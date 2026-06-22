"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PLOT_NUMBERS } from "@/config/site";

type Tab = "login" | "register";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/cabinet";
  const initialTab: Tab =
    searchParams.get("register") === "1" ? "register" : "login";

  const [tab, setTab] = useState<Tab>(initialTab);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [plots, setPlots] = useState<string[]>(PLOT_NUMBERS);

  useEffect(() => {
    fetch("/api/plots")
      .then((r) => r.json())
      .then((data: { number: string }[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setPlots(data.map((p) => p.number));
        }
      })
      .catch(() => {});
  }, []);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
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

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
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
    <>
      <div className="mb-6 flex rounded-xl border border-gray-200 bg-gray-50 p-1">
        <button
          type="button"
          onClick={() => { setTab("login"); setError(""); }}
          className={`flex-1 rounded-lg py-2.5 text-base font-semibold transition ${
            tab === "login"
              ? "bg-white text-[var(--sage-dark)] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Вход
        </button>
        <button
          type="button"
          onClick={() => { setTab("register"); setError(""); }}
          className={`flex-1 rounded-lg py-2.5 text-base font-semibold transition ${
            tab === "register"
              ? "bg-white text-[var(--sage-dark)] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Регистрация
        </button>
      </div>

      {tab === "login" ? (
        <form onSubmit={handleLogin} className="space-y-4">
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
          <p className="text-center text-sm text-gray-600">
            Нет аккаунта?{" "}
            <button
              type="button"
              onClick={() => setTab("register")}
              className="font-semibold text-[var(--sage-dark)] hover:underline"
            >
              Зарегистрируйтесь здесь
            </button>
          </p>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            label="ФИО"
            name="fullName"
            required
            placeholder="Иванов Иван Иванович"
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Номер участка
            </label>
            <select
              name="plotNumber"
              required
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base min-h-[48px] focus:border-[var(--sage)] focus:outline-none focus:ring-2 focus:ring-[var(--sage)]/20"
            >
              <option value="">Выберите участок</option>
              {plots.map((n) => (
                <option key={n} value={n}>
                  Участок №{n}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Телефон"
            name="phone"
            type="tel"
            required
            placeholder="+79001234567"
          />
          <Input
            label="Email"
            name="email"
            type="email"
            required
            placeholder="ivanov@mail.ru"
          />
          <Input
            label="Пароль (минимум 8 символов)"
            name="password"
            type="password"
            required
            minLength={8}
          />
          <label className="flex items-start gap-3">
            <input
              name="consent"
              type="checkbox"
              required
              className="mt-1 h-5 w-5 shrink-0"
            />
            <span className="text-sm text-gray-700">
              Согласен на обработку персональных данных в соответствии с
              политикой СНТ
            </span>
          </label>
          {error && (
            <p className="rounded-xl bg-red-50 p-3 text-red-700">{error}</p>
          )}
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Отправка..." : "Зарегистрироваться"}
          </Button>
          <p className="text-center text-sm text-gray-600">
            Уже есть аккаунт?{" "}
            <button
              type="button"
              onClick={() => setTab("login")}
              className="font-semibold text-[var(--sage-dark)] hover:underline"
            >
              Войти
            </button>
          </p>
        </form>
      )}

      {process.env.NODE_ENV === "development" && tab === "login" && (
        <div className="mt-6 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
          <p className="font-semibold">Демо-доступ (только локально):</p>
          <p>Админ: admin@snt-klin.ru / admin123</p>
          <p>Житель: petrov@example.ru / resident123</p>
        </div>
      )}
    </>
  );
}
