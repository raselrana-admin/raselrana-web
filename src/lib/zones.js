// The blog is a separate app (another "zone") served at /blog through a
// rewrite in next.config.mjs. A next/link to it would try an in-app
// navigation that cannot work across apps, so links into the blog must be
// plain <a> tags that load the page normally.

/** True for addresses that belong to the blog app. */
export function isBlogLink(href) {
  return href === "/blog" || String(href).startsWith("/blog/");
}
