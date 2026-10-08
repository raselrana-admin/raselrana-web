import PageHeader from "@/components/ui/PageHeader";
import { experienceIntro } from "@/lib/data/experience";
import ExperienceView from "@/views/experience/ExperienceView";

export const metadata = {
  title: "Experience | Rasel Rana",
  description:
    "Career experience of Rasel Rana across telecommunications at BTCL and power generation at Summit Power Limited.",
};

// Roles are edited from /admin and read from MongoDB on every request, so
// changes show up immediately.
export const dynamic = "force-dynamic";

export default function ExperiencePage() {
  return (
    <>
      <PageHeader
        eyebrow={experienceIntro.eyebrow}
        heading={experienceIntro.heading}
        intro={experienceIntro.summary}
      />
      <ExperienceView />
    </>
  );
}
