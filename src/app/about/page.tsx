import type { Metadata } from "next";
import { Outro } from "@/components/site/Outro";
import { Chapter } from "@/components/ui/Chapter";
import { PageIntro } from "@/components/ui/PageIntro";
import { Shot } from "@/components/ui/Shot";
import { Steps } from "@/components/ui/Steps";
import { stagger } from "@/lib/cn";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "CircuitSparks is a student-founded, youth-led 501(c)(3) closing the access gap in hands-on STEM education.",
};

const documents = [
  { name: "Annual report", status: "After each program year" },
  { name: "Financial summary", status: "With the annual report" },
  { name: "IRS determination letter", status: "On request" },
  { name: "Form 990", status: "On request once filed" },
];

// TODO: replace with the founding team's names and portraits.
const team = ["Founder & Executive Director", "Chief Technology Officer", "Director of Curriculum", "Director of Mentorship"];

export default function AboutPage() {
  return (
    <>
      <PageIntro
        title="About."
        lede="A student-founded, youth-led 501(c)(3) closing the access gap in hands-on STEM education."
      />

      <Chapter
        num="01"
        title={
          <>
            Built by students.
            <br /> For the students after us.
          </>
        }
        lede="Inspired by peer-mentoring programs like Pathways for Exceptional Children, we pair real hardware with student-to-student teaching, free at local libraries and middle schools."
      >
        <Shot gradient="horizon" label="Photo: the founding team" />
      </Chapter>

      <Chapter id="governance" num="02" title="How we're organized." lede="Youth-led, with real oversight.">
        <Steps
          items={[
            { title: "Board of directors", body: "Oversees budgets, reporting, and safety." },
            { title: "Student leadership", body: "Runs programs, curriculum, and mentor training." },
            { title: "Advisors", body: "Educators and engineers who review the curriculum." },
          ]}
        />
      </Chapter>

      <Chapter id="transparency" num="03" title="Transparency." lede={<>Reports are posted here as they&rsquo;re completed. Anything else is available by email.</>}>
        <ul className="border-t border-ink">
          {documents.map((doc, i) => (
            <li
              key={doc.name}
              data-reveal
              style={stagger(i)}
              className="flex items-baseline justify-between gap-6 border-b border-hairline py-4 text-small"
            >
              <span className="font-medium">{doc.name}</span>
              <span className="text-ink-soft">{doc.status}</span>
            </li>
          ))}
        </ul>
        <p data-reveal className="mt-6 text-small">
          <a href={`mailto:${site.email}`} className="font-medium underline-offset-4 hover:underline">
            Request a document →
          </a>
        </p>
      </Chapter>

      <Chapter num="04" title="Team.">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {team.map((role, i) => (
            <li key={role} data-reveal style={stagger(i)}>
              <div role="img" aria-label="Placeholder: portrait" className="aspect-[4/5] rounded-frame bg-ink" />
              <p className="mt-4 text-[0.9375rem] font-medium">Name Surname</p>
              <p className="mt-0.5 text-small text-ink-soft">{role}</p>
            </li>
          ))}
        </ul>
      </Chapter>

      <Outro />
    </>
  );
}
