import { isCloudinaryUrl } from "@/lib/cloudinary-url";

// Latest posts from the blog, for the home page. The blog is a separate app
// with its own database; it offers the posts at GET /blog/api/posts (the
// contract is in docs/blog-design-brief.md, section 8).
//
// Everything here fails soft: no BLOG_DOMAIN, a slow or failing blog, or an
// answer in the wrong shape all give an empty list, and the home page then
// leaves the section out. The home page must never break because of the blog.

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const REVALIDATE_SECONDS = 600; // keep the answer for 10 minutes
const TIMEOUT_MS = 4000;

// Accept only what the home page will show, in the shape it expects.
function cleanPost(raw) {
  if (!raw || typeof raw !== "object") return null;
  if (typeof raw.title !== "string" || !raw.title.trim()) return null;
  if (typeof raw.slug !== "string" || raw.slug.length > 200 || !SLUG.test(raw.slug)) return null;

  const published = new Date(raw.publishedAt ?? raw.createdAt);
  const minutes = Number.parseInt(raw.readingMinutes, 10);

  return {
    title: raw.title.trim().slice(0, 200),
    slug: raw.slug,
    excerpt: typeof raw.excerpt === "string" ? raw.excerpt.trim().slice(0, 300) : "",
    // Only images from Cloudinary are shown; anything else is ignored
    coverUrl: isCloudinaryUrl(raw.coverUrl) ? raw.coverUrl : null,
    tags: Array.isArray(raw.tags)
      ? raw.tags.filter((t) => typeof t === "string" && t.trim()).map((t) => t.trim().slice(0, 40)).slice(0, 3)
      : [],
    publishedAt: Number.isNaN(published.getTime()) ? null : published.toISOString(),
    readingMinutes: minutes > 0 && minutes < 600 ? minutes : null,
  };
}

/** The newest published blog posts (at most `limit`), or [] if they can't be had. */
export async function getLatestPosts(limit = 3) {
  const blog = process.env.BLOG_DOMAIN?.replace(/\/+$/, "");
  if (!blog) return [];

  try {
    const response = await fetch(`${blog}/blog/api/posts?limit=${limit}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) return [];

    const data = await response.json();
    if (!Array.isArray(data?.posts)) return [];

    return data.posts.map(cleanPost).filter(Boolean).slice(0, limit);
  } catch {
    // Blog unreachable, too slow, or not JSON: show no section
    return [];
  }
}
