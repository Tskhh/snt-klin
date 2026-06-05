"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Gauge,
  CreditCard,
  MessageSquare,
  Bell,
  User,
  Vote,
  FileText,
  LogOut,
} from "lucide-react";

const links = [
  { href: "/cabinet", label: "Главная", icon: LayoutDashboard },
  { href: "/cabinet/meters", label: "Счётчики", icon: Gauge },
  { href: "/cabinet/billing", label: "Оплата", icon: CreditCard },
  { href: "/cabinet/tickets", label: "Обращения", icon: MessageSquare },
  { href: "/cabinet/votes", label: "Голосования", icon: Vote },
  { href: "/cabinet/documents", label: "Документы", icon: FileText },
  { href: "/cabinet/notifications", label: "Уведомления", icon: Bell },
  { href: "/cabinet/profile", label: "Профиль", icon: User },
];

export function CabinetNav() {
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <>
      <nav className="hidden w-64 shrink-0 space-y-1 md:block">
        {links.map((link) => {
          const active =
            link.href === "/cabinet"
              ? pathname === "/cabinet"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition ${
                active
                  ? "bg-emerald-800 text-white"
                  : "text-gray-700 hover:bg-emerald-50"
              }`}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          Выйти
        </button>
      </nav>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t border-gray-200 bg-white px-2 py-2 md:hidden">
        {links.slice(0, 5).map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center rounded-lg px-2 py-1 text-xs ${
                active ? "text-emerald-800" : "text-gray-500"
              }`}
            >
              <link.icon className="h-6 w-6" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
