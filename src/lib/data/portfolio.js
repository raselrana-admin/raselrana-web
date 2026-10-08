// lib/data/portfolio.js
// `portfolioPage` is the heading of the /portfolio page (always read from here).
//
// The rest is STARTER CONTENT for the Portfolio dashboard (/admin/portfolio),
// where the portfolio is written. It is sample text: after importing it in
// the dashboard, edit it there. Your name, role, organization and contact
// details at the top of the portfolio come from the public profile.

export const portfolioPage = {
  eyebrow: "Portfolio",
  heading: "Professional portfolio",
  intro:
    "A summary of my background, experience and work. Read it here or download it as a PDF.",
};

// Text blocks shown at the top, in order.
export const portfolioSummaries = [
  {
    heading: "Profile",
    text: "Sample text. Three or four sentences that introduce you: your field, how many years of experience you have, what you are responsible for now, and what kind of work you do best. Replace this with your own summary.",
  },
];

// Items grouped under their `section` name. Sections appear in the order
// they first occur here.
export const portfolioEntries = [
  {
    section: "Experience",
    title: "Manager (Technical)",
    subtitle: "Bangladesh Telecommunications Company Limited (BTCL)",
    period: "Sample: 20XX — Present",
    description:
      "Sample text. One or two sentences on the scope of the role.",
    points: [
      "Sample: a responsibility or result, starting with a verb",
      "Sample: another responsibility or result",
    ],
  },
  {
    section: "Experience",
    title: "Assistant Deputy Manager-Tech (Shift Engineer)",
    subtitle: "Summit Power Limited (SPL)",
    period: "April 2018 — October 2021",
    description:
      "Shift engineer in the operation department of engine-based power plants (157 MW, then 300 MW).",
    points: [
      "Sample: a responsibility or result, starting with a verb",
      "Sample: another responsibility or result",
    ],
  },
  {
    section: "Education",
    title: "B.Sc. in Electrical & Electronic Engineering",
    subtitle: "Sample University",
    period: "20XX — 20XX",
    description: "",
    points: [],
  },
  {
    section: "Skills",
    title: "Telecommunications",
    subtitle: "",
    period: "",
    description: "",
    points: ["Sample: Transmission networks", "Sample: Network monitoring"],
  },
  {
    section: "Skills",
    title: "Power & Electrical Systems",
    subtitle: "",
    period: "",
    description: "",
    points: ["Sample: Power plant operation", "Sample: Backup power systems"],
  },
  {
    section: "Achievements",
    title: "Champion, ROBOLUTION 2016",
    subtitle: "MIST Robotics Club",
    period: "2016",
    description: "",
    points: [],
  },
];
