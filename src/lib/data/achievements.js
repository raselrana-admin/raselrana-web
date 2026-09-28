export const achievementsHero = {
  heading: "Achievements",
  intro:
    "Robotics competition wins, team leadership and press coverage from my years at DUET.",
};

/**
 * Competitions. Add new ones here; the page groups and sorts them for you.
 * - sortDate: ISO date used for ordering (use the first day of the event)
 * - displayDate: what visitors see
 * - description: optional, shown on the detail page (/achievements/[slug])
 * - links: optional list of { type, label, url } shown on the detail page.
 *   type is "youtube", "facebook", "web" or "news". Example:
 *     { type: "youtube", label: "Final run", url: "https://youtu.be/..." }
 *   Empty or "#" urls are hidden, so delete a link or leave a placeholder freely.
 */
export const competitions = [
  {
    slug: "robolution-2016",
    title: "ROBOLUTION 2016",
    placement: "Champion",
    sortDate: "2016-04-30",
    displayDate: "30 April 2016",
    organizer: "MIST Robotics Club",
    description: "",
    links: [],
  },
  {
    slug: "cybernauts-2016",
    title: "Cybernauts 2016",
    placement: "Champion",
    sortDate: "2016-10-28",
    displayDate: "28 October 2016",
    organizer: "NSU Computer and Engineering Club",
    description: "",
    links: [],
  },
  {
    slug: "robo-droid-championship-2016",
    title: "Robo-Droid Championship '16",
    placement: "1st Runner-up",
    sortDate: "2016-05-05",
    displayDate: "5–6 May 2016",
    organizer: "IEEE RUET Student Branch",
    description: "",
    links: [],
  },
  {
    slug: "global-robotics-challenge-2016",
    title: "Global Robotics Challenge 2016 (IARC Bangladesh Zonal)",
    placement: "2nd Runner-up",
    sortDate: "2016-01-01",
    displayDate: "2016",
    organizer: "Engineering Students Association of Bangladesh (ESAB)",
    description: "",
    links: [],
  },
  {
    slug: "mecceeration-2015",
    title: "Mecceeration 2015",
    placement: "2nd Runner-up",
    sortDate: "2015-08-28",
    displayDate: "28 August 2015",
    organizer: "Dept. of ME & CHE, IUT",
    description: "",
    links: [],
  },
  {
    slug: "robotour-programming-contest-2015",
    title: "RoboTour & Programming Contest 2015",
    placement: "2nd Runner-up",
    sortDate: "2015-01-08",
    displayDate: "8–9 January 2015",
    organizer: "Dept. of EEE, RUET & IEEE RUET Student Branch",
    description: "",
    links: [],
  },
];

export const leadership = [
  {
    role: "Ex-President",
    org: "DUET Robotics Club",
    period: "Session 2016–2017",
  },
  {
    role: "Ex-Vice Chairman (Technical)",
    org: "IEEE DUET Student Branch",
    period: "Session 2016–2017",
  },
  {
    role: "Founder and team leader",
    org: "DUET Robo Express (DUET Runway-71)",
    period: "2014–2017",
  },
  {
    role: "Convener",
    org: "DUET TECHFEST 2017",
    period: "2017",
    links: [
      { type: "news", label: "News coverage", url: "https://goo.gl/gkCn6N" },
    ],
  },
  {
    role: "Ex-Campus Representative",
    org: "Bangladesh Science Society",
    period: "Session 2016–2017",
  },
];

export const affiliations = [
  { org: "IEEE", status: "Member" },
  { org: "Institution of Engineers, Bangladesh (IEB)", status: "Student member" },
];

/**
 * Press. `competition` links a clipping to a competition slug.
 * TODO: replace each headline with the real one from the newspaper, and
 * swap the goo.gl short links for the full URLs (goo.gl links may not resolve).
 */
export const press = [
  {
    outlet: "Daily Ittefaq",
    date: "25 May 2016",
    headline: "Coverage of the ROBOLUTION 2016 championship win",
    url: "https://goo.gl/UppZZe",
    competition: "robolution-2016",
    featured: true,
  },
  {
    outlet: "Daily Kaler Kantha",
    date: "20 December 2016",
    headline: "Coverage of the Cybernauts 2016 championship win",
    url: "https://goo.gl/EBMKVt",
    competition: "cybernauts-2016",
  },
  {
    outlet: "News coverage",
    date: "2017",
    headline: "Coverage of DUET TECHFEST 2017",
    url: "https://goo.gl/gkCn6N",
  },
];

export function getCompetition(slug) {
  return competitions.find((c) => c.slug === slug);
}

export function getPressForCompetition(slug) {
  return press.find((p) => p.competition === slug);
}

export function getFeaturedPress() {
  return press.find((p) => p.featured) ?? press[0];
}
