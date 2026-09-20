"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import type { TableOfContentsItem } from "@/lib/content/markdown/table-of-contents";
import { cn } from "@/lib/utils";
import styles from "./blog-table-of-contents.module.css";

function TableOfContentsLinks({
  activeId,
  indicatorId,
  items,
  onActivate,
}: {
  activeId: string | null;
  indicatorId: string;
  items: TableOfContentsItem[];
  onActivate: (id: string) => void;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <ol className={styles.list}>
      {items.map((item) => {
        const isActive = item.id === activeId;

        return (
          <li key={item.id}>
            <a
              aria-current={isActive ? "location" : undefined}
              className={styles.link}
              data-active={isActive || undefined}
              data-depth={item.depth}
              href={`#${item.id}`}
              onClick={() => onActivate(item.id)}
            >
              {isActive ? (
                <motion.span
                  aria-hidden="true"
                  className={styles.indicator}
                  layoutId={indicatorId}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : {
                          type: "spring",
                          stiffness: 520,
                          damping: 42,
                          mass: 0.6,
                        }
                  }
                />
              ) : null}
              <span className={styles.linkLabel}>{item.text}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}

export function BlogTableOfContents({
  className,
  items,
}: {
  className?: string;
  items: TableOfContentsItem[];
}) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((heading): heading is HTMLElement => heading !== null);

    if (headings.length === 0) return;

    let animationFrame = 0;

    function updateActiveHeading() {
      const activationLine = Math.min(window.innerHeight * 0.22, 180);
      let nextActiveId = headings[0].id;

      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > activationLine) break;
        nextActiveId = heading.id;
      }

      const isAtDocumentEnd =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2;
      if (isAtDocumentEnd) {
        nextActiveId = headings.at(-1)?.id ?? nextActiveId;
      }

      setActiveId((current) =>
        current === nextActiveId ? current : nextActiveId,
      );
    }

    function scheduleUpdate() {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(updateActiveHeading);
    }

    scheduleUpdate();
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("scroll", scheduleUpdate);
    };
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={cn(styles.root, className)}>
      <details className={styles.mobile}>
        <summary className={styles.summary}>On this page</summary>
        <nav aria-label="Table of contents" className={styles.mobileNav}>
          <TableOfContentsLinks
            activeId={activeId}
            indicatorId="toc-active-mobile"
            items={items}
            onActivate={setActiveId}
          />
        </nav>
      </details>

      <aside aria-label="Table of contents" className={styles.desktop}>
        <p className={styles.title}>On this page</p>
        <nav>
          <TableOfContentsLinks
            activeId={activeId}
            indicatorId="toc-active-desktop"
            items={items}
            onActivate={setActiveId}
          />
        </nav>
      </aside>
    </div>
  );
}
