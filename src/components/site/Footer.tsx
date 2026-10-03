import Link from "next/link";
import { footerNav, site } from "@/lib/site";

/** Four link columns under an ink rule, then the copyright line. */
export function Footer() {
  return (
    <footer className="wrap pb-12 text-micro">
      <div className="grid grid-cols-2 gap-x-8 gap-y-10 border-t border-ink pt-12 md:grid-cols-4">
        {footerNav.map((group) => (
          <div key={group.title}>
            <p className="font-medium">{group.title}</p>
            <ul className="mt-3 space-y-2 text-ink-soft">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-20 flex flex-col gap-1 text-ink-soft sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.legalName}. A 501(c)(3) nonprofit.
        </p>
        <a href={`mailto:${site.email}`} className="transition-colors hover:text-ink">
          {site.email}
        </a>
      </div>
    </footer>
  );
}
