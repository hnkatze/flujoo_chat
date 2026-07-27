import { Button } from "@heroui/react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { TopbarMenu, TopbarNav } from "@/components/app-shell/topbar-nav";
import { logout } from "@/app/login/actions";

export function Topbar() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-surface px-3 sm:px-4 lg:h-16 lg:px-6 xl:px-8">
      <div className="flex min-w-0 items-center gap-3 md:gap-4 lg:gap-6">
        <span className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
          Flujoo Chats
        </span>
        <TopbarNav />
      </div>

      <div className="flex shrink-0 items-center gap-2 lg:gap-3">
        <div className="hidden md:flex">
          <ThemeSwitcher />
        </div>
        <form action={logout} className="hidden md:block">
          <Button size="sm" type="submit" variant="ghost">
            Cerrar sesión
          </Button>
        </form>
        <TopbarMenu />
      </div>
    </header>
  );
}
