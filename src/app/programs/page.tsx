import type { Metadata } from "next";
import { Outro } from "@/components/site/Outro";
import { ButtonLink } from "@/components/ui/Button";
import { Chapter } from "@/components/ui/Chapter";
import { PageIntro } from "@/components/ui/PageIntro";
import { Shot, type GradientName } from "@/components/ui/Shot";
import { Steps } from "@/components/ui/Steps";
import { tiers } from "@/lib/content";
import { stagger } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Programs",
  description: "Three tiers of free, hands-on electronics workshops for middle schoolers: Spark, Current, and Signal.",
};

const frames: GradientName[] = ["tide", "horizon", "depth"];

export default function ProgramsPage() {
  return (
    <>
      <PageIntro title="Programs." lede="Three tiers of free, hands-on workshops. Each one builds on the last.">
        <ButtonLink href="/register">Register a student</ButtonLink>
      </PageIntro>

      {tiers.map((tier, i) => (
        <Chapter
          key={tier.id}
          id={tier.id}
          num={String(i + 1).padStart(2, "0")}
          title={
            <>
              {tier.name}.
              <br /> {tier.focus}.
            </>
          }
          lede={
            <>
              {tier.summary} <span className="text-ink-soft">{tier.prerequisite}.</span>
            </>
          }
        >
          <ul className="mb-10 grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-4">
            {tier.topics.map((topic, j) => (
              <li key={topic} data-reveal style={stagger(j)} className="border-t border-ink pt-3 text-small">
                {topic}
              </li>
            ))}
          </ul>
          <Shot gradient={frames[i]} label={`Photo: ${tier.name} workshop`} />
        </Chapter>
      ))}

      <Chapter num="04" title="Workshop format." lede="The same structure at every library and school.">
        <Steps
          numbered={false}
          items={[
            { title: "Free", body: "No cost to students, families, or host sites." },
            { title: "Hardware provided", body: "Every student gets their own kit to build with." },
            { title: "Small groups", body: "A trained high school mentor at every table." },
            { title: "Grades 6–8", body: "No experience needed to start at Spark." },
          ]}
        />
      </Chapter>

      <Outro />
    </>
  );
}
