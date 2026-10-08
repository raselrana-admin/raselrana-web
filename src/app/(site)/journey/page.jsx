import JourneyView from "@/views/journey/JourneyView";

export const metadata = {
  title: "My Journey | Rasel Rana",
  description:
    "The path from where I started to where I am — family, education, effort, and milestones along the way.",
};

// The journey is edited from /admin and read from MongoDB on every request,
// so changes show up immediately.
export const dynamic = "force-dynamic";

export default function JourneyPage() {
  return <JourneyView />;
}
