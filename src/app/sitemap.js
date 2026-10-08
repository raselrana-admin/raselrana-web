import { siteInfo } from "@/lib/data/site";

// Public pages only. /admin and /api are excluded here and blocked in robots.js.
// Add a path here when a new public page is created.
const PATHS = [
  "/",
  "/about",
  "/journey",
  "/experience",
  "/achievements",
  "/portfolio",
  "/projects",
  "/skills",
  "/education",
  "/publications",
  "/downloads",
  "/contact",
];

export default function sitemap() {
  return PATHS.map((path) => ({
    url: `${siteInfo.url}${path === "/" ? "" : path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
