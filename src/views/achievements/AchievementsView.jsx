import {
  AchievementsCompetitions,
  AchievementsHero,
  AchievementsJudging,
  AchievementsLeadership,
  AchievementsPress,
  AchievementsSports,
} from "@/components";
import { getAchievementsData } from "@/lib/services/achievements-service";

// Server Component — reads achievements from MongoDB at request time and
// hands plain data to the section components. Lives in views/ (not
// components/) because it touches the mongodb driver; see DownloadsView.
export default async function AchievementsView() {
  const { competitions, judging, sports, leadership, press, affiliations } =
    await getAchievementsData();

  const featured = press.find((p) => p.featured) ?? press[0];

  return (
    <>
      <AchievementsHero featured={featured} />
      <AchievementsCompetitions competitions={competitions} press={press} />
      <AchievementsLeadership leadership={leadership} affiliations={affiliations} />
      <AchievementsPress press={press} competitions={competitions} />
      <AchievementsJudging judging={judging} />
      <AchievementsSports sports={sports} />
    </>
  );
}
