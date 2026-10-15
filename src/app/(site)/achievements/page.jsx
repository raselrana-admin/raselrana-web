import AchievementsView from "@/views/achievements/AchievementsView";
import { pageMetadata } from "@/lib/seo";

// Achievements are edited from /admin and read from MongoDB on every
// request, so changes show up immediately — opt out of static rendering.
export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Achievements | Rasel Rana",
  description:
    "Robotics competition results, leadership roles, judging and press coverage of Rasel Rana.",
  path: "/achievements",
});

export default function AchievementsPage() {
  return <AchievementsView />;
}
