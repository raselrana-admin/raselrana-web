import ExperienceSkills from "@/components/sections/experience/ExperienceSkills";
import ExperienceTimeline from "@/components/sections/experience/ExperienceTimeline";
import PageHeader from "@/components/ui/PageHeader";
import { experienceIntro } from "@/lib/data/experience";

export const metadata = {
  title: "Experience | Rasel Rana",
  description:
    "Career experience of Rasel Rana across telecommunications at BTCL and power generation at Summit Power Limited.",
};

export default function ExperiencePage() {
  return (
    <>
      <PageHeader
        eyebrow={experienceIntro.eyebrow}
        heading={experienceIntro.heading}
        intro={experienceIntro.summary}
      />
      <ExperienceTimeline />
      <ExperienceSkills />
    </>
  );
}
