import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageTransition } from "@/components/page-transition";
import {
  getSeriesPath,
  getSeriesUrl,
  seriesWithPosts,
} from "@/lib/content/series";
import { siteConfig } from "@/lib/site/config";
import { createPageMetadata } from "@/lib/site/metadata";
import { schemaEntity, siteAuthor } from "@/lib/site/structured-data";
import styles from "./page.module.css";

export const metadata: Metadata = createPageMetadata({
  title: "Series",
  description: `Explore ${siteConfig.name}'s notes in curated reading order.`,
  path: "/series",
});

export default function SeriesIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    ...schemaEntity("CollectionPage", "/series"),
    name: "Series",
    description: metadata.description,
    inLanguage: siteConfig.language,
    author: siteAuthor,
    hasPart: seriesWithPosts.map((series) => ({
      ...schemaEntity("CollectionPage", getSeriesUrl(series)),
      name: series.name,
      description: series.description,
    })),
  };

  return (
    <PageTransition>
      <main className="page-content" id="main-content">
        <JsonLd data={jsonLd} />
        <header className="max-w-2xl pb-8 sm:pb-10">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Series
          </h1>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            Notes connected by a theme, arranged in a reading order.
          </p>
        </header>
        <ul className={styles.list}>
          {seriesWithPosts.map((series) => (
            <li key={series.slug}>
              <Link
                className={styles.link}
                href={getSeriesPath(series)}
                transitionTypes={["nav-forward"]}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <h2 className="text-xl font-semibold">{series.name}</h2>
                  <span className="text-muted-foreground shrink-0 text-sm">
                    {series.posts.length}{" "}
                    {series.posts.length === 1 ? "note" : "notes"}
                  </span>
                </div>
                <p className="text-muted-foreground mt-2 leading-relaxed">
                  {series.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
        {seriesWithPosts.length === 0 && (
          <p className="text-muted-foreground">No series yet.</p>
        )}
      </main>
    </PageTransition>
  );
}
