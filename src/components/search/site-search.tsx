"use client";

import { SearchIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const SearchDialog = dynamic(
  () =>
    import("@/components/search/search-dialog").then(
      (module) => module.SearchDialog,
    ),
  { ssr: false },
);

export function SiteSearch({ basePath = "" }: { basePath?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() !== "k" ||
        (!event.metaKey && !event.ctrlKey)
      ) {
        return;
      }

      event.preventDefault();
      setOpen((current) => !current);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <Button
        aria-label="Search site"
        className="size-10"
        onClick={() => setOpen(true)}
        size="icon-lg"
        title="Search site (Ctrl/⌘ K)"
        type="button"
        variant="ghost"
      >
        <SearchIcon aria-hidden="true" />
      </Button>

      {open ? (
        <SearchDialog basePath={basePath} onOpenChange={setOpen} open={open} />
      ) : null}
    </>
  );
}
