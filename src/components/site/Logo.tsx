import { cn } from "@/lib/cn";
import { LOGO_PATH, LOGO_VIEWBOX } from "./logo-path";

/** The CircuitSparks mark. Inherits color from `currentColor`. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox={LOGO_VIEWBOX} className={cn("shrink-0", className)} fill="currentColor">
      <path d={LOGO_PATH} />
    </svg>
  );
}

/** Mark + wordmark lockup. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className="size-[18px]" />
      <span className="text-[1.0625rem] font-semibold tracking-[-0.03em]">CircuitSparks</span>
    </span>
  );
}
