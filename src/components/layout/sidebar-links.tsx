import { IconBrandGithub, IconRss } from "@tabler/icons-react";
import { siteConfig } from "@/lib/site/config";
import styles from "./sidebar-links.module.css";

export function SidebarLinks({ basePath = "" }: { basePath?: string }) {
  return (
    <nav aria-label="Contact and subscriptions" className={styles.socialLinks}>
      <a
        aria-label="GitHub"
        href={siteConfig.author.url}
        rel="noopener noreferrer"
        target="_blank"
        title="GitHub"
      >
        <IconBrandGithub aria-hidden="true" className="size-5" />
      </a>
      <a aria-label="RSS feed" href={`${basePath}/rss.xml`} title="RSS feed">
        <IconRss aria-hidden="true" className="size-5" />
      </a>
    </nav>
  );
}
