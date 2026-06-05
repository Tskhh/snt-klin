"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MapPin,
  Newspaper,
  Gauge,
  Receipt,
  MessageSquare,
  LogOut,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard },
  { href: "/admin/users", label: "Пользователи", icon: Users },
  { href: "/admin/plots", label: "Участки", icon: MapPin },
  { href: "/admin/news", label: "Новости", icon: Newspaper },
  { href: "/admin/meters", label: "Показания", icon: Gauge },
  { href: "/admin/charges", label: "Начисления", icon: Receipt },
  { href: "/admin/tickets", label: "Обращения", icon: MessageSquare },
];

export function AdminNav() {
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <nav className="w-56 shrink-0 space-y-1">
      {links.map((link) => {
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium ${
              active ? "bg-emerald-800 text-white" : "text-gray-700 hover:bg-emerald-50"
            }`}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
      <button
        onClick={logout}
        className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        <LogOut className="h-4 w-4" />
        Выйти
      </button>
    </nav>
  );
}
