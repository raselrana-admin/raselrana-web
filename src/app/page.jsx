import {
  Hero,
  AboutPreview,
  FocusAreas,
  ExperiencePreview,
  ProjectsPreview,
  AchievementsPreview,
  ContactCTA,
} from "@/components";

export const metadata = {
  title: "Rasel Rana — Manager (Technical), BTCL",
  description:
    "Personal site of Rasel Rana — telecommunications and electrical/electronic engineering, BTCL.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <FocusAreas />
      <ExperiencePreview />
      <ProjectsPreview />
      <AchievementsPreview />
      <ContactCTA />
    </>
  );
}
