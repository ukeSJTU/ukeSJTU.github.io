import Link from "next/link";
import { PageTransition } from "@/components/page-transition";
import { SearchTrigger } from "@/components/search/search-trigger";
import { VolcanoHero } from "./_components/volcano-hero";

export default function NotFound() {
  return (
    <PageTransition>
      <main
        className="page-content flex flex-1 flex-col items-center justify-center py-12 text-center"
        id="main-content"
      >
        <div className="w-32 [&>div]:w-full">
          <VolcanoHero />
        </div>
        <p className="text-muted-foreground mt-6 text-sm">404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="text-muted-foreground mt-4">
          This address doesn't lead to a page on this site.
        </p>
        <div className="mt-7 flex items-center gap-6">
          <SearchTrigger />
          <Link className="text-primary underline underline-offset-4" href="/">
            Home
          </Link>
        </div>
      </main>
    </PageTransition>
  );
}
