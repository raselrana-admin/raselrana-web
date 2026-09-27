import ExperienceHero from "@/components/sections/experience/ExperienceHero";
import ExperienceTimeline from "@/components/sections/experience/ExperienceTimeline";
import ExperienceSkills from "@/components/sections/experience/ExperienceSkills";

export const metadata = {
  title: "Experience | Rasel Rana",
  description:
    "Career experience at Bangladesh Telecommunications Company Limited (BTCL) — technical operations, facilities management, and administrative leadership.",
};

export default function ExperiencePage() {
  return (
    <main>
      <ExperienceHero />
      <ExperienceTimeline />
      <ExperienceSkills />
    </main>
  );
}
