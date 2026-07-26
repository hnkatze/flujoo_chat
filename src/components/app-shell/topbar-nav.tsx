"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Chats" },
  { href: "/leads", label: "Leads" },
  { href: "/agenda", label: "Agenda" },
];

export function TopbarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {TABS.map((tab) => {
        const isActive = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            className={`label-mono px-3 py-1.5 transition-colors ${
              isActive
                ? "bg-foreground text-background"
                : "text-muted hover:text-foreground"
            }`}
            href={tab.href}
          >
            {tab.label.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );
}
