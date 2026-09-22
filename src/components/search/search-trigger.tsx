"use client";
import { Button } from "@/components/ui/button";

export const openSearchEvent = "site-search:open";

// Additional entrances reuse the one modal and its focus/keyboard lifecycle.
export function SearchTrigger() {
  return (
    <Button
      aria-haspopup="dialog"
      onClick={(event) =>
        document.dispatchEvent(
          new CustomEvent(openSearchEvent, { detail: event.currentTarget }),
        )
      }
      variant="outline"
    >
      Search
    </Button>
  );
}
