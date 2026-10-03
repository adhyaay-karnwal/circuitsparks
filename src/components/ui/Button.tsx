import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "ink" | "light" | "plain";
type Size = "sm" | "lg";

const base =
  "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full font-medium leading-tight transition-colors duration-150";

const sizes: Record<Size, string> = {
  sm: "min-h-[34px] px-3.5 text-small",
  lg: "min-h-10 px-[1.15rem] text-[0.9375rem]",
};

const variants: Record<Variant, string> = {
  ink: "bg-ink text-paper hover:bg-ink-hover",
  light: "bg-paper text-ink hover:bg-sky-pale", // on the hero gradient
  plain: "bg-plate text-ink hover:bg-sky-pale", // secondary on white
};

export function buttonClasses(variant: Variant = "ink", size: Size = "lg", className?: string) {
  return cn(base, sizes[size], variants[variant], className);
}

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

/** Pill button as a link. `external` opens in a new tab. */
export function ButtonLink({
  href,
  external,
  variant,
  size,
  className,
  children,
}: Common & { href: string; external?: boolean }) {
  const classes = buttonClasses(variant, size, className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

export function Button({
  variant,
  size,
  className,
  children,
  ...rest
}: Common & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

/** Plain underlined-on-hover text link with a trailing arrow. */
export function TextLink({
  href,
  external,
  className,
  children,
}: {
  href: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const classes = cn(
    "inline-flex items-center gap-1 text-small font-medium underline-offset-4 hover:underline",
    className,
  );
  const arrow = <span aria-hidden>{external ? "↗" : "→"}</span>;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
        {arrow}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
      {arrow}
    </Link>
  );
}
