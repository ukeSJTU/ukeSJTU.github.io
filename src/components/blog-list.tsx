import Link from "next/link";
import {
  getPostModifiedDate,
  getPostModifiedDateString,
  getPostPath,
  type Post,
} from "@/lib/content/blog";
import { siteConfig } from "@/lib/site/config";
import { cn } from "@/lib/utils";
import styles from "./blog-list.module.css";

const dateFormatter = new Intl.DateTimeFormat(siteConfig.language, {
  dateStyle: "medium",
  timeZone: "Asia/Shanghai",
});

export function BlogList({ entries }: { entries: Post[] }) {
  return (
    <ul className={styles.list}>
      {entries.map((post) => (
        <li key={post.slug}>
          <Link
            className={cn(styles.link, "group")}
            href={getPostPath(post)}
            transitionTypes={["nav-forward"]}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
              <h3 className="text-xl font-semibold underline-offset-4 group-hover:underline">
                {post.title}
              </h3>
              <time
                className="text-muted-foreground shrink-0 text-sm tabular-nums"
                dateTime={getPostModifiedDateString(post)}
              >
                {dateFormatter.format(getPostModifiedDate(post))}
              </time>
            </div>
            <p className="text-muted-foreground mt-2 leading-relaxed">
              {post.summary}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
