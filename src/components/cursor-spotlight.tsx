"use client";

import { useEffect, useRef } from "react";

export function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const handleMove = (event: PointerEvent) => {
      node.style.setProperty("--spot-x", `${event.clientX}px`);
      node.style.setProperty("--spot-y", `${event.clientY}px`);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        backgroundImage: [
          "radial-gradient(circle at var(--spot-x, 50%) var(--spot-y, 30%), color-mix(in oklab, var(--foreground) 12%, transparent), transparent 40%)",
          "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
        ].join(","),
        backgroundSize: "100% 100%, 28px 28px",
      }}
    />
  );
}
