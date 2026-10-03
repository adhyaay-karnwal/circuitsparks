import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Accent callout with a signal bar, after cube.computer's "$25 free credit" card. */
export function Highlight({
  value,
  title,
  body,
  className,
}: {
  value: string;
  title: ReactNode;
  body?: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-reveal
      className={cn(
        "flex flex-col gap-4 border-l-[3px] border-signal bg-sky-pale px-6 py-7 sm:flex-row sm:items-center sm:gap-6 sm:px-5",
        className,
      )}
    >
      <span className="text-[clamp(3.5rem,6vw,4.5rem)] leading-none tracking-[-0.04em] text-signal">{value}</span>
      <span>
        <span className="block text-sub">{title}</span>
        {body ? <span className="mt-1.5 block text-small text-ink-soft">{body}</span> : null}
      </span>
    </div>
  );
}
