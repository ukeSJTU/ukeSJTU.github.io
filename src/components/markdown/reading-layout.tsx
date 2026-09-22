import type { ReactNode } from "react";
import type { TableOfContentsItem } from "@/lib/content/markdown/table-of-contents";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "./markdown-renderer";
import styles from "./reading-layout.module.css";
import { TableOfContents } from "./table-of-contents";

export function ReadingLayout({
  header,
  html,
  tableOfContents,
  children,
}: {
  header: ReactNode;
  html: string;
  tableOfContents: TableOfContentsItem[];
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        styles.layout,
        tableOfContents.length > 0 && styles.withToc,
      )}
    >
      <header className={styles.header}>{header}</header>
      <TableOfContents className={styles.toc} items={tableOfContents} />
      <div className={styles.body}>
        <MarkdownRenderer html={html} />
        {children}
      </div>
    </div>
  );
}
