import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { stagger } from "@/lib/cn";

/** Closing statement above the footer (cube.computer's outro). */
export function Outro({
  title = (
    <>
      Every engineer
      <br /> starts with a spark.
    </>
  ),
}: {
  title?: ReactNode;
}) {
  return (
    <section className="wrap pb-24">
      <div className="grid border-t-2 border-ink pt-12 lg:grid-cols-[var(--spacing-rail)_minmax(0,1fr)] lg:gap-x-8 lg:pt-14">
        <div className="lg:col-start-2">
          <h2 data-reveal className="text-outro">
            {title}
          </h2>
          <div data-reveal style={stagger(1)} className="mt-12 flex flex-wrap items-center gap-3">
            <ButtonLink href="/register">Register a student</ButtonLink>
            <ButtonLink href="/donate" variant="plain">
              Donate
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
