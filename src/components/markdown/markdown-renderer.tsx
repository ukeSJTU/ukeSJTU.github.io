/* biome-ignore-all lint/security/noDangerouslySetInnerHtml: posts are trusted repository-owned Markdown */

import { cn } from "@/lib/utils";
import { CodeBlockEnhancer } from "./code-block-enhancer";
import styles from "./prose.module.css";

type MarkdownRendererProps = {
  className?: string;
  contentKey: string;
  html: string;
};

export function MarkdownRenderer({
  className,
  contentKey,
  html,
}: MarkdownRendererProps) {
  return (
    <CodeBlockEnhancer contentKey={contentKey}>
      <div
        className={cn(styles.prose, className)}
        data-markdown-content-key={contentKey}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </CodeBlockEnhancer>
  );
}
