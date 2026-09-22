import Link from "next/link";
import { cn } from "@/lib/utils";
import styles from "./site-sidebar.module.css";

export function SiteNavigation({ pathname }: { pathname: string }) {
  function link(href: string, label: string) {
    const current =
      pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
    return (
      <Link
        aria-current={current ? "page" : undefined}
        className={cn(styles.link, current && styles.current)}
        href={href}
        key={href}
      >
        {label}
      </Link>
    );
  }
  return (
    <nav aria-label="Main navigation" className={styles.navigation}>
      {link("/", "Home")}
      <div className={styles.group}>
        <p className={styles.groupLabel}>Writing</p>
        {link("/blog", "Blog")}
        {link("/series", "Series")}
        {link("/tags", "Tags")}
      </div>
      {link("/projects", "Projects")}
      <div className={styles.group}>
        {link("/about", "About")}
        {link("/resume", "Resume")}
      </div>
    </nav>
  );
}
