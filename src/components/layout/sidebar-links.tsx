import {
  IconBrandCodepen,
  IconBrandGithub,
  IconBrandX,
  IconMail,
  IconRss,
} from "@tabler/icons-react";
import Link from "next/link";
import { siteConfig } from "@/lib/site/config";
import styles from "./sidebar-links.module.css";

const contactLinks = [
  {
    label: "Email",
    href: `mailto:${siteConfig.author.email}`,
    icon: IconMail,
    newTab: false,
  },
  {
    label: "GitHub",
    href: siteConfig.author.url,
    icon: IconBrandGithub,
    newTab: true,
  },
  {
    label: "X (Twitter)",
    href: siteConfig.author.x,
    icon: IconBrandX,
    newTab: true,
  },
  {
    label: "CodePen",
    href: siteConfig.author.codepen,
    icon: IconBrandCodepen,
    newTab: true,
  },
];

export function SidebarLinks({
  pathname,
  basePath = "",
}: {
  pathname: string;
  basePath?: string;
}) {
  return (
    <>
      <nav
        aria-label="Contact and subscriptions"
        className={styles.socialLinks}
      >
        {contactLinks.map(({ label, href, icon: Icon, newTab }) => (
          <a
            aria-label={label}
            href={href}
            key={label}
            rel={newTab ? "noopener noreferrer" : undefined}
            target={newTab ? "_blank" : undefined}
            title={label}
          >
            <Icon aria-hidden="true" className="size-5" />
          </a>
        ))}
        <a aria-label="RSS feed" href={`${basePath}/rss.xml`} title="RSS feed">
          <IconRss aria-hidden="true" className="size-5" />
        </a>
      </nav>
      <nav aria-label="Secondary navigation" className={styles.secondaryLinks}>
        <span
          aria-disabled="true"
          className={styles.unavailable}
          title="Resume is not available yet"
        >
          Resume<span className="sr-only"> (coming soon)</span>
        </span>
        <Link
          aria-current={
            pathname === "/topics" || pathname.startsWith("/topics/")
              ? "page"
              : undefined
          }
          href="/topics"
        >
          Topics
        </Link>
        <a
          href={siteConfig.sourceUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          Source
        </a>
      </nav>
    </>
  );
}
