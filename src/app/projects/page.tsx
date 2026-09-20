import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { PageTransition } from "@/components/page-transition";
import { getProjectUrl, sortedProjects } from "@/lib/content/projects";
import { siteConfig } from "@/lib/site/config";
import { createPageMetadata } from "@/lib/site/metadata";
import { schemaEntity, siteAuthor } from "@/lib/site/structured-data";
import { ProjectList } from "./_components/project-list";

export const metadata: Metadata = createPageMetadata({
  title: "Projects",
  description: `Selected software projects built by ${siteConfig.name}.`,
  path: "/projects",
});

export default function ProjectsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    ...schemaEntity("CollectionPage", "/projects"),
    name: "Projects",
    description: metadata.description,
    inLanguage: siteConfig.language,
    author: siteAuthor,
    hasPart: sortedProjects.map((project) => ({
      ...(project.hasArticle
        ? schemaEntity("SoftwareSourceCode", getProjectUrl(project))
        : {
            "@type": "SoftwareSourceCode",
            url: project.demo ?? project.source,
          }),
      name: project.name,
      description: project.description,
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
