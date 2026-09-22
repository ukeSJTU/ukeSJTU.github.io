import Link from "next/link";
import {
  formatPostDate,
  getPostPath,
  getPostUpdatedDateString,
  type Post,
} from "@/lib/content/blog";
import { cn } from "@/lib/utils";
import styles from "./content-list.module.css";

export function BlogList({
  entries,
  ordered = false,
  compact = false,
}: {
  entries: Post[];
  ordered?: boolean;
  compact?: boolean;
}) {
  const List = ordered ? "ol" : "ul";
  return (
    <List
      className={cn(
        styles.list,
        ordered && styles.ordered,
        compact && styles.compact,
      )}
    >
      {entries.map((post) => {
        const updated = getPostUpdatedDateString(post);
        const date = updated ?? post.publishedAt;
        return (
          <li className={styles.item} key={post.slug}>
            <Link
              className={styles.link}
              href={getPostPath(post)}
              transitionTypes={["nav-forward"]}
            >
              <div>
                <div className={styles.row}>
                  <h2 className={styles.title}>{post.title}</h2>
                  {!ordered && (
                    <time className={styles.detail} dateTime={date}>
                      {updated ? "Updated" : "Published"} {formatPostDate(date)}
                    </time>
                  )}
                </div>
                {!compact && (
                  <p className={cn(styles.description, styles.clamped)}>
                    {post.summary}
                  </p>
                )}
              </div>
            </Link>
          </li>
        );
      })}
    </List>
  );
}
