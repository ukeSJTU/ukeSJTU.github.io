import {
  IconArticle,
  IconBrandGithub,
  IconExternalLink,
} from "@tabler/icons-react";
import Link from "next/link";
import { getProjectPath, type Project } from "@/lib/content/projects";

export function ProjectList({ entries }: { entries: Project[] }) {
  return (
    <ul className="border-border border-t">
      {entries.map((project) => {
        const projectPath = getProjectPath(project._meta.path);

        return (
          <li
            className="border-border grid gap-3 border-b py-7 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-6 sm:py-8"
            key={project._meta.path}
          >
            <time
              className="text-muted-foreground text-sm font-medium tabular-nums"
              dateTime={String(project.year)}
            >
              {project.year}
            </time>

            <article className="min-w-0">
              {project.hasArticle ? (
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  <Link
                    className="underline-offset-4 hover:underline"
                    href={projectPath}
                  >
                    {project.name}
                  </Link>
                </h2>
              ) : (
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {project.name}
                </h2>
              )}

              <p className="text-muted-foreground mt-3 max-w-2xl leading-7">
                {project.description}
              </p>

              <nav
                aria-label={`${project.name} links`}
                className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-medium"
              >
                {project.demo ? (
                  <a
                    className="text-primary inline-flex items-center gap-1.5 underline-offset-4 hover:underline"
                    href={project.demo}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <IconExternalLink aria-hidden="true" className="size-4" />
                    Demo
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : null}
                {project.source ? (
                  <a
                    className="text-primary inline-flex items-center gap-1.5 underline-offset-4 hover:underline"
                    href={project.source}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <IconBrandGithub aria-hidden="true" className="size-4" />
                    Source
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : null}
                {project.hasArticle ? (
                  <Link
                    className="text-primary inline-flex items-center gap-1.5 underline-offset-4 hover:underline"
                    href={projectPath}
                  >
                    <IconArticle aria-hidden="true" className="size-4" />
                    Read article
                  </Link>
                ) : null}
              </nav>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
