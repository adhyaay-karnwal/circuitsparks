import type { Metadata } from "next";
import { Outro } from "@/components/site/Outro";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { Chapter } from "@/components/ui/Chapter";
import { Highlight } from "@/components/ui/Highlight";
import { PageIntro } from "@/components/ui/PageIntro";
import { Steps } from "@/components/ui/Steps";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Donate",
  description: "Fund the hardware that keeps CircuitSparks workshops free for every middle schooler.",
};

export default function DonatePage() {
  return (
    <>
      <PageIntro title="Support CircuitSparks." lede="Your gift puts real hardware in students' hands and keeps every workshop free.">
        <ButtonLink href={site.gofundmeUrl} external>
          Donate on GoFundMe
        </ButtonLink>
        <TextLink href="#sponsor">Sponsor hardware</TextLink>
      </PageIntro>

      <Chapter
        num="01"
        title="Where your gift goes."
        lede="We run lean and youth-led. Donations fund three things."
      >
        <Highlight value="$0" title="Cost to every student and family." className="mb-12" />
        <Steps
          items={[
            { title: "Hardware kits", body: "Breadboards, microcontrollers, and sensors for every student." },
            { title: "Workshop materials", body: "Guides, tools, and components for each session." },
            { title: "Mentor training", body: "Curriculum and preparation so every table is led well." },
          ]}
        />
      </Chapter>

      <Chapter
        id="sponsor"
        num="02"
        title="Sponsor hardware."
        lede="For companies and organizations. We'll report exactly what your support made possible."
      >
        <Steps
          numbered={false}
          items={[
            { title: "Kit sponsor", body: "Hardware for one workshop table." },
            { title: "Site sponsor", body: "A full workshop series at one library or school." },
            { title: "Program partner", body: "A full tier across multiple sites." },
          ]}
        />
        <div data-reveal className="mt-10 flex flex-wrap items-center gap-6">
          <ButtonLink href={`mailto:${site.sponsorshipEmail}`}>Email our team</ButtonLink>
          <TextLink href="/contact?topic=sponsor">Contact form</TextLink>
        </div>
      </Chapter>

      <Chapter num="03" title="Tax information.">
        <p data-reveal className="max-w-[60ch] text-lede text-ink-soft">
          CircuitSparks is a 501(c)(3) nonprofit. Donations are tax-deductible to the extent allowed by law. For our
          EIN or a receipt, email{" "}
          <a href={`mailto:${site.email}`} className="text-ink underline underline-offset-4">
            {site.email}
          </a>
          .
        </p>
      </Chapter>

      <Outro />
    </>
  );
}
