// The cards in the home page's "Recognition" section, built from the
// achievements entries ticked "Show on the home page" in the dashboard.
// Plain data in, plain data out; views/home/HomeView.jsx reads the entries.

const MAX_CARDS = 6;

// Card text and link for each type that can be shown, in the order they appear
const CARD_TYPES = {
  competition: (c) => ({
    badge: c.placement,
    meta: c.displayDate,
    title: c.title,
    description: `Organized by ${c.organizer}`,
    href: `/achievements/${c.slug}`,
  }),
  judging: (j) => ({
    badge: j.role,
    meta: j.displayDate,
    title: j.title,
    description: `Organized by ${j.organizer}`,
    href: `/achievements/${j.slug}`,
  }),
  sports: (s) => ({
    badge: s.result,
    meta: s.displayDate,
    title: s.title,
    description: `Organized by ${s.organizer}`,
    href: `/achievements/${s.slug}`,
  }),
  leadership: (l) => ({
    badge: "Leadership",
    meta: l.period,
    title: l.role,
    description: l.org,
    href: "/achievements#leadership",
    linkLabel: "View on Achievements →",
  }),
  press: (p) => ({
    badge: "Press",
    meta: p.date,
    title: p.headline,
    description: p.outlet,
    href: p.url,
    linkLabel: "Read article ↗",
    external: true,
  }),
};

/**
 * `achievements` is getEntries("achievements"): entries grouped by type, each
 * group in its Achievements-page order. Returns the ticked entries (up to 6),
 * or the first 3 competitions when nothing is ticked.
 */
export function homeAchievementCards(achievements) {
  const ticked = Object.entries(CARD_TYPES).flatMap(([type, toCard]) =>
    (achievements[type] || [])
      .filter((item) => item.showOnHome)
      .map((item) => ({ id: item.id, ...toCard(item) })),
  );
  if (ticked.length > 0) return ticked.slice(0, MAX_CARDS);

  return (achievements.competition || [])
    .slice(0, 3)
    .map((item) => ({ id: item.id, ...CARD_TYPES.competition(item) }));
}
