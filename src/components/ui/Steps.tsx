import Link from "next/link";
import type { ReactNode } from "react";
import { cn, stagger } from "@/lib/cn";

export type StepItem = { title: string; body: ReactNode; href?: string; cta?: string };

/** Numbered columns under an ink rule (cube.computer "Set up your Cube"). */
export function Steps({
  items,
  numbered = true,
  className,
}: {
  items: StepItem[];
  /** Unnumbered steps work as a simple fact grid. */
  numbered?: boolean;
  className?: string;
}) {
  return (
    <ol
      className={cn(
        "grid gap-x-8 gap-y-10 sm:grid-cols-2",
        items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
        className,
      )}
    >
      {items.map((item, i) => (
        <li key={item.title} data-reveal style={stagger(i)} className="border-t border-ink pt-5">
          {numbered ? <span className="mb-6 block text-step tabular-nums">{String(i + 1).padStart(2, "0")}</span> : null}
          <h3 className="text-[0.9375rem] font-medium">{item.title}</h3>
          <div className="mt-2 max-w-[34ch] text-small text-ink-soft">{item.body}</div>
          {item.href ? (
            <Link href={item.href} className="mt-4 inline-block text-small font-medium underline-offset-4 hover:underline">
              {item.cta ?? "Learn more"} →
            </Link>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
