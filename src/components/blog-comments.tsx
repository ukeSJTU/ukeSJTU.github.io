"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";
import { absoluteUrl } from "@/lib/site/config";

const giscusThemes = {
  dark: absoluteUrl("/giscus/dark.css"),
  light: absoluteUrl("/giscus/light.css"),
} as const;

export function BlogComments() {
  const { resolvedTheme } = useTheme();
  const theme =
    resolvedTheme === "dark"
      ? giscusThemes.dark
      : resolvedTheme === "light"
        ? giscusThemes.light
        : "preferred_color_scheme";

  return (
    <section
      aria-labelledby="comments-heading"
      className="border-border mt-12 border-t pt-8"
    >
      <header className="mb-6">
        <h2 className="text-2xl font-semibold" id="comments-heading">
          Discussion
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Sign in with GitHub to leave a comment.
        </p>
      </header>

      <Giscus
        category="Announcements"
        categoryId="DIC_kwDOUg4m_84DGABz"
        emitMetadata="0"
        id="comments"
        inputPosition="top"
        lang="en"
        loading="lazy"
        mapping="pathname"
        reactionsEnabled="1"
        repo="ukeSJTU/ukeSJTU.github.io"
        repoId="R_kgDOUg4m_w"
        strict="1"
        theme={theme}
      />
    </section>
  );
}
