"use client";
import { IconSearch } from "@tabler/icons-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { openSearchEvent } from "./search-trigger";

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

    function handleOpen(event: Event) {
      const origin = (event as CustomEvent<unknown>).detail;
      returnFocusRef.current =
        origin instanceof HTMLElement ? origin : triggerRef.current;
      setHasOpened(true);
      setOpen(true);
    }
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener(openSearchEvent, handleOpen);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener(openSearchEvent, handleOpen);
    };
  }, []);

  return (
    <>
      <Button
        aria-label="Search site"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-keyshortcuts="Control+k Meta+k"
        className="text-muted-foreground w-full justify-start gap-2 font-normal"
        onClick={() => {
          returnFocusRef.current = triggerRef.current;
          setHasOpened(true);
          setOpen(true);
        }}
        ref={triggerRef}
        size="lg"
        title="Search site (Ctrl/⌘ K)"
        type="button"
        variant="outline"
      >
        <IconSearch aria-hidden="true" data-icon="inline-start" />
        Search <kbd className="ml-auto text-[10px]">⌘ / Ctrl K</kbd>
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
