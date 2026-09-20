"use client";

import { useEffect, useState } from "react";

export function useSearchViewport(open: boolean) {
  const [viewport, setViewport] = useState<{ height: number; top: number }>();

  useEffect(() => {
    const visualViewport = window.visualViewport;
    if (!open || !visualViewport) return;
    const update = () =>
      setViewport({
        height: visualViewport.height,
        top: visualViewport.offsetTop,
      });
    update();
    visualViewport.addEventListener("resize", update);
    visualViewport.addEventListener("scroll", update);
    return () => {
      visualViewport.removeEventListener("resize", update);
      visualViewport.removeEventListener("scroll", update);
    };
  }, [open]);

  return viewport;
}
