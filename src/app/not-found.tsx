import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="page-content flex flex-1 items-center" id="main-content">
      <div className="flex w-full flex-col items-start">
        <h1
          aria-label="404 — Page not found"
          className="text-primary font-mono text-[clamp(8rem,32vw,16rem)] leading-[0.72] font-semibold tracking-[-0.09em] tabular-nums"
        >
          404
        </h1>

        <div className="mt-12 flex w-full max-w-xl flex-col items-start gap-6 sm:mt-14 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xl font-medium text-balance">
            Looks like this page wandered off.
          </p>
          <Link
            className={buttonVariants({ size: "lg", variant: "outline" })}
            href="/"
          >
            <IconArrowLeft aria-hidden="true" data-icon="inline-start" />
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
