"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteSearch } from "@/components/search/site-search";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { siteConfig } from "@/lib/site/config";
import { cn } from "@/lib/utils";
import { SidebarLinks } from "./sidebar-links";
import { SiteNavigation } from "./site-navigation";
import styles from "./site-sidebar.module.css";

export function SiteSidebar({ basePath = "" }: { basePath?: string }) {
  const pathname = usePathname();
  return (
    <>
      <a
        className="bg-background text-foreground focus-visible:ring-ring fixed top-3 left-3 z-50 -translate-y-20 rounded-md px-3 py-2 text-sm font-medium shadow-sm transition-transform focus-visible:translate-y-0 focus-visible:ring-2 focus-visible:outline-none"
        href="#main-content"
      >
        Skip to content
      </a>
      <header className={cn(styles.sidebar, "site-sidebar")}>
        <div className={styles.brand}>
          <Link
            className="text-xl font-semibold tracking-tight"
            href="/"
            aria-label={`${siteConfig.name} home`}
          >
            {siteConfig.name}
          </Link>
        </div>
        <p className={styles.intro}>
          Notes on technology,
          <br />
          learning, and making things.
        </p>
        <SiteSearch basePath={basePath} />
        <SiteNavigation pathname={pathname} />
        <div className={styles.footer}>
          <SidebarLinks basePath={basePath} />
          <ThemeToggle />
        </div>
      </header>
    </>
  );
}
