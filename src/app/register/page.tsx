import type { Metadata } from "next";
import { SiteForm } from "@/components/forms/SiteForm";
import { Chapter } from "@/components/ui/Chapter";
import { PageIntro } from "@/components/ui/PageIntro";

export const metadata: Metadata = {
  title: "Register a student",
  description: "Register a middle schooler for free, hands-on CircuitSparks electronics workshops.",
};

export default function RegisterPage() {
  return (
    <>
      <PageIntro
        title="Register a student."
        lede="Free workshops for grades 6–8. We'll email dates and locations when the next series opens near you."
      />
      <Chapter num="01" title="Student details." lede="Takes about a minute. No experience needed.">
        <SiteForm kind="register" />
      </Chapter>
      <div className="pb-12" />
    </>
  );
}
