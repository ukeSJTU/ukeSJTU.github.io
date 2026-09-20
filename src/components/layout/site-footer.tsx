import { siteConfig } from "@/lib/site/config";
import styles from "./site-footer.module.css";

export function SiteFooter({ basePath = "" }: { basePath?: string }) {
  return (
    <footer className={styles.footer}>
      <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span>
          © {new Date().getFullYear()} {siteConfig.author.name}
        </span>
        <a href="https://creativecommons.org/licenses/by/4.0/" rel="license">
          Content: CC BY 4.0
        </a>
      </p>
      <nav aria-label="Footer navigation">
        <a href={siteConfig.author.url}>GitHub</a>
        <a href={`${basePath}/rss.xml`}>RSS</a>
        <a href={`${siteConfig.author.url}/ukesjtu.github.io`}>Source</a>
      </nav>
    </footer>
  );
}
