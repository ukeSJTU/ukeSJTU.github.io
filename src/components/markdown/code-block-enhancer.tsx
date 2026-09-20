/* biome-ignore-all lint/a11y/noStaticElementInteractions: events are delegated from semantic buttons generated in trusted Markdown HTML. */
/* biome-ignore-all lint/a11y/useKeyWithClickEvents: keyboard activation of those buttons dispatches the delegated click event. */

"use client";

import { type MouseEvent, type ReactNode, useRef } from "react";

type CopyState = "idle" | "copied" | "error";

const copyFeedback = {
  copied: { label: "Copied", status: "Code copied to clipboard" },
  error: { label: "Copy failed", status: "Could not copy code" },
  idle: { label: "Copy code", status: "" },
} satisfies Record<CopyState, Record<"label" | "status", string>>;

function updateCopyState(button: HTMLButtonElement, state: CopyState) {
  const feedback = copyFeedback[state];
  const status = button.parentElement?.querySelector<HTMLElement>(
    "[data-copy-code-status]",
  );

  button.dataset.copyState = state;
  button.ariaLabel = feedback.label;
  button.title = feedback.label;

  if (status) {
    status.textContent = feedback.status;
  }
}

export function CodeBlockEnhancer({
  children,
  contentKey,
}: {
  children: ReactNode;
  contentKey: string;
}) {
  const feedbackTimers = useRef(
    new WeakMap<HTMLButtonElement, ReturnType<typeof setTimeout>>(),
  );

  async function handleClick(event: MouseEvent<HTMLDivElement>) {
    if (!(event.target instanceof Element)) {
      return;
    }

    const button = event.target.closest<HTMLButtonElement>("[data-copy-code]");

    if (!button || !event.currentTarget.contains(button)) {
      return;
    }

    const code = button
      .closest("[data-code-block]")
      ?.querySelector("code")?.textContent;

    if (code === undefined) {
      return;
    }

    const previousTimer = feedbackTimers.current.get(button);
    clearTimeout(previousTimer);

    try {
      await navigator.clipboard.writeText(code);
      updateCopyState(button, "copied");
    } catch {
      updateCopyState(button, "error");
    }

    const timer = setTimeout(() => {
      if (button.isConnected) {
        updateCopyState(button, "idle");
      }
    }, 2000);
    feedbackTimers.current.set(button, timer);
  }

  return (
    <div
      className="contents"
      data-code-block-enhancer={contentKey}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}
