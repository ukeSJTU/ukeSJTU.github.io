"use client";

import {
  IconBrandGithub,
  IconFileText,
  IconFolderCode,
  IconHome,
  IconRss,
  IconUser,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteSearch } from "@/components/search/site-search";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site/config";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Home", icon: IconHome },
  { href: "/blog", label: "Blog", icon: IconFileText },
  { href: "/projects", label: "Projects", icon: IconFolderCode },
  { href: "/about", label: "About", icon: IconUser },
] as const;

function isCurrentPath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

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

      <header className="site-sidebar">
        <div className="sidebar-brand">
          <Link
            aria-label={`${siteConfig.name} home`}
            className="flex min-w-0 items-center gap-2 rounded-md font-semibold tracking-tight"
            href="/"
          >
            <Image
              alt=""
              aria-hidden="true"
              className="size-8 shrink-0"
              height={32}
              priority
              src="/icon.svg"
              width={32}
            />
            <span>{siteConfig.name}</span>
          </Link>
          <div className="flex shrink-0 items-center">
            <SiteSearch basePath={basePath} />
            <ThemeToggle />
          </div>
        </div>

        <p className="sidebar-intro">
          I'm{" "}
          <Link
            className="text-primary font-semibold underline underline-offset-4"
            href="/about"
          >
            {siteConfig.name}
          </Link>{" "}
          and this is my digital garden. Notes on technology, learning, and
          making things.
        </p>

        <nav aria-label="Main navigation" className="sidebar-navigation">
          {navigation.map(({ href, label, icon: Icon }) => {
            const isCurrent = isCurrentPath(pathname, href);

            return (
              <Link
                aria-current={isCurrent ? "page" : undefined}
                className={cn(
                  "sidebar-link",
                  isCurrent && "sidebar-link-current",
                )}
                href={href}
                key={href}
              >
                <Icon aria-hidden="true" className="size-5 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <nav aria-label="Follow and subscribe" className="sidebar-footer">
          <a href={siteConfig.author.url}>
            <IconBrandGithub aria-hidden="true" className="size-4" /> GitHub
          </a>
          <a href={`${basePath}/rss.xml`}>
            <IconRss aria-hidden="true" className="size-4" /> RSS
          </a>
        </nav>
      </header>
    </>
  );
}
