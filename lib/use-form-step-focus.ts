"use client";

import { useEffect, useRef } from "react";

// Wait for the new form step to mount before moving focus and the viewport.
export function useFormStepFocus<T extends HTMLElement>(step: unknown) {
  const target = useRef<T>(null);
  useEffect(() => {
    if (!step) return;
    const frame = requestAnimationFrame(() => {
      const element = target.current;
      if (!element) return;
      element.focus({ preventScroll: true });
      element.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [step]);
  return target;
}
