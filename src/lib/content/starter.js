import * as achievements from "@/lib/data/achievements";
import { downloads } from "@/lib/data/downloads";
import { experienceOrganizations } from "@/lib/data/experience";
import { projects } from "@/lib/data/projects";
import { publications } from "@/lib/data/publications";

// Turns the content files in lib/data into dashboard entries. Used in two
// places: the one-time "Import starter content" button, and as the fallback
// the public pages show while a collection is empty or Mongo is unreachable.
// Every entry needs a `type` that exists in lib/content/modules.js.

const of = (type, extra = {}) => (item, index) => ({
  type,
  ...extra,
  ...item,
  ...(extra.order === undefined ? {} : { order: index }),
});

export const STARTERS = {
  achievements: () => [
    ...achievements.competitions.map(of("competition", { showOnHome: false })),
    ...achievements.judging.map(of("judging")),
    ...achievements.sports.map(of("sports")),
    ...achievements.leadership.map(of("leadership", { description: "", links: [], order: 0 })),
    ...achievements.press.map(of("press", { competition: "", featured: false, order: 0 })),
    ...achievements.affiliations.map(of("affiliation", { order: 0 })),
  ],

  projects: () =>
    projects.map((p, index) => ({
      type: "project",
      title: p.title,
      category: p.tag,
      period: p.period || "",
      description: p.description,
      tags: p.tags || [],
      link: "",
      showOnHome: index < 3,
      order: index,
    })),

  publications: () =>
    publications.map((p, index) => ({
      type: "publication",
      title: p.title,
      venue: p.venue,
      year: p.year,
      summary: p.summary || "",
      url: p.url || "",
      order: index,
    })),

  experience: () =>
    experienceOrganizations
      .flatMap((org) =>
        org.positions.map((position) => ({
          type: "role",
          organization: org.organization,
          sector: org.sector || "",
          role: position.role,
          location: position.location || "",
          start: position.period.start,
          end: position.period.end || "",
          employmentType: position.employmentType || "",
          summary: position.summary || "",
          responsibilities: position.responsibilities || [],
          tools: position.tools || [],
        })),
      )
      .map((role, index) => ({ ...role, showOnHome: index < 2, order: index })),

  downloads: () =>
    downloads.map((d, index) => ({
      type: "document",
      title: d.title,
      key: d.id,
      description: d.description,
      fileUrl: d.filePath,
      fileName: d.fileName,
      fileType: d.fileType,
      fileSize: d.fileSize || "",
      lastUpdated: d.lastUpdated || "",
      order: index,
    })),
};
