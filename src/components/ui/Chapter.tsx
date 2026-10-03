import type { ReactNode } from "react";
import { cn, stagger } from "@/lib/cn";

/**
 * The core layout unit, after cube.computer: an ink rule, a number in the
 * left rail, a two-line title with a short lede beside it, then content.
 */
export function Chapter({
  id,
  num,
  title,
  lede,
  first = false,
  as: Heading = "h2",
  children,
  className,
}: {
  id?: string;
  num?: string;
  title: ReactNode;
  lede?: ReactNode;
  first?: boolean;
  as?: "h1" | "h2";
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "wrap grid scroll-mt-20 grid-cols-1 lg:grid-cols-[var(--spacing-rail)_minmax(0,1fr)] lg:gap-x-8",
        className,
      )}
    >
      {first ? null : <div aria-hidden className="col-span-full border-t border-ink" />}
      <div className="pt-7 lg:pb-[4.5rem] lg:pt-12">
        {num ? (
          <span data-reveal className="block text-num tabular-nums text-signal">
            {num}
          </span>
        ) : null}
      </div>
      <div className="pb-14 pt-5 lg:pb-[4.5rem] lg:pt-12">
        <header className="mb-7 grid gap-4 lg:mb-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-8">
          <Heading data-reveal className="text-title">
            {title}
          </Heading>
          {lede ? (
            <div data-reveal style={stagger(1)} className="max-w-[44ch] text-lede lg:mt-2">
              {lede}
            </div>
          ) : null}
        </header>
        {children}
      </div>
    </section>
  );
}
