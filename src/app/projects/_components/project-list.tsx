import Link from "next/link";
import styles from "@/components/content-list.module.css";
import { getProjectPath, type Project } from "@/lib/content/projects";
import { ProjectLinks } from "./project-links";

export function ProjectList({ entries }: { entries: Project[] }) {
  return (
    <ul className={styles.list}>
      {entries.map((project) => (
        <li className={styles.item} key={project.slug}>
          <div className={styles.row}>
            <h2 className={styles.title}>
              {project.hasArticle ? (
                <Link
                  href={getProjectPath(project)}
                  transitionTypes={["nav-forward"]}
                >
                  {project.name}
                </Link>
              ) : (
                project.name
              )}
            </h2>
            <time className={styles.detail} dateTime={String(project.year)}>
              {project.year}
            </time>
          </div>
          <p className={styles.description}>{project.description}</p>
          <ProjectLinks project={project} />
        </li>
      ))}
    </ul>
  );
}
