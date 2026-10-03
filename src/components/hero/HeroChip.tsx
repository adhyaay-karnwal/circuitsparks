"use client";

import { useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/site/Logo";
import { cn } from "@/lib/cn";

/**
 * Interactive 3D microchip for the home hero (drag to spin).
 * The flat logo mark shows until the first WebGL frame is ready, and stays
 * as the fallback when WebGL is unavailable.
 */
export function HeroChip({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !supportsWebGL()) return;

    let disposed = false;
    let dispose: (() => void) | undefined;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Code-split: three.js only loads after the hero has painted.
    import("./chip-scene")
      .then(({ createChipScene }) => {
        if (disposed) return;
        dispose = createChipScene(canvas, { reducedMotion, onFirstFrame: () => setReady(true) }).dispose;
      })
      .catch(() => {
        /* keep the flat mark */
      });

    return () => {
      disposed = true;
      dispose?.();
    };
  }, []);

  return (
    <div className={cn("relative", className)}>
      <LogoMark
        className={cn(
          "absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 sm:size-24",
          ready && "opacity-0",
        )}
      />
      <canvas
        ref={canvasRef}
        aria-hidden
        className={cn(
          "absolute inset-0 size-full touch-pan-y transition-opacity duration-1000 ease-out",
          ready ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}

function supportsWebGL() {
  try {
    const probe = document.createElement("canvas");
    return Boolean(probe.getContext("webgl2") || probe.getContext("webgl"));
  } catch {
    return false;
  }
}
