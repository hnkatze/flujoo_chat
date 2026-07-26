"use client";

import { Button } from "@heroui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme, theme } = useTheme();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const activeTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant={activeTheme === "light" ? "primary" : "outline"}
        onPress={() => setTheme("light")}
      >
        Claro
      </Button>
      <Button
        size="sm"
        variant={activeTheme === "dark" ? "primary" : "outline"}
        onPress={() => setTheme("dark")}
      >
        Oscuro
      </Button>
      <Button
        size="sm"
        variant={theme === "system" ? "primary" : "outline"}
        onPress={() => setTheme("system")}
      >
        Sistema
      </Button>
    </div>
  );
}
