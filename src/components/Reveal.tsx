"use client";

// Modules rise into place as the rack scrolls into view.
// The server HTML is always visible (no JS, no problem). After hydration, only the
// modules that are still below the fold are hidden, then revealed when they scroll in.

import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({ children, delay = 0, span = 12 }: { children: ReactNode; delay?: number; span?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"static" | "waiting" | "shown">("static");

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < innerHeight) return; // already on screen: leave it
    setState("waiting");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown");
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="reveal"
      data-state={state}
      style={{ gridColumn: `span ${span}`, display: "flex", transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
