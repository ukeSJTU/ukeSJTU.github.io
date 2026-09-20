import {
  IconArticle,
  IconBrandGithub,
  IconExternalLink,
} from "@tabler/icons-react";
import Link from "next/link";
import { getProjectPath, type Project } from "@/lib/content/projects";
import { cn } from "@/lib/utils";

export function ProjectLinks({
  project,
  variant,
}: {
  project: Pick<Project, "slug" | "name" | "demo" | "source" | "hasArticle">;
  variant: "index" | "detail";
}) {
  const linkClassName = cn(
    "text-primary inline-flex items-center gap-1.5 underline-offset-4",
    variant === "detail" ? "underline" : "hover:underline",
  );
  const externalLinks = [
    { href: project.demo, label: "Demo", icon: IconExternalLink },
    { href: project.source, label: "Source", icon: IconBrandGithub },
  ];

  return (
    <nav
      aria-label={`${project.name} links`}
      className={cn(
        "flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-medium",
        variant === "detail" ? "mt-5" : "mt-4",
      )}
    >
      {externalLinks.map(({ href, label, icon: Icon }) =>
        href ? (
          <a
            className={linkClassName}
            href={href}
            key={label}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Icon aria-hidden="true" className="size-4" />
            {label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : null,
      )}
      {variant === "index" && project.hasArticle ? (
        <Link
          className={linkClassName}
          href={getProjectPath(project)}
          transitionTypes={["nav-forward"]}
        >
          <IconArticle aria-hidden="true" className="size-4" />
          Read article
        </Link>
      ) : null}
    </nav>
  );
}
