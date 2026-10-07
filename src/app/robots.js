import { siteInfo } from "@/lib/data/site";

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }],
    sitemap: `${siteInfo.url}/sitemap.xml`,
  };
}
