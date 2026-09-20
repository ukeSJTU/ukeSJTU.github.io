"use client";

import { IconArrowUp } from "@tabler/icons-react";
import { animate, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
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
  const scrollAnimation = useRef<ReturnType<typeof animate> | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    function stopScrollAnimation() {
      scrollAnimation.current?.stop();
      scrollAnimation.current = null;
    }

    window.addEventListener("touchstart", stopScrollAnimation, {
      passive: true,
    });
    window.addEventListener("wheel", stopScrollAnimation, { passive: true });

    return () => {
      stopScrollAnimation();
      window.removeEventListener("touchstart", stopScrollAnimation);
      window.removeEventListener("wheel", stopScrollAnimation);
    };
  }, []);

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

  function scrollToTop() {
    scrollAnimation.current?.stop();

    if (shouldReduceMotion) {
      window.scrollTo({ top: 0 });
      return;
    }

    scrollAnimation.current = animate(window.scrollY, 0, {
      type: "spring",
      stiffness: 115,
      damping: 24,
      mass: 0.8,
      restDelta: 0.5,
      restSpeed: 1,
      onUpdate: (position) => window.scrollTo({ top: Math.max(0, position) }),
      onComplete: () => {
        scrollAnimation.current = null;
      },
    });
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
        <div className={styles.header}>
          <p className={styles.title}>On this page</p>
          <button
            aria-label="Back to top"
            className={styles.backToTop}
            onClick={scrollToTop}
            title="Back to top"
            type="button"
          >
            <IconArrowUp aria-hidden="true" size={15} stroke={1.8} />
          </button>
        </div>
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
