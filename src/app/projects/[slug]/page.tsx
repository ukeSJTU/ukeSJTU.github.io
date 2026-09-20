import { IconArrowLeft } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { PageTransition } from "@/components/page-transition";
import {
  getProjectBySlug,
  getProjectPath,
  getProjectUrl,
  projectsWithArticles,
} from "@/lib/content/projects";
import { createPageMetadata } from "@/lib/site/metadata";
import { schemaEntity, siteAuthor } from "@/lib/site/structured-data";
import { ProjectLinks } from "../_components/project-links";

export const dynamicParams = false;

export function generateStaticParams() {
  return projectsWithArticles.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project?.hasArticle) {
    return {
      title: "Project not found",
      robots: { index: false, follow: false },
    };
  }

  const projectPath = getProjectPath(project);

  return createPageMetadata({
    title: project.name,
    description: project.description,
    path: projectPath,
    article: {},
  });
}

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project?.html) {
    notFound();
  }

  const projectPath = getProjectPath(project);
  const projectUrl = getProjectUrl(project);
  const jsonLd = {
    "@context": "https://schema.org",
    ...schemaEntity("SoftwareSourceCode", projectUrl),
    name: project.name,
    description: project.description,
    dateCreated: String(project.year),
    codeRepository: project.source,
    author: siteAuthor,
  };

  return (
    <PageTransition>
      <main className="page-content" id="main-content">
        <JsonLd data={jsonLd} />
        <Link
          className="text-muted-foreground inline-flex items-center gap-2 text-sm underline underline-offset-4"
          href="/projects"
          transitionTypes={["nav-back"]}
        >
          <IconArrowLeft aria-hidden="true" className="size-4" /> Back to
          projects
        </Link>

        <article
          className="mt-6"
          data-pagefind-body
          data-pagefind-meta={`url:${projectPath}`}
        >
          <header className="border-border border-b pb-6">
            <p className="text-muted-foreground text-sm font-medium tabular-nums">
              {project.year}
            </p>
            <h1
              className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl"
              data-pagefind-meta="title"
            >
              {project.name}
            </h1>
            <p
              className="text-muted-foreground mt-4 max-w-2xl text-lg leading-relaxed"
              data-pagefind-meta="summary"
            >
              {project.description}
            </p>
            <ProjectLinks project={project} variant="detail" />
          </header>

          <MarkdownRenderer
            className="mt-6 max-w-3xl"
            contentKey={project.slug}
            html={project.html}
          />
        </article>
      </main>
    </PageTransition>
  );
}
