import type { TableOfContentsItem } from "@/lib/content/markdown/table-of-contents";
import { cn } from "@/lib/utils";
import styles from "./blog-table-of-contents.module.css";

function TableOfContentsLinks({ items }: { items: TableOfContentsItem[] }) {
  return (
    <ol className={styles.list}>
      {items.map((item) => (
        <li key={item.id}>
          <a
            className={styles.link}
            data-depth={item.depth}
            href={`#${item.id}`}
          >
            {item.text}
          </a>
        </li>
      ))}
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
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={cn(styles.root, className)}>
      <details className={styles.mobile}>
        <summary className={styles.summary}>On this page</summary>
        <nav aria-label="Table of contents" className={styles.mobileNav}>
          <TableOfContentsLinks items={items} />
        </nav>
      </details>

      <aside aria-label="Table of contents" className={styles.desktop}>
        <p className={styles.title}>On this page</p>
        <nav>
          <TableOfContentsLinks items={items} />
        </nav>
      </aside>
    </div>
  );
}
