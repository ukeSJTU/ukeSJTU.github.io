import Link from "next/link";

export function EmptyArticles() {
  return (
    <div className="py-6">
      <p className="text-muted-foreground">No articles yet.</p>
      <Link
        className="text-primary mt-3 inline-block underline underline-offset-4"
        href="/blog"
      >
        Browse all articles
      </Link>
    </div>
  );
}
