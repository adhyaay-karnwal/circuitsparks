"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { primaryNav } from "@/lib/site";
import { Logo } from "./Logo";

/**
 * Fixed header. White over the home hero, ink once past it, with a
 * progressive backdrop blur underneath (cube.computer's bar).
 */
export function Header() {
  const pathname = usePathname();
  const [overHero, setOverHero] = useState(pathname === "/");
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);

  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const update = () => {
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      setOverHero(Boolean(hero && hero.getBoundingClientRect().bottom > 64));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const light = overHero && !menuOpen;

  return (
    <>
      <header className={cn("fixed inset-x-0 top-0 z-50 transition-colors duration-300", light ? "text-paper" : "text-ink")}>
        {/* Progressive blur ground */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-24",
            menuOpen && "hidden",
          )}
        >
          <i className="absolute inset-0 backdrop-blur-[2px] [mask-image:linear-gradient(#000_0%,#000_70%,transparent_100%)]" />
          <i className="absolute inset-0 backdrop-blur-[6px] [mask-image:linear-gradient(#000_0%,#000_45%,transparent_75%)]" />
          <i className="absolute inset-0 backdrop-blur-[14px] [mask-image:linear-gradient(#000_0%,#000_20%,transparent_50%)]" />
        </div>

        <div className="wrap relative flex h-header items-center justify-between">
          <Link href="/" aria-label="CircuitSparks home" className="transition-opacity hover:opacity-70">
            <Logo />
          </Link>
          <div className="flex items-center gap-6">
            <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="text-small transition-opacity hover:opacity-60"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <ButtonLink href="/register" size="sm" variant={light ? "light" : "ink"}>
              Register
            </ButtonLink>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="-mr-2 grid size-9 place-items-center md:hidden"
            >
              <span className="relative block h-2.5 w-[18px]">
                <span
                  className={cn(
                    "absolute left-0 h-[1.5px] w-full bg-current transition-transform duration-300",
                    menuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 h-[1.5px] w-full bg-current transition-transform duration-300",
                    menuOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" hidden={!menuOpen} className="fixed inset-0 z-40 bg-paper pt-header md:hidden">
        <nav aria-label="Mobile" className="wrap pt-6">
          <ul className="border-t border-ink">
            {[{ label: "Home", href: "/" }, ...primaryNav, { label: "Contact", href: "/contact" }].map((item) => (
              <li key={item.href} className="border-b border-hairline">
                <Link href={item.href} className="block py-4 text-sub">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
