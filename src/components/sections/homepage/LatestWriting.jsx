import BrandMark from "@/components/ui/BrandMark";
import CloudImage from "@/components/ui/CloudImage";
import SectionHeader from "@/components/ui/SectionHeader";
import { formatDate } from "@/lib/file-links";

// The newest posts from the blog (views/home/HomeView.jsx fetches them).
// Left out entirely when there are none, e.g. while the blog is unreachable.
export default function LatestWriting({ posts }) {
  if (posts.length === 0) return null;

  return (
    <section className="border-t border-[var(--line)] py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          eyebrow="Blog"
          heading="Latest writing"
          href="/blog"
          linkLabel="View all posts"
        />

        <div className="reveal mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {posts.map((post) => {
            const meta = [
              formatDate(post.publishedOn),
              post.readingMinutes ? `${post.readingMinutes} min read` : "",
            ].filter(Boolean);

            return (
              // The blog is a separate app, so this is a plain link (see lib/zones.js)
              <a
                key={post.slug}
                href={post.url}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] transition-colors hover:border-[var(--signal)]"
              >
                {/* Always the same shape, so cards line up: the post's
                    cover, or the logo on a soft tint when it has none */}
                <div className="relative flex aspect-[16/9] items-center justify-center border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--signal)_8%,var(--surface))]">
                  {post.coverUrl ? (
                    <CloudImage
                      image={{ url: post.coverUrl }}
                      alt={post.coverAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 380px"
                      className="object-cover"
                    />
                  ) : (
                    <BrandMark size={44} className="opacity-25" />
                  )}
                </div>

                <div className="flex flex-1 flex-col p-7">
                  {post.label && (
                    <p className="mb-4 font-mono text-xs text-[var(--signal)]">
                      {post.label}
                    </p>
                  )}
                  <h3 className="font-display text-xl font-medium text-[var(--ink)]">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--slate)]">
                      {post.excerpt}
                    </p>
                  )}
                  {post.tags.length > 0 && (
                    <p className="mt-4 font-mono text-xs text-[var(--slate)]">
                      {post.tags.join(" · ")}
                    </p>
                  )}
                  <p className="mt-auto pt-8 font-mono text-xs text-[var(--slate)] transition-colors group-hover:text-[var(--signal)]">
                    {meta.length > 0 ? `${meta.join(" · ")}  →` : "Read the post →"}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
