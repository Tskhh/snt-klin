"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { SITE_NAV, type NavItem } from "@/config/site-nav";

type SiteNavProps = {
  paymentsHref: string;
};

function NavDropdown({ item }: { item: NavItem }) {
  return (
    <li className="group relative">
      <Link
        href={item.href}
        className="inline-flex items-center gap-1 py-2 text-base font-medium text-gray-700 hover:text-[var(--sage-dark)]"
      >
        <span>
          {item.label}
          {item.subtitle && (
            <span className="block text-xs font-normal text-gray-500">{item.subtitle}</span>
          )}
        </span>
        <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 opacity-60 transition group-hover:rotate-180" />
      </Link>
      <div className="invisible absolute left-0 top-full z-50 min-w-[280px] pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <ul className="rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
          {item.children.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[var(--cream)] hover:text-[var(--sage-dark)]"
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export function SiteNav({ paymentsHref }: SiteNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = SITE_NAV.map((item) =>
    item.label === "Мои платежи" ? { ...item, href: paymentsHref } : item
  );

  return (
    <>
      <nav className="hidden items-center gap-5 lg:flex">
        <ul className="flex items-start gap-5">
          {nav.map((item) => (
            <NavDropdown key={item.label} item={item} />
          ))}
        </ul>
      </nav>

      <button
        type="button"
        className="inline-flex items-center justify-center rounded-xl border border-gray-200 p-2.5 text-gray-700 lg:hidden"
        aria-expanded={mobileOpen}
        aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
        onClick={() => setMobileOpen((v) => !v)}
      >
        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {mobileOpen && (
        <nav className="absolute left-0 right-0 top-full max-h-[70vh] overflow-y-auto border-t border-gray-100 bg-white px-4 py-4 shadow-lg lg:hidden">
          <ul className="space-y-4">
            {nav.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-lg font-semibold text-[var(--charcoal)]"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                  {item.subtitle && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({item.subtitle})
                    </span>
                  )}
                </Link>
                <ul className="mt-2 space-y-1 border-l-2 border-[var(--sage)]/20 pl-4">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className="block py-1.5 text-sm text-gray-600 hover:text-[var(--sage-dark)]"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
