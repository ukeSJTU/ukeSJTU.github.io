import type { Metadata } from "next";
import Link from "next/link";
import prose from "@/components/markdown/prose.module.css";
import { PageHeading } from "@/components/page-heading";
import { PageTransition } from "@/components/page-transition";
import { siteConfig } from "@/lib/site/config";
import { createPageMetadata } from "@/lib/site/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "Mingxi Lv (ukeraser), an SJTU student exploring AI, full-stack development, and systems programming.",
  path: "/about",
});
export default function AboutPage() {
  return (
    <PageTransition>
      <main
        className="page-content reading-page"
        data-pagefind-body
        data-pagefind-meta="url:/about"
        id="main-content"
      >
        <PageHeading title="About" />
        <div className={prose.prose}>
          <p>
            I'm Mingxi Lv (ukeraser), a student at Shanghai Jiao Tong
            University. I'm interested in AI, full-stack development, and
            systems programming.
          </p>
          <p>
            I work with Python and TypeScript, and my projects range from web
            applications to tools for the editor and command line. My internship
            and research experience has involved backend systems, agent
            workflows, and full-stack development.
          </p>
          <p>
            I like learning by building small things and examining how they
            work. On this site, that takes the form of software projects and
            technical notes—from a radio player for Neovim to experiments with
            Linux file links.
          </p>
          <p>
            <Link href="/resume">View my résumé</Link> or{" "}
            <a
              href={siteConfig.author.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              find me on GitHub
            </a>
            .
          </p>
          <h2>About this site</h2>
          <p>
            This is my personal website, built with Next.js and Content
            Collections. I use it to share projects, document experiments, and
            keep useful explanations together.
          </p>
        </div>
      </main>
    </PageTransition>
  );
}
