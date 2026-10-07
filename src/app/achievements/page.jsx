import AchievementsView from "@/views/achievements/AchievementsView";

// Achievements are edited from /admin and read from MongoDB on every
// request, so changes show up immediately — opt out of static rendering.
export const dynamic = "force-dynamic";

export default function AchievementsPage() {
  return <AchievementsView />;
}
