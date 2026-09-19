import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { getPostPath, getPostUrl, sortedPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
    hasPart: sortedPosts.map((post) => ({
      "@type": "BlogPosting",
      "@id": getPostUrl(post._meta.path),
      url: getPostUrl(post._meta.path),
      headline: post.title,
    })),
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-10 px-6 py-16 sm:px-10">
      <JsonLd data={jsonLd} />
      <header className="flex flex-col gap-3">
        <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
          Content Collections
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">Posts</h1>
        <p className="text-muted-foreground">
          {sortedPosts.length} {sortedPosts.length === 1 ? "post" : "posts"}
        </p>
      </header>

      <section className="flex flex-col gap-6">
        {sortedPosts.map((post) => (
          <Link
            className="group border-border hover:bg-muted rounded-2xl border p-6 transition-colors"
            href={getPostPath(post._meta.path)}
            key={post._meta.path}
          >
            <article className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-tight underline-offset-4 group-hover:underline">
                {post.title}
              </h2>
              <p className="text-muted-foreground">{post.summary}</p>
              <code className="text-muted-foreground block text-sm">
                /{post._meta.path}
              </code>
            </article>
          </Link>
        ))}
      </section>
    </main>
  );
}
