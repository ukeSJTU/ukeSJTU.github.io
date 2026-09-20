import { siteConfig } from "@/lib/site/config";

export function SiteFooter({ basePath = "" }: { basePath?: string }) {
  return (
    <footer className="site-footer">
      <p>
        © {new Date().getFullYear()} {siteConfig.author.name}
      </p>
      <nav aria-label="Footer navigation">
        <a href={siteConfig.author.url}>GitHub</a>
        <a href={`${basePath}/rss.xml`}>RSS</a>
        <a href={`${siteConfig.author.url}/ukesjtu.github.io`}>Source</a>
      </nav>
    </footer>
  );
}
