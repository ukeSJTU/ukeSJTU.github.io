/* biome-ignore-all lint/security/noDangerouslySetInnerHtml: posts are trusted repository-owned Markdown */

import { cn } from "@/lib/utils";
import { CodeBlockCopyController } from "./code-block-copy-controller";
import styles from "./prose.module.css";

type MarkdownRendererProps = {
  className?: string;
  html: string;
};

export function MarkdownRenderer({ className, html }: MarkdownRendererProps) {
  return (
    <CodeBlockCopyController>
      <div
        className={cn(styles.prose, className)}
        // pi-lens-ignore: dangerously-set-inner-html
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </CodeBlockCopyController>
  );
}
