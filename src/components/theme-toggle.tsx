"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      aria-checked={resolvedTheme === "dark"}
      aria-label="切换明暗主题"
      className="relative size-10"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      role="switch"
      size="icon-lg"
      title="切换明暗主题"
      type="button"
      variant="ghost"
    >
      <SunIcon
        aria-hidden="true"
        className="size-5 rotate-0 scale-100 transition-transform motion-reduce:transition-none dark:-rotate-90 dark:scale-0"
        data-icon="inline-start"
      />
      <MoonIcon
        aria-hidden="true"
        className="absolute size-5 rotate-90 scale-0 transition-transform motion-reduce:transition-none dark:rotate-0 dark:scale-100"
        data-icon="inline-start"
      />
    </Button>
  );
}
