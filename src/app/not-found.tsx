import { ButtonLink } from "@/components/ui/Button";
import { PageIntro } from "@/components/ui/PageIntro";

export default function NotFound() {
  return (
    <div className="min-h-[70vh]">
      <PageIntro title="Page not found." lede="This circuit is open. The page you're looking for doesn't exist.">
        <ButtonLink href="/">Back to home</ButtonLink>
      </PageIntro>
    </div>
  );
}
