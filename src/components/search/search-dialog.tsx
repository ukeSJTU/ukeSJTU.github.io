"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { type CSSProperties, type RefObject, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DialogClose } from "@/components/ui/dialog";
import { InputGroupButton } from "@/components/ui/input-group";
import { useSearchViewport } from "./use-search-viewport";
import { searchResultLimit, useSiteSearch } from "./use-site-search";

const MotionCommandItem = motion.create(CommandItem);

interface SearchDialogProps {
  basePath?: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  returnFocusRef: RefObject<HTMLElement | null>;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

export function SearchDialog({
  basePath = "",
  onOpenChange,
  open,
  returnFocusRef,
  triggerRef,
}: SearchDialogProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const queryRef = useRef("");
  const [query, setQuery] = useState("");
  const [composing, setComposing] = useState(false);
  const state = useSiteSearch({ basePath, query, open, composing });
  const { status, results } = state;
  const viewport = useSearchViewport(open);
  const normalizedQuery = query.trim();

  function updateQuery(value: string) {
    queryRef.current = value.trim();
    setQuery(value);
  }

  function retry() {
    state.retry();
    inputRef.current?.focus();
  }

  const countMessage =
    state.total > searchResultLimit
      ? `Showing ${searchResultLimit} of ${state.total} results. Refine your search for more.`
      : `${state.total} ${state.total === 1 ? "result" : "results"}`;
  const emptyTitle =
    status === "error"
      ? "Search couldn't load."
      : status === "loading"
        ? "Searching…"
        : normalizedQuery && !composing
          ? "No results found."
          : "Search notes and pages.";
  const emptyHint =
    status === "error"
      ? "Check your connection and try again."
      : status === "loading"
        ? ""
        : normalizedQuery && !composing
          ? "Try a different word or a shorter phrase."
          : "Type a word or phrase in English or Chinese.";

  return (
    <CommandDialog
      className="site-search-dialog top-[var(--search-top)] flex flex-col gap-0 sm:max-w-xl [--popover:var(--background)] [--popover-foreground:var(--foreground)]"
      contentProps={{
        initialFocus: inputRef,
        finalFocus: () =>
          returnFocusRef.current?.isConnected
            ? returnFocusRef.current
            : triggerRef.current,
        style: viewport
          ? ({
              "--search-viewport-height": `${viewport.height}px`,
              "--search-viewport-top": `${viewport.top}px`,
            } as CSSProperties)
          : undefined,
      }}
      description="Search notes and pages in English or Chinese. Use arrow keys to choose a result and Enter to open it."
      onOpenChange={onOpenChange}
      open={open}
      title="Search site"
    >
      <Command
        label="Site search"
        loop
        shouldFilter={false}
        onKeyDownCapture={(event) => {
          if (
            event.key === "Enter" &&
            event.target === inputRef.current &&
            (composing ||
              event.nativeEvent.isComposing ||
              event.nativeEvent.keyCode === 229 ||
              status !== "ready")
          ) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
      >
        <CommandInput
          aria-label="Search notes and pages"
          autoCapitalize="none"
          autoComplete="off"
          spellCheck={false}
          onCompositionStart={() => setComposing(true)}
          onCompositionEnd={() => setComposing(false)}
          onValueChange={updateQuery}
          placeholder="Search…"
          ref={inputRef}
          value={query}
          trailing={
            query ? (
              <InputGroupButton
                aria-label="Clear search"
                className="h-10 px-2"
                onKeyDown={(event) => {
                  if (event.key === "Enter") event.stopPropagation();
                }}
                onClick={() => {
                  updateQuery("");
                  inputRef.current?.focus();
                }}
                size="sm"
              >
                Clear
              </InputGroupButton>
            ) : null
          }
        />
        <CommandEmpty className="min-h-0 overflow-y-auto px-5 py-6">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -4 }}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 5 }}
              key={`${status}-${normalizedQuery.length > 0}`}
              transition={{ duration: shouldReduceMotion ? 0 : 0.16 }}
            >
              <p>{emptyTitle}</p>
              {emptyHint ? (
                <p className="search-secondary mt-2">{emptyHint}</p>
              ) : null}
              {status === "error" ? (
                <Button
                  className="mt-4"
                  onClick={retry}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") event.stopPropagation();
                  }}
                  variant="outline"
                >
                  Try again
                </Button>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </CommandEmpty>
        <CommandList
          className="max-h-none flex-1"
          label="Search results"
          aria-busy={status === "loading"}
        >
          {results.length > 0 ? (
            <CommandGroup className="p-2" heading={countMessage}>
              <AnimatePresence initial={false} mode="popLayout">
                {results.map((result, index) => (
                  <MotionCommandItem
                    animate={{ opacity: 1, y: 0 }}
                    className="cursor-pointer items-start px-3 py-3"
                    exit={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : {
                            opacity: 0,
                            y: -4,
                            transition: { duration: 0.1 },
                          }
                    }
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 7 }}
                    key={result.id}
                    layout={shouldReduceMotion ? false : "position"}
                    onSelect={() => {
                      if (
                        status !== "ready" ||
                        state.query !== queryRef.current ||
                        composing
                      )
                        return;
                      onOpenChange(false);
                      router.push(result.href);
                    }}
                    showIndicator={false}
                    transition={{
                      delay: shouldReduceMotion ? 0 : index * 0.025,
                      duration: shouldReduceMotion ? 0 : 0.18,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    value={result.id}
                  >
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <span className="text-base font-medium leading-snug">
                        {result.title}
                      </span>
                      {result.section ? (
                        <span className="text-primary text-xs leading-relaxed">
                          {result.section}
                        </span>
                      ) : null}
                      <p
                        className="search-excerpt search-secondary line-clamp-2 leading-relaxed"
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: Pagefind escapes indexed HTML before inserting its own mark tags.
                        dangerouslySetInnerHTML={{ __html: result.excerpt }}
                      />
                      {result.date ? (
                        <span className="search-secondary text-xs">
                          {result.date}
                        </span>
                      ) : null}
                    </div>
                  </MotionCommandItem>
                ))}
              </AnimatePresence>
            </CommandGroup>
          ) : null}
        </CommandList>
        <span aria-live="polite" aria-atomic="true" className="sr-only">
          {status === "ready"
            ? `${countMessage} for ${normalizedQuery}.`
            : emptyTitle}
        </span>
      </Command>
      <div className="search-secondary flex shrink-0 items-center justify-between gap-3 border-t px-4 py-1 text-xs">
        <span aria-hidden="true" className="hidden items-center gap-3 sm:flex">
          <span>
            <kbd>↑↓</kbd> Navigate
          </span>
          <span>
            <kbd>↵</kbd> Open
          </span>
        </span>
        <span className="sm:hidden">Search notes and pages</span>
        <DialogClose render={<Button className="h-10" variant="ghost" />}>
          Close <kbd className="ml-1 text-xs">Esc</kbd>
        </DialogClose>
      </div>
    </CommandDialog>
  );
}
