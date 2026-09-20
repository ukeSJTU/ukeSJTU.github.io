import type { Metadata } from "next";
import Link from "next/link";
import { PageTransition } from "@/components/page-transition";
import { siteConfig } from "@/lib/site/config";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name} and this digital garden.`,
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <PageTransition>
      <main
        className="page-content"
        data-pagefind-body
        data-pagefind-meta="url:/about"
        id="main-content"
      >
        <header className="max-w-2xl">
          <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
            About
          </p>
          <h1
            className="mt-3 text-4xl font-semibold sm:text-5xl"
            data-pagefind-meta="title"
          >
            About this site
          </h1>
          <p
            className="text-muted-foreground mt-4 text-lg leading-relaxed"
            data-pagefind-meta="summary"
          >
            {siteConfig.description}
          </p>
        </header>

        <div className="mt-6 flex max-w-2xl flex-col gap-4 font-serif text-lg leading-[1.8]">
          <p>
            I'm {siteConfig.author.name}. This is a growing collection of notes
            on what I'm learning and building. I'll share more about myself and
            this site as it takes shape.
          </p>
          <p>
            You can also find me on{" "}
            <Link
              className="text-primary font-medium underline underline-offset-4"
              href={siteConfig.author.url}
            >
              GitHub
            </Link>
            .
          </p>
        </div>
      </main>
    </PageTransition>
  );
}
