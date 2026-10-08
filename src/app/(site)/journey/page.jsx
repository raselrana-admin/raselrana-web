import JourneyTimeline from "@/components/sections/journey/JourneyTimeline";
import PageHeader from "@/components/ui/PageHeader";

export const metadata = {
  title: "My Journey | Rasel Rana",
  description:
    "The path from where I started to where I am — family, education, effort, and milestones along the way.",
};

export default function JourneyPage() {
  return (
    <>
      <PageHeader
        eyebrow="My journey"
        heading="From where I started to where I am"
        intro="The people, places, and effort that shaped the path."
      />
      <JourneyTimeline />
    </>
  );
}
