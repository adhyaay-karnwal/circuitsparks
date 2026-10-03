import type { Metadata } from "next";
import { SiteForm } from "@/components/forms/SiteForm";
import { ButtonLink } from "@/components/ui/Button";
import { Chapter } from "@/components/ui/Chapter";
import { PageIntro } from "@/components/ui/PageIntro";
import { Shot } from "@/components/ui/Shot";
import { Steps } from "@/components/ui/Steps";

export const metadata: Metadata = {
  title: "Become a mentor",
  description: "High school engineers: lead small groups of middle schoolers through hands-on hardware workshops.",
};

export default function MentorsPage() {
  return (
    <>
      <PageIntro
        title="Become a mentor."
        lede="For high school engineers who want to teach, lead, and build something that matters."
      >
        <ButtonLink href="#apply">Apply</ButtonLink>
      </PageIntro>

      <Chapter
        num="01"
        title={
          <>
            Teach what you know.
            <br /> Learn to lead.
          </>
        }
        lede="Mentors lead a table of middle schoolers through each build, explaining concepts and helping them debug."
      >
        <Shot gradient="depth" label="Photo: mentors at a Saturday workshop" position="50% 25%" />
      </Chapter>

      <Chapter num="02" title="How it works." lede="Every mentor is trained before leading a table.">
        <Steps
          items={[
            { title: "Apply", body: "Tell us what you've built and why you want to teach." },
            { title: "Train", body: "Learn the curriculum, safety, and how to teach it." },
            { title: "Shadow", body: "Support an experienced mentor in a live session." },
            { title: "Lead", body: "Run your own table, with support when you need it." },
          ]}
        />
      </Chapter>

      <Chapter
        id="apply"
        num="03"
        title="Apply."
        lede="Open to students in grades 9–12. Comfort with circuits or code helps, but training covers the rest."
      >
        <SiteForm kind="mentor" />
      </Chapter>

      <div className="pb-12" />
    </>
  );
}
