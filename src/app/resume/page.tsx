import type { Metadata } from "next";
import { PageTransition } from "@/components/page-transition";
import { createPageMetadata } from "@/lib/site/metadata";
import styles from "./page.module.css";

export const metadata: Metadata = createPageMetadata({
  title: "Resume",
  description:
    "Mingxi Lv (ukeraser): education, experience, research, and skills.",
  path: "/resume",
});
const basePath = process.env.PAGES_BASE_PATH ?? "";

export default function ResumePage() {
  return (
    <PageTransition>
      <main
        className="page-content reading-page"
        data-pagefind-body
        data-pagefind-meta="url:/resume"
        id="main-content"
      >
        <header className={styles.header}>
          <h1 data-pagefind-meta="title">Resume</h1>
          <a href={`${basePath}/resume.pdf`} download="resume.pdf">
            Download résumé (中文 PDF)
          </a>
        </header>
        <p className={styles.notice} data-pagefind-ignore>
          The PDF is currently a blank placeholder. English role titles and
          current-role dates below are awaiting confirmation.
        </p>
        <h2 className={styles.name}>
          Mingxi Lv <span>/ ukeraser</span>
        </h2>
        <p className="text-muted-foreground" data-pagefind-meta="summary">
          AI, full-stack development, and systems programming
        </p>
        <section className={styles.section}>
          <h2>Education</h2>
          <div className={styles.entry}>
            <div className={styles.row}>
              <h3>Shanghai Jiao Tong University</h3>
              <p>Sep 2023 – Jun 2027 (expected)</p>
            </div>
            <p>Undergraduate · Information Engineering (IEEE)</p>
          </div>
        </section>
        <section className={styles.section}>
          <h2>Experience</h2>
          <div className={styles.entry}>
            <div className={styles.row}>
              <h3>XDeNovo</h3>
              <p>Started Jun 2026*</p>
            </div>
            <p>Agent &amp; full-stack development intern</p>
            <ul>
              <li>Agent workflows and tools for scientific computing.</li>
            </ul>
          </div>
          <div className={styles.entry}>
            <div className={styles.row}>
              <h3>ByteDance</h3>
              <p>Feb – Jun 2026</p>
            </div>
            <p>Backend development intern</p>
            <ul>
              <li>Backend development and internal tooling.</li>
            </ul>
          </div>
        </section>
        <section className={styles.section}>
          <h2>Research</h2>
          <div className={styles.entry}>
            <div className={styles.row}>
              <h3>Shanghai Jiao Tong University</h3>
              <p>Started Feb 2026*</p>
            </div>
            <p>Research assistant</p>
            <ul>
              <li>
                Research tooling involving paper analysis and AI-assisted
                review.
              </li>
            </ul>
          </div>
        </section>
        <section className={styles.section}>
          <h2>Skills</h2>
          <div className={styles.skills}>
            <p>
              <strong>Languages</strong> Python, TypeScript / JavaScript, C++
            </p>
            <p>
              <strong>Applications</strong> React, Next.js, FastAPI, PostgreSQL
            </p>
            <p>
              <strong>Tools</strong> Git, Docker, pytest, Vitest
            </p>
          </div>
        </section>
        <p className={styles.notice} data-pagefind-ignore>
          *Start dates are shown where the current status and end date have not
          yet been confirmed.
        </p>
      </main>
    </PageTransition>
  );
}
