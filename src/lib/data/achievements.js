// Starting content for the Achievements pages. The live content is stored in
// MongoDB and edited from /admin/achievements; this file is what "Import
// starter content" copies into the database, and what the public page falls
// back to while the database is empty or unreachable.
//
// PLACEHOLDER CONTENT: competition titles, placements, dates and organizers,
// the leadership roles, memberships and press outlets are real. Every
// description, every example.com link, and all judging and sports entries
// are sample text to be replaced from the admin panel.

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
    description:
      "Sample text. This is where the story of the competition goes: what the challenge asked for, how the team designed and tuned the robot in the weeks before, and how the final round played out on the day. Replace it with the real account.",
    links: [
      { type: "youtube", label: "Final round (sample)", url: "https://example.com/robolution-2016-video" },
      { type: "facebook", label: "Event photos (sample)", url: "https://example.com/robolution-2016-photos" },
      { type: "news", label: "Press report (sample)", url: "https://example.com/robolution-2016-news" },
    ],
  },
  {
    slug: "cybernauts-2016",
    title: "Cybernauts 2016",
    placement: "Champion",
    sortDate: "2016-10-28",
    displayDate: "28 October 2016",
    organizer: "NSU Computer and Engineering Club",
    description:
      "Sample text. Describe the event here: which segment the team entered, the hardest part of the track or task, and the moment that decided the result. A paragraph or two is enough. Replace it with the real account.",
    links: [
      { type: "youtube", label: "Winning run (sample)", url: "https://example.com/cybernauts-2016-video" },
      { type: "web", label: "Event page (sample)", url: "https://example.com/cybernauts-2016" },
    ],
  },
  {
    slug: "robo-droid-championship-2016",
    title: "Robo-Droid Championship '16",
    placement: "1st Runner-up",
    sortDate: "2016-05-05",
    displayDate: "5–6 May 2016",
    organizer: "IEEE RUET Student Branch",
    description:
      "Sample text. A short summary of the two-day championship goes here: the format, the team's run through the rounds, and what was learned from finishing second. Replace it with the real account.",
    links: [
      { type: "facebook", label: "Event album (sample)", url: "https://example.com/robo-droid-2016-photos" },
    ],
  },
  {
    slug: "global-robotics-challenge-2016",
    title: "Global Robotics Challenge 2016 (IARC Bangladesh Zonal)",
    placement: "2nd Runner-up",
    sortDate: "2016-01-01",
    displayDate: "2016",
    organizer: "Engineering Students Association of Bangladesh (ESAB)",
    description:
      "Sample text. Explain the zonal round here: how teams qualified, what the robot had to do, and how the team placed. Replace it with the real account.",
    links: [
      { type: "web", label: "Competition site (sample)", url: "https://example.com/grc-2016" },
    ],
  },
  {
    slug: "mecceeration-2015",
    title: "Mecceeration 2015",
    placement: "2nd Runner-up",
    sortDate: "2015-08-28",
    displayDate: "28 August 2015",
    organizer: "Dept. of ME & CHE, IUT",
    description:
      "Sample text. One of the team's earlier outings. Use this space for the challenge, the robot built for it, and the result. Replace it with the real account.",
    links: [],
  },
  {
    slug: "robotour-programming-contest-2015",
    title: "RoboTour & Programming Contest 2015",
    placement: "2nd Runner-up",
    sortDate: "2015-01-08",
    displayDate: "8–9 January 2015",
    organizer: "Dept. of EEE, RUET & IEEE RUET Student Branch",
    description:
      "Sample text. The first podium finish. Describe the contest, the team at the time, and what this result led to. Replace it with the real account.",
    links: [],
  },
];

export const leadership = [
  {
    role: "Ex-President",
    org: "DUET Robotics Club",
    period: "Session 2016–2017",
    description:
      "Sample text. Summarise what the club did during this term: workshops run, teams sent to competitions, and anything started that continued afterwards.",
  },
  {
    role: "Ex-Vice Chairman (Technical)",
    org: "IEEE DUET Student Branch",
    period: "Session 2016–2017",
    description:
      "Sample text. Describe the technical activities led for the student branch: seminars, training sessions and project support.",
  },
  {
    role: "Founder and team leader",
    org: "DUET Robo Express (DUET Runway-71)",
    period: "2014–2017",
    description:
      "Sample text. Tell how the team started, how it grew, and which competitions it entered under this name.",
  },
  {
    role: "Convener",
    org: "DUET TECHFEST 2017",
    period: "2017",
    description:
      "Sample text. Outline the festival: its segments, the number of participating institutions, and the convener's responsibilities.",
    links: [
      { type: "news", label: "News coverage", url: "https://goo.gl/gkCn6N" },
    ],
  },
  {
    role: "Ex-Campus Representative",
    org: "Bangladesh Science Society",
    period: "Session 2016–2017",
    description:
      "Sample text. Note the campus activities organised on behalf of the society.",
  },
];

/**
 * Judging & Mentoring. Events where you were invited as a judge/mentor.
 * Sample entries — replace with real events, or delete unused ones.
 */
export const judging = [
  {
    slug: "sample-national-robotics-fest-2024",
    title: "Sample National Robotics Fest 2024",
    role: "Judge",
    organizer: "Sample University Robotics Club",
    sortDate: "2024-03-15",
    displayDate: "15 March 2024",
    description:
      "Sample text. Say what the event was, which segment you judged, how many teams took part, and what you looked for when scoring.",
    links: [
      { type: "facebook", label: "Event page (sample)", url: "https://example.com/sample-robotics-fest-2024" },
    ],
  },
  {
    slug: "sample-inter-university-project-showcase-2023",
    title: "Sample Inter-University Project Showcase 2023",
    role: "Guest Judge",
    organizer: "Sample IEEE Student Branch",
    sortDate: "2023-11-10",
    displayDate: "10 November 2023",
    description:
      "Sample text. Describe the showcase and the projects reviewed, and add a line on the advice given to the participating teams.",
    links: [],
  },
  {
    slug: "sample-line-follower-workshop-2022",
    title: "Sample Line Follower Workshop 2022",
    role: "Mentor",
    organizer: "Sample Engineering College",
    sortDate: "2022-08-20",
    displayDate: "20 August 2022",
    description:
      "Sample text. Describe the workshop: who attended, what was taught, and what the students built by the end.",
    links: [],
  },
];

/**
 * Sports & Beyond. Kept out of the Competitions section so the robotics
 * record stays focused. Sample entries — replace or delete.
 */
export const sports = [
  {
    slug: "sample-inter-department-cricket-2021",
    title: "Sample Inter-Department Cricket Tournament 2021",
    result: "Champion",
    organizer: "Sample Sports Club",
    sortDate: "2021-12-05",
    displayDate: "December 2021",
    description:
      "Sample text. A brief description of the tournament and your team's run to the title.",
    links: [],
  },
  {
    slug: "sample-badminton-doubles-2020",
    title: "Sample Badminton Doubles Tournament 2020",
    result: "Runner-up",
    organizer: "Sample Officers' Club",
    sortDate: "2020-02-14",
    displayDate: "February 2020",
    description:
      "Sample text. Note the format of the tournament and how the final went.",
    links: [],
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
