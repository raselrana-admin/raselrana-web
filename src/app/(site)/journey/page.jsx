import JourneyView from "@/views/journey/JourneyView";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "My Journey | Rasel Rana",
  description:
    "The path from where I started to where I am — family, education, effort, and milestones along the way.",
  path: "/journey",
});

// The journey is edited from /admin and read from MongoDB on every request,
// so changes show up immediately.
export const dynamic = "force-dynamic";

export default function JourneyPage() {
  return <JourneyView />;
}
