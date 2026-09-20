import type { ReactNode } from "react";
import { ViewTransition } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      default="none"
      enter={{
        "nav-forward": "slide-from-right",
        "nav-back": "slide-from-left",
        default: "page-enter",
      }}
      exit={{
        "nav-forward": "slide-to-left",
        "nav-back": "slide-to-right",
        default: "page-exit",
      }}
    >
      {children}
    </ViewTransition>
  );
}
