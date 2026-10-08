import { aboutCTA, aboutFocus, aboutHero, aboutHighlights, aboutStory } from "@/lib/data/about";
import { achievementsHero } from "@/lib/data/achievements";
import { contactChannels, contactPage } from "@/lib/data/contact";
import { educationPage } from "@/lib/data/education";
import { experienceIntro } from "@/lib/data/experience";
import { journeyPage } from "@/lib/data/journey";
import { portfolioPage } from "@/lib/data/portfolio";
import { projectsPage } from "@/lib/data/projects";
import { publicationsPage } from "@/lib/data/publications";
import { skillsPage } from "@/lib/data/skills";

// The page text each page starts with (taken from the lib/data files). Used
// until a page's text is first saved in the dashboard, and whenever Mongo is
// unreachable. Keys must match PAGE_TEXT in lib/content/page-text.js.
// Server side only: it pulls in every data file.
export const PAGE_DEFAULTS = {
  about: {
    eyebrow: aboutHero.eyebrow,
    heading: aboutHero.headline,
    intro: aboutHero.intro,
    storyHeading: aboutStory.heading,
    storyText: aboutStory.paragraphs.join("\n\n"),
    focusHeading: aboutFocus.heading,
    highlightsHeading: aboutHighlights.heading,
    ctaHeading: aboutCTA.heading,
    ctaDescription: aboutCTA.description,
  },
  journey: journeyPage,
  experience: {
    eyebrow: experienceIntro.eyebrow,
    heading: experienceIntro.heading,
    intro: experienceIntro.summary,
  },
  achievements: {
    eyebrow: "Recognition",
    heading: achievementsHero.heading,
    intro: achievementsHero.intro,
  },
  projects: projectsPage,
  skills: skillsPage,
  education: educationPage,
  publications: publicationsPage,
  portfolio: portfolioPage,
  downloads: {
    eyebrow: "Downloads",
    heading: "Portfolio & documents",
    intro:
      "Grab a copy of my professional portfolio, or save my contact card directly to your device.",
  },
  contact: {
    eyebrow: contactPage.eyebrow,
    heading: contactPage.heading,
    intro: contactPage.intro,
    responseTime: contactChannels.find((c) => c.id === "response-time")?.value ?? "",
  },
};
