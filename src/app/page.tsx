import Image from "next/image";
import { Outro } from "@/components/site/Outro";
import { HeroChip } from "@/components/hero/HeroChip";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { Chapter } from "@/components/ui/Chapter";
import { Highlight } from "@/components/ui/Highlight";
import { gradients, Shot } from "@/components/ui/Shot";
import { Steps } from "@/components/ui/Steps";
import { faqs, tiers } from "@/lib/content";
import { stagger } from "@/lib/cn";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section data-hero className="relative isolate flex h-svh min-h-[560px] flex-col items-center justify-center text-paper">
        <Image
          src={gradients.depth}
          alt=""
          fill
          priority
          placeholder="blur"
          quality={90}
          sizes="100vw"
          className="-z-10 object-cover"
          style={{ objectPosition: "50% 30%" }}
        />
        <div className="flex flex-col items-center gap-4 px-8 pt-10 text-center">
          <HeroChip className="enter -mb-2 h-[clamp(220px,34vh,340px)] w-[min(92vw,560px)]" />
          <h1 className="enter text-hero" style={stagger(1)}>
            CircuitSparks
          </h1>
          <p className="enter max-w-[36ch] text-sub font-medium" style={stagger(2)}>
            Free, hands&#8209;on engineering for middle schoolers.
          </p>
          <div className="enter mt-4" style={stagger(3)}>
            <ButtonLink href="/register" variant="light">
              Register a student
            </ButtonLink>
          </div>
        </div>
      </section>

      <div id="start" className="pt-6">
        <Chapter
          first
          num="01"
          title={
            <>
              Real hardware.
              <br /> In every student&rsquo;s hands.
            </>
          }
          lede="Every student builds with their own breadboard, microcontroller, and sensors. Workshops run at local libraries and middle schools."
        >
          <Shot gradient="tide" label="Photo: a student wiring a breadboard" position="50% 40%" />
        </Chapter>

        <Chapter
          num="02"
          title={
            <>
              Taught by high schoolers.
              <br /> A mentor at every table.
            </>
          }
          lede="Trained high school engineers lead small groups, so help is always an arm's length away."
        >
          <Shot gradient="horizon" label="Photo: a mentor guiding a small group" />
        </Chapter>

        <Chapter
          id="programs"
          num="03"
          title={
            <>
              Three tiers.
              <br /> One clear path.
            </>
          }
          lede={
            <>
              Each tier builds on the last, from a first circuit to a programmed, sensor-driven system.{" "}
              <TextLink href="/programs">See the curriculum</TextLink>
            </>
          }
        >
          <div className="grid gap-x-6 gap-y-12 md:grid-cols-3">
            {tiers.map((tier, i) => (
              <div key={tier.id} data-reveal style={stagger(i)} className="flex flex-col border-t border-ink pt-4">
                <h3 className="text-[0.9375rem] font-medium">
                  {tier.name} <span className="text-ink-soft">· {tier.focus}</span>
                </h3>
                <p className="mb-6 mt-2 text-small text-ink-soft">{tier.summary}</p>
                <Shot
                  gradient={(["tide", "horizon", "depth"] as const)[i]}
                  layout="center"
                  ratio="1/1"
                  label={`${tier.name} build`}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="mt-auto"
                />
              </div>
            ))}
          </div>
        </Chapter>

        <Chapter
          num="04"
          title={
            <>
              Free for every family.
              <br /> Funded by our community.
            </>
          }
          lede="Donations buy the hardware students build with. Companies can sponsor a kit, a site, or a full tier."
        >
          <Highlight
            value="$0"
            title="Cost to every student and family."
            body="Hardware, materials, and instruction are covered by donors and sponsors."
          />
          <div data-reveal className="mt-8 flex flex-wrap items-center gap-6">
            <ButtonLink href={site.gofundmeUrl} external>
              Donate on GoFundMe
            </ButtonLink>
            <TextLink href="/donate#sponsor">Sponsor hardware</TextLink>
          </div>
        </Chapter>

        <Chapter num="05" title="Get involved." lede="Three ways in, depending on who you are.">
          <Steps
            items={[
              {
                title: "Register a student",
                body: "Join the list for upcoming workshops near you. Grades 6–8.",
                href: "/register",
                cta: "Register",
              },
              {
                title: "Become a mentor",
                body: "High schoolers: lead a table and build real teaching experience.",
                href: "/mentors",
                cta: "Apply",
              },
              {
                title: "Host a workshop",
                body: "Libraries and schools: we bring the hardware and the mentors.",
                href: "/contact?topic=host",
                cta: "Get in touch",
              },
            ]}
          />
        </Chapter>

        <Chapter num="06" title="Questions.">
          <Accordion items={faqs} />
        </Chapter>
      </div>

      <Outro />
    </>
  );
}
