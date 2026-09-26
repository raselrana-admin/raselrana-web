import {
  Hero,
  AboutPreview,
  FocusAreas,
  ExperiencePreview,
  ProjectsPreview,
  AchievementsPreview,
  ContactCTA,
  SignalWave,
} from "@/components";

export const metadata = {
  title: "Rasel Rana — Manager (Technical), BTCL",
  description:
    "Personal site of Rasel Rana — telecommunications and electrical/electronic engineering, BTCL.",
};

export default function HomePage() {
  return (
    <main className="bg-[var(--paper)]">
      <Hero />

      <div className="mx-auto max-w-5xl px-6">
        <SignalWave variant="divider" />
      </div>
      <AboutPreview />

      <div className="mx-auto max-w-5xl px-6">
        <SignalWave variant="divider" />
      </div>
      <FocusAreas />

      <div className="mx-auto max-w-5xl px-6">
        <SignalWave variant="divider" />
      </div>
      <ExperiencePreview />

      <div className="mx-auto max-w-5xl px-6">
        <SignalWave variant="divider" />
      </div>
      <ProjectsPreview />

      <div className="mx-auto max-w-5xl px-6">
        <SignalWave variant="divider" />
      </div>
      <AchievementsPreview />

      <ContactCTA />
    </main>
  );
}
