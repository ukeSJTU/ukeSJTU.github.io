import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site/config";

export const metadata: Metadata = {
  title: "About",
  description: `关于 ${siteConfig.name} 与这个个人知识站。`,
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <main
      className="mx-auto min-h-screen w-full max-w-3xl px-6 pt-6 pb-16 sm:px-10 sm:pt-8"
      id="main-content"
    >
      <header className="max-w-2xl">
        <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
          About
        </p>
        <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">关于这里</h1>
        <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
          {siteConfig.description}
        </p>
      </header>

      <div className="mt-10 max-w-2xl space-y-5 font-serif text-lg leading-[1.85]">
        <p>
          这里会逐步补充关于我、这个网站，以及正在学习和构建的内容。目前可以先把它理解为一块持续生长的个人知识花园。
        </p>
        <p>
          更多信息可以暂时通过
          <Link
            className="text-primary mx-1 font-medium underline underline-offset-4"
            href={siteConfig.author.url}
          >
            GitHub
          </Link>
          了解。
        </p>
      </div>
    </main>
  );
}
