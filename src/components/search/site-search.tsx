"use client";
import { IconSearch } from "@tabler/icons-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
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
  const [hasOpened, setHasOpened] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.isComposing ||
        event.repeat ||
        event.key.toLowerCase() !== "k" ||
        (!event.metaKey && !event.ctrlKey)
      ) {
        return;
      }

      event.preventDefault();
      if (!document.querySelector('[data-slot="dialog-content"]')) {
        const active = document.activeElement;
        returnFocusRef.current =
          active instanceof HTMLElement && active !== document.body
            ? active
            : triggerRef.current;
      }
      setHasOpened(true);
      setOpen((current) => !current);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <Button
        aria-label="Search site"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-keyshortcuts="Control+k Meta+k"
        className="size-10"
        onClick={() => {
          returnFocusRef.current = triggerRef.current;
          setHasOpened(true);
          setOpen(true);
        }}
        ref={triggerRef}
        size="icon-lg"
        title="Search site (Ctrl/⌘ K)"
        type="button"
        variant="ghost"
      >
        <IconSearch aria-hidden="true" data-icon="inline-start" />
      </Button>

      {hasOpened ? (
        <SearchDialog
          basePath={basePath}
          onOpenChange={setOpen}
          open={open}
          returnFocusRef={returnFocusRef}
          triggerRef={triggerRef}
        />
      ) : null}
    </>
  );
}
