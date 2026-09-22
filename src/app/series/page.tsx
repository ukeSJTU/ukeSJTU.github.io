import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/content-list.module.css";
import { JsonLd } from "@/components/json-ld";
import { PageHeading } from "@/components/page-heading";
import { PageTransition } from "@/components/page-transition";
import {
  getSeriesPath,
  getSeriesUrl,
  seriesWithPosts,
} from "@/lib/content/series";
import { siteConfig } from "@/lib/site/config";
import { createPageMetadata } from "@/lib/site/metadata";
import { schemaEntity, siteAuthor } from "@/lib/site/structured-data";

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
        <PageHeading title="Series" />
        <ul className={styles.list}>
          {seriesWithPosts.map((series) => (
            <li className={styles.item} key={series.slug}>
              <Link
                className={styles.link}
                href={getSeriesPath(series)}
                transitionTypes={["nav-forward"]}
              >
                <div className={styles.row}>
                  <h2 className={styles.title}>{series.name}</h2>
                  <span className={styles.detail}>
                    {series.posts.length}{" "}
                    {series.posts.length === 1 ? "article" : "articles"}
                  </span>
                </div>
                <p className={styles.description}>{series.description}</p>
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
