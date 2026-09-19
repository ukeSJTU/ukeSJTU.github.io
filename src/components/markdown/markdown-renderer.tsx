/* biome-ignore-all lint/security/noDangerouslySetInnerHtml: posts are trusted repository-owned Markdown */

import { cn } from "@/lib/utils";
import styles from "./prose.module.css";

type MarkdownRendererProps = {
  className?: string;
  html: string;
};

export function MarkdownRenderer({ className, html }: MarkdownRendererProps) {
  return (
    <div
      className={cn(styles.prose, className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
