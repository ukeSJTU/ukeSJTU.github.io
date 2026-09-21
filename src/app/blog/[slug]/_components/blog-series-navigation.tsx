import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { getPostPath } from "@/lib/content/blog";
import type { SeriesNavigation } from "@/lib/content/series";
import { cn } from "@/lib/utils";
import styles from "./blog-series-navigation.module.css";

export function BlogSeriesNavigation({
  navigation,
}: {
  navigation: SeriesNavigation;
}) {
  const { previous, next } = navigation;
  if (!previous && !next) return null;

  return (
    <nav
      aria-label="Series navigation"
      className={styles.navigation}
      data-pagefind-ignore
    >
      {previous && (
        <Link
          className={styles.link}
          href={getPostPath(previous)}
          rel="prev"
          transitionTypes={["nav-back"]}
        >
          <span className="text-muted-foreground inline-flex items-center gap-2 text-sm">
            <IconArrowLeft aria-hidden="true" className="size-4" /> Previous in
            series
          </span>
          <span className="font-semibold">{previous.title}</span>
        </Link>
      )}
      {next && (
        <Link
          className={cn(styles.link, styles.next)}
          href={getPostPath(next)}
          rel="next"
          transitionTypes={["nav-forward"]}
        >
          <span className="text-muted-foreground inline-flex items-center gap-2 text-sm">
            Next in series{" "}
            <IconArrowRight aria-hidden="true" className="size-4" />
          </span>
          <span className="font-semibold">{next.title}</span>
        </Link>
      )}
    </nav>
  );
}
