import {
  AchievementsCompetitions,
  AchievementsHero,
  AchievementsLeadership,
  AchievementsPress,
} from "@/components";

export default function AchievementsPage() {
  return (
    <>
      <AchievementsHero />
      <AchievementsCompetitions />
      <AchievementsLeadership />
      <AchievementsPress />
    </>
  );
}
