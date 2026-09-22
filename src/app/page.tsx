import Link from "next/link";
import { BlogList } from "@/components/blog-list";
import { JsonLd } from "@/components/json-ld";
import { PageTransition } from "@/components/page-transition";
import { getPostUrl, sortedBlogPosts } from "@/lib/content/blog";
import { getFeaturedWork } from "@/lib/content/featured";
import { siteConfig } from "@/lib/site/config";
import {
  blogPostingReference,
  schemaEntity,
  siteAuthor,
} from "@/lib/site/structured-data";
import { VolcanoHero } from "./_components/volcano-hero";
import styles from "./page.module.css";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    ...schemaEntity("WebSite", "/"),
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    author: siteAuthor,
    hasPart: sortedBlogPosts.map((post) =>
      blogPostingReference(post.title, getPostUrl(post)),
    ),
  };

  return (
    <PageTransition>
      <main className="page-content" id="main-content">
        <JsonLd data={jsonLd} />
        <header className={styles.intro}>
          <div className={styles.introCopy}>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-[2.625rem]">
              Hey, I'm {siteConfig.name}.
            </h1>
            <p className="mt-4 max-w-lg text-xl leading-relaxed">
              An SJTU student exploring AI, full-stack development, and systems
              programming.
            </p>
            <p className="text-muted-foreground mt-3 leading-7">
              I build software and write about what I learn.
            </p>
            <Link
              className="text-primary mt-3 inline-block font-medium underline underline-offset-4"
              href="/about"
            >
              More about me
            </Link>
          </div>
          <VolcanoHero />
        </header>

        <section aria-labelledby="selected-work" className={styles.featured}>
          <h2
            className="text-2xl font-semibold tracking-tight"
            id="selected-work"
          >
            Selected work
          </h2>
          <ul>
            {getFeaturedWork().map((entry) => (
              <li key={entry.href}>
                <Link
                  className={styles.featuredLink}
                  href={entry.href}
                  transitionTypes={["nav-forward"]}
                >
                  <span className={styles.type}>{entry.type}</span>
                  <div>
                    <h3>{entry.title}</h3>
                    <p>{entry.description}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="latest-notes" className="mt-12">
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-tight" id="latest-notes">
              Latest notes
            </h2>
            <Link
              className="text-primary text-sm font-medium underline underline-offset-4"
              href="/blog"
            >
              View blog
            </Link>
          </div>
          <BlogList entries={sortedBlogPosts.slice(0, 3)} compact />
        </section>
      </main>
    </PageTransition>
  );
}
