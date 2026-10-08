import {
  AchievementsCompetitions,
  AchievementsHero,
  AchievementsJudging,
  AchievementsLeadership,
  AchievementsPress,
  AchievementsSports,
} from "@/components";
import { getAchievementsData } from "@/lib/services/achievements-service";
import { getPageText } from "@/lib/services/page-text";

// Server Component — reads achievements from MongoDB at request time and
// hands plain data to the section components. Lives in views/ (not
// components/) because it touches the mongodb driver; see DownloadsView.
export default async function AchievementsView() {
  const [{ competitions, judging, sports, leadership, press, affiliations }, text] =
    await Promise.all([getAchievementsData(), getPageText("achievements")]);

  const featured = press.find((p) => p.featured) ?? press[0];

  return (
    <>
      <AchievementsHero text={text} featured={featured} />
      <AchievementsCompetitions competitions={competitions} press={press} />
      <AchievementsLeadership leadership={leadership} affiliations={affiliations} />
      <AchievementsPress press={press} competitions={competitions} />
      <AchievementsJudging judging={judging} />
      <AchievementsSports sports={sports} />
    </>
  );
}
