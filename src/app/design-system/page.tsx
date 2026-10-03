import type { Metadata } from "next";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { Chapter } from "@/components/ui/Chapter";
import { Highlight } from "@/components/ui/Highlight";
import { PageIntro } from "@/components/ui/PageIntro";
import { Shot } from "@/components/ui/Shot";
import { Steps } from "@/components/ui/Steps";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const colors = [
  { name: "Paper", token: "paper", hex: "#FFFFFF", use: "Page background", className: "bg-paper border border-hairline" },
  { name: "Plate", token: "plate", hex: "#F3F4F5", use: "Quiet surfaces", className: "bg-plate" },
  { name: "Ink", token: "ink", hex: "#15181A", use: "Text, rules, buttons", className: "bg-ink" },
  { name: "Ink soft", token: "ink-soft", hex: "#5C6366", use: "Secondary text", className: "bg-ink-soft" },
  { name: "Sky", token: "sky", hex: "#B6DBE1", use: "Brand accent: icon, selection", className: "bg-sky" },
  { name: "Sky pale", token: "sky-pale", hex: "#EAF4F6", use: "Highlight surface", className: "bg-sky-pale" },
  { name: "Signal", token: "signal", hex: "#35808D", use: "Numbers, accent text", className: "bg-signal" },
];

const type = [
  { token: "text-display", sample: "Programs." },
  { token: "text-title", sample: "Real hardware. In every student's hands." },
  { token: "text-sub", sample: "Free, hands-on engineering for middle schoolers." },
  { token: "text-lede", sample: "Every student builds with their own breadboard, microcontroller, and sensors." },
  { token: "text-small", sample: "Labels, links, step text." },
];

export default function DesignSystemPage() {
  return (
    <>
      <PageIntro
        title="Design system."
        lede="White paper, ink rules, one accent. Every page is built from the parts below."
      />

      <Chapter num="01" title="Color.">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {colors.map((c) => (
            <div key={c.token}>
              <div className={cn("aspect-[4/3] rounded-frame", c.className)} />
              <p className="mt-3 text-small font-medium">
                {c.name} <span className="font-normal text-ink-soft">{c.hex}</span>
              </p>
              <p className="text-micro text-ink-soft">
                <code>{c.token}</code> · {c.use}
              </p>
            </div>
          ))}
        </div>
      </Chapter>

      <Chapter num="02" title="Type." lede="Inter. Regular weight for headings, tight tracking, nothing bold.">
        <ul className="space-y-8">
          {type.map((t) => (
            <li key={t.token} className="grid gap-2 border-t border-hairline pt-4 md:grid-cols-[10rem_1fr]">
              <code className="text-micro text-ink-soft">{t.token}</code>
              <p className={t.token}>{t.sample}</p>
            </li>
          ))}
        </ul>
      </Chapter>

      <Chapter num="03" title="Chapter." lede="Ink rule, number in the rail, two-line title, short lede, then content. The unit every page is built from." />

      <Chapter num="04" title="Shots." lede="Gradient frames from the Odyssey boards holding a visual. Black boxes mark where photography goes.">
        <Shot gradient="tide" label="layout: bleed" />
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Shot gradient="tide" layout="center" ratio="1/1" label="tide" sizes="33vw" />
          <Shot gradient="horizon" layout="center" ratio="1/1" label="horizon" sizes="33vw" />
          <Shot gradient="depth" layout="center" ratio="1/1" label="depth" sizes="33vw" />
        </div>
      </Chapter>

      <Chapter num="05" title="Components.">
        <div className="space-y-12">
          <div className="flex flex-wrap items-center gap-4">
            <ButtonLink href="#">Primary</ButtonLink>
            <ButtonLink href="#" variant="plain">
              Secondary
            </ButtonLink>
            <ButtonLink href="#" size="sm">
              Small
            </ButtonLink>
            <TextLink href="#">Text link</TextLink>
            <span className="rounded-full bg-ink p-2">
              <ButtonLink href="#" variant="light" size="sm">
                On gradient
              </ButtonLink>
            </span>
          </div>
          <Highlight value="$0" title="Highlight." body="One per page at most." />
          <Steps
            items={[
              { title: "Steps", body: "Numbered columns under an ink rule." },
              { title: "Unnumbered", body: "Pass numbered={false} for fact grids." },
              { title: "Links", body: "Optional call to action.", href: "#", cta: "Like this" },
            ]}
          />
          <Accordion items={[{ q: "Accordion", a: "Hairline rows. One open at a time." }]} />
        </div>
      </Chapter>

      <Chapter num="06" title="Rules." lede="No shadows. No gradients on UI, only inside shots and the hero. Motion: content fades up 16px once, nothing loops." />
      <div className="pb-12" />
    </>
  );
}
