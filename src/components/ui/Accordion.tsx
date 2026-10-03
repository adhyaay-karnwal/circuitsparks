"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";

export type AccordionItem = { q: string; a: string };

/** Single-open list with hairline dividers. Height animates via grid rows. */
export function Accordion({ items, className }: { items: AccordionItem[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();

  return (
    <ul className={cn("border-t border-ink", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;
        return (
          <li key={item.q} className="border-b border-hairline">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left text-lede"
              >
                {item.q}
                <span aria-hidden className={cn("text-xl leading-none transition-transform duration-300", isOpen && "rotate-45")}>
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-[60ch] pb-6 text-small text-ink-soft">{item.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
