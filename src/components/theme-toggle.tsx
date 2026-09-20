"use client";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Button
      aria-checked={mounted && isDark}
      aria-label="Dark mode"
      className="relative size-10"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      role="switch"
      size="icon-lg"
      title="Toggle dark mode"
      type="button"
      variant="ghost"
    >
      <IconSun
        aria-hidden="true"
        className="rotate-0 scale-100 transition-transform motion-reduce:transition-none dark:-rotate-90 dark:scale-0"
        data-icon="inline-start"
      />
      <IconMoon
        aria-hidden="true"
        className="absolute rotate-90 scale-0 transition-transform motion-reduce:transition-none dark:rotate-0 dark:scale-100"
        data-icon="inline-start"
      />
    </Button>
  );
}
