import Link from "next/link";
import { getProjectPath, type Project } from "@/lib/content/projects";
import { ProjectLinks } from "./project-links";

export function ProjectList({ entries }: { entries: Project[] }) {
  return (
    <ul className="border-border border-t">
      {entries.map((project) => {
        const projectPath = getProjectPath(project);

        return (
          <li
            className="border-border grid gap-3 border-b py-7 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-6 sm:py-8"
            key={project.slug}
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
                    transitionTypes={["nav-forward"]}
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

              <ProjectLinks project={project} variant="index" />
            </article>
          </li>
        );
      })}
    </ul>
  );
}
