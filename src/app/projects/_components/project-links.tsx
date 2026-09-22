import { IconExternalLink } from "@tabler/icons-react";
import type { Project } from "@/lib/content/projects";

export function ProjectLinks({
  project,
}: {
  project: Pick<Project, "name" | "demo" | "source">;
}) {
  if (!project.demo && !project.source) return null;
  return (
    <nav
      aria-label={`${project.name} links`}
      className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm"
      data-pagefind-ignore
    >
      {[
        { href: project.demo, label: "Demo" },
        { href: project.source, label: "Source" },
      ].map(({ href, label }) =>
        href ? (
          <a
            className="text-primary inline-flex items-center gap-1 underline underline-offset-4"
            href={href}
            key={label}
            rel="noopener noreferrer"
            target="_blank"
          >
            {label}
            <IconExternalLink aria-hidden="true" size={13} />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : null,
      )}
    </nav>
  );
}
