import type { ReactNode } from "react";
import { stagger } from "@/lib/cn";

/** Opening of every inner page: large title in the body column, short lede beneath. */
export function PageIntro({ title, lede, children }: { title: ReactNode; lede?: ReactNode; children?: ReactNode }) {
  return (
    <section className="wrap grid pb-20 pt-[calc(var(--spacing-header)+5rem)] lg:grid-cols-[var(--spacing-rail)_minmax(0,1fr)] lg:gap-x-8 lg:pb-28 lg:pt-[calc(var(--spacing-header)+8rem)]">
      <div className="lg:col-start-2">
        <h1 className="enter text-display">{title}</h1>
        {lede ? (
          <p className="enter mt-8 max-w-[44ch] text-sub text-ink-soft" style={stagger(1)}>
            {lede}
          </p>
        ) : null}
        {children ? (
          <div className="enter mt-10 flex flex-wrap items-center gap-6" style={stagger(2)}>
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}
