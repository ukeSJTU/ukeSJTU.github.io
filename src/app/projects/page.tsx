import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { PageTransition } from "@/components/page-transition";
import { ProjectList } from "@/components/project-list";
import { getProjectUrl, sortedProjects } from "@/lib/content/projects";
import { siteConfig } from "@/lib/site/config";

export const metadata: Metadata = {
  title: "Projects",
  description: `Selected software projects built by ${siteConfig.name}.`,
  alternates: {
    canonical: "/projects",
  },
};

export default function ProjectsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projects",
    description: metadata.description,
    url: `${siteConfig.url}/projects`,
    inLanguage: siteConfig.language,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
    hasPart: sortedProjects.map((project) => ({
      "@type": "SoftwareSourceCode",
      name: project.name,
      description: project.description,
      url: project.hasArticle
        ? getProjectUrl(project._meta.path)
        : (project.demo ?? project.source),
      codeRepository: project.source,
    })),
  };

  return (
    <PageTransition>
      <main
        className="page-content"
        data-pagefind-body
        data-pagefind-meta="url:/projects"
        id="main-content"
      >
        <JsonLd data={jsonLd} />
        <header className="max-w-2xl pb-8 sm:pb-10">
          <h1
            className="text-4xl font-semibold tracking-tight sm:text-5xl"
            data-pagefind-meta="title"
          >
            Projects
          </h1>
          <p
            className="text-muted-foreground mt-4 text-lg leading-relaxed"
            data-pagefind-meta="summary"
          >
            A working index of software I’ve built—from everyday tools to small
            systems reconstructed from the inside out.
          </p>
        </header>

        <section aria-labelledby="project-index">
          <h2 className="sr-only" id="project-index">
            Project index
          </h2>
          <ProjectList entries={sortedProjects} />
        </section>
      </main>
    </PageTransition>
  );
}
