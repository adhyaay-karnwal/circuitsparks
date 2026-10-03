import type { CSSProperties } from "react";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Stagger index for `.enter*` and `[data-reveal]` animations. */
export function stagger(i: number): CSSProperties {
  return { "--i": i } as CSSProperties;
}
