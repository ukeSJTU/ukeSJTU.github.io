import {
  IconArrowLeft,
  IconBrandGithub,
  IconExternalLink,
} from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import {
  getProjectPath,
  getProjectUrl,
  projectsWithArticles,
} from "@/lib/content/projects";
import { siteConfig } from "@/lib/site/config";

export const dynamicParams = false;

export function generateStaticParams() {
  return projectsWithArticles.map((project) => ({
    slug: project._meta.path,
  }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projectsWithArticles.find(
    (candidate) => candidate._meta.path === slug,
  );

  if (!project) {
    return {
      title: "Project not found",
      robots: { index: false, follow: false },
    };
  }

  const projectPath = getProjectPath(project._meta.path);

  return {
    title: project.name,
    description: project.description,
    alternates: {
      canonical: projectPath,
    },
    openGraph: {
      type: "article",
      locale: siteConfig.locale,
      url: projectPath,
      siteName: siteConfig.name,
      title: project.name,
      description: project.description,
      authors: [siteConfig.author.name],
    },
    twitter: {
      card: "summary",
      title: project.name,
      description: project.description,
    },
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = projectsWithArticles.find(
    (candidate) => candidate._meta.path === slug,
  );

  if (!project?.html) {
    notFound();
  }

  const projectPath = getProjectPath(project._meta.path);
  const projectUrl = getProjectUrl(project._meta.path);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "@id": `${projectUrl}#project`,
    name: project.name,
    description: project.description,
    dateCreated: String(project.year),
    url: projectUrl,
    codeRepository: project.source,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
  };

  return (
    <main className="page-content" id="main-content">
      <JsonLd data={jsonLd} />
      <Link
        className="text-muted-foreground inline-flex items-center gap-2 text-sm underline underline-offset-4"
        href="/projects"
      >
        <IconArrowLeft aria-hidden="true" className="size-4" /> Back to projects
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
          <nav
            aria-label={`${project.name} links`}
            className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-medium"
          >
            {project.demo ? (
              <a
                className="text-primary inline-flex items-center gap-1.5 underline underline-offset-4"
                href={project.demo}
              >
                <IconExternalLink aria-hidden="true" className="size-4" />
                Demo
              </a>
            ) : null}
            {project.source ? (
              <a
                className="text-primary inline-flex items-center gap-1.5 underline underline-offset-4"
                href={project.source}
              >
                <IconBrandGithub aria-hidden="true" className="size-4" />
                Source
              </a>
            ) : null}
          </nav>
        </header>

        <MarkdownRenderer
          className="mt-6 max-w-3xl"
          contentKey={project._meta.path}
          html={project.html}
        />
      </article>
    </main>
  );
}
