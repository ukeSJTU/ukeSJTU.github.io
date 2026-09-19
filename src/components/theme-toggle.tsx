"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      aria-label="切换明暗主题"
      className="relative"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      size="icon"
      title="切换明暗主题"
      type="button"
      variant="outline"
    >
      <SunIcon
        aria-hidden="true"
        className="rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0"
        data-icon="inline-start"
      />
      <MoonIcon
        aria-hidden="true"
        className="absolute rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100"
        data-icon="inline-start"
      />
    </Button>
  );
}
