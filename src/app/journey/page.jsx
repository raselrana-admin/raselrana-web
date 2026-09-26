import JourneyHero from "@/components/sections/journey/JourneyHero";
import JourneyTimeline from "@/components/sections/journey/JourneyTimeline";

export const metadata = {
  title: "My Journey | Rasel Rana",
  description:
    "The path from where I started to where I am — family, education, effort, and milestones along the way.",
};

export default function JourneyPage() {
  return (
    <main>
      <JourneyHero />
      <JourneyTimeline />
    </main>
  );
}
