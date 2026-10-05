import {
  AchievementsCompetitions,
  AchievementsHero,
  AchievementsJudging,
  AchievementsLeadership,
  AchievementsPress,
  AchievementsSports,
} from "@/components";

export default function AchievementsPage() {
  return (
    <>
      <AchievementsHero />
      <AchievementsCompetitions />
      <AchievementsLeadership />
      <AchievementsPress />
      <AchievementsJudging />
      <AchievementsSports />
    </>
  );
}
