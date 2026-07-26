"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Drawer } from "@heroui/react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { logout } from "@/app/login/actions";

const TABS = [
  { href: "/", label: "Chats" },
  { href: "/leads", label: "Leads" },
  { href: "/agenda", label: "Agenda" },
];

function isTabActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function TopbarNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Secciones" className="hidden items-center gap-1 md:flex">
      {TABS.map((tab) => {
        const isActive = isTabActive(pathname, tab.href);

        return (
          <Link
            key={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={`label-mono flex min-h-11 items-center px-3 transition-colors lg:min-h-10 ${
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

export function TopbarMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    function handleChange(event: MediaQueryListEvent) {
      if (event.matches) setIsOpen(false);
    }

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="md:hidden">
      <Button
        aria-label="Abrir menú"
        className="min-h-11 min-w-11"
        size="sm"
        variant="ghost"
        onPress={() => setIsOpen(true)}
      >
        <svg
          aria-hidden="true"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="square" />
        </svg>
      </Button>

      <Drawer.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
        <Drawer.Content className="w-[85vw] max-w-xs" placement="left">
          <Drawer.Dialog>
            <Drawer.CloseTrigger />
            <Drawer.Header>
              <Drawer.Heading>Menú</Drawer.Heading>
            </Drawer.Header>

            <Drawer.Body>
              <nav aria-label="Secciones" className="flex flex-col gap-1">
                {TABS.map((tab) => {
                  const isActive = isTabActive(pathname, tab.href);

                  return (
                    <Link
                      key={tab.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex min-h-11 items-center px-3 font-mono text-sm tracking-[0.16em] uppercase transition-colors ${
                        isActive
                          ? "bg-foreground text-background"
                          : "text-muted hover:text-foreground"
                      }`}
                      href={tab.href}
                      onClick={() => setIsOpen(false)}
                    >
                      {tab.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6">
                <p className="label-mono text-muted">Tema</p>
                <ThemeSwitcher />
              </div>
            </Drawer.Body>

            <Drawer.Footer>
              <form action={logout} className="w-full">
                <Button className="min-h-11 w-full" type="submit" variant="secondary">
                  Cerrar sesión
                </Button>
              </form>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </div>
  );
}
