import { Button } from "@heroui/react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { TopbarNav } from "@/components/app-shell/topbar-nav";
import { logout } from "@/app/login/actions";

export function Topbar() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface px-4">
      <div className="flex items-center gap-6">
        <span className="text-lg font-semibold tracking-tight text-foreground">flujoo</span>
        <TopbarNav />
      </div>

      <div className="flex items-center gap-3">
        <ThemeSwitcher />
        <form action={logout}>
          <Button size="sm" type="submit" variant="ghost">
            Cerrar sesión
          </Button>
        </form>
      </div>
    </header>
  );
}
