"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteSearch } from "@/components/search/site-search";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/posts", label: "Posts" },
] as const;

function isCurrentPath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({ basePath = "" }: { basePath?: string }) {
  const pathname = usePathname();

  return (
    <>
      <a
        className="bg-background text-foreground focus-visible:ring-ring fixed top-3 left-3 z-50 -translate-y-20 rounded-md px-3 py-2 text-sm font-medium shadow-sm transition-transform focus-visible:translate-y-0 focus-visible:ring-2 focus-visible:outline-none"
        href="#main-content"
      >
        跳到主要内容
      </a>

      <header className="mx-auto flex w-full max-w-3xl items-center px-6 pt-6 sm:px-10 sm:pt-8">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <Link
            aria-label="ukeSJTU 首页"
            className="shrink-0 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
            href="/"
          >
            <Image
              alt=""
              aria-hidden="true"
              className="size-14 sm:size-20"
              height={80}
              priority
              src="/icon.svg"
              width={80}
            />
          </Link>

          <div className="flex min-w-0 flex-col items-start gap-1">
            <Link
              aria-current={pathname === "/" ? "page" : undefined}
              className="text-foreground rounded-sm text-2xl font-semibold tracking-tight focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:text-3xl"
              href="/"
            >
              ukeSJTU
            </Link>

            <nav aria-label="主导航" className="flex divide-x divide-border">
              {navigation.map(({ href, label }) => {
                const isCurrent = isCurrentPath(pathname, href);

                return (
                  <Link
                    aria-current={isCurrent ? "page" : undefined}
                    className={cn(
                      "text-primary px-2 text-sm font-semibold underline-offset-4 first:pl-0 last:pr-0 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:text-base",
                      isCurrent && "underline decoration-2",
                    )}
                    href={href}
                    key={href}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center">
          <SiteSearch basePath={basePath} />
          <ThemeToggle />
        </div>
      </header>
    </>
  );
}
