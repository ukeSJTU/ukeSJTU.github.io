import { siteConfig } from "@/lib/site/config";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.divider} aria-hidden="true">
        <svg aria-hidden="true" fill="none" viewBox="0 0 48 30">
          <path
            d="m2 28 15-19 7 4 7-4 15 19M17 9l7 4 7-4M22 5l-1-3m6 3 2-3"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className={styles.content}>
        <span>
          © {new Date().getFullYear()} {siteConfig.author.name}
        </span>
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          rel="license noopener noreferrer"
          target="_blank"
        >
          Content: CC BY 4.0
        </a>
        <a
          href={siteConfig.sourceUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          Source
        </a>
      </div>
    </footer>
  );
}
