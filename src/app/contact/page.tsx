import type { Metadata } from "next";
import { SiteForm } from "@/components/forms/SiteForm";
import { Chapter } from "@/components/ui/Chapter";
import { PageIntro } from "@/components/ui/PageIntro";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach CircuitSparks about workshops, hosting a series, hardware sponsorship, or press.",
};

const topics: Record<string, string> = {
  host: "Host a workshop",
  sponsor: "Hardware sponsorship",
  donate: "Donations",
  press: "Press",
};

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const { topic } = await searchParams;
  const preset = typeof topic === "string" ? topics[topic] : undefined;

  return (
    <>
      <PageIntro title="Contact." lede="Hosting a workshop, sponsoring hardware, or just curious? We reply by email." />
      <Chapter
        num="01"
        title="Send a message."
        lede={
          <>
            Or email{" "}
            <a href={`mailto:${site.email}`} className="underline underline-offset-4">
              {site.email}
            </a>
            . For sponsorship,{" "}
            <a href={`mailto:${site.sponsorshipEmail}`} className="underline underline-offset-4">
              {site.sponsorshipEmail}
            </a>
            .
          </>
        }
      >
        <SiteForm kind="contact" defaults={preset ? { topic: preset } : undefined} />
      </Chapter>
      <div className="pb-12" />
    </>
  );
}
