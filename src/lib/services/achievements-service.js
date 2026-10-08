import { getEntries } from "@/lib/services/content-service";

/**
 * Achievements for the public pages, under the names the section
 * components use. Storage, fallback and sorting live in content-service.js.
 */
export async function getAchievementsData() {
  const entries = await getEntries("achievements");
  return {
    competitions: entries.competition,
    judging: entries.judging,
    sports: entries.sports,
    leadership: entries.leadership,
    press: entries.press,
    affiliations: entries.affiliation,
  };
}

/** Looks a slug up across every category that has a detail page. */
export function findAchievement(data, slug) {
  const comp = data.competitions.find((c) => c.slug === slug);
  if (comp) return { category: "competition", categoryLabel: "Competition", item: comp };

  const judge = data.judging.find((j) => j.slug === slug);
  if (judge) return { category: "judging", categoryLabel: "Judging & Mentoring", item: judge };

  const sport = data.sports.find((s) => s.slug === slug);
  if (sport) return { category: "sports", categoryLabel: "Sports & Beyond", item: sport };

  return null;
}
