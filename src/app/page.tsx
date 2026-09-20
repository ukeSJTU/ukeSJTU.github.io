import Link from "next/link";
import { BlogList } from "@/components/blog-list";
import { JsonLd } from "@/components/json-ld";
import { PageTransition } from "@/components/page-transition";
import { getPostUrl, sortedBlogPosts } from "@/lib/content/blog";
import { siteConfig } from "@/lib/site/config";
import {
  blogPostingReference,
  schemaEntity,
  siteAuthor,
} from "@/lib/site/structured-data";
import { VolcanoHero } from "./_components/volcano-hero";

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
        <header className="home-intro">
          <div className="home-intro-copy">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Hey, I'm {siteConfig.author.name}!
            </h1>
            <p className="mt-4 text-xl leading-relaxed">
              Notes on technology, learning, and making things.
            </p>
            <p className="text-muted-foreground mt-3 max-w-2xl leading-7">
              Welcome to my digital garden. This is where I collect what I'm
              learning, document my experiments, and keep ideas worth
              revisiting.
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

        <section aria-labelledby="latest-notes" className="mt-8 sm:mt-9">
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
          <BlogList entries={sortedBlogPosts.slice(0, 5)} />
        </section>
      </main>
    </PageTransition>
  );
}
