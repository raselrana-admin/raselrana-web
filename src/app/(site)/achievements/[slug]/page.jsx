import Link from "next/link";
import { notFound } from "next/navigation";
import CloudImage from "@/components/ui/CloudImage";
import ExternalLinks from "@/components/ui/ExternalLinks";
import RichText from "@/components/ui/RichText";
import { cldUrl } from "@/lib/cloudinary-url";
import {
  findAchievement,
  getAchievementsData,
} from "@/lib/services/achievements-service";
import { pageMetadata } from "@/lib/seo";
import { stripFormatting, toParagraphs } from "@/lib/text";

// Read from MongoDB on every request so admin edits show up immediately.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const found = findAchievement(await getAchievementsData(), slug);
  if (!found) return {};
  const { item } = found;
  // The first paragraph, without bold/italic stars, short enough for a preview
  const firstParagraph = stripFormatting(toParagraphs(item.description)[0] || "").replace(/\s+/g, " ");
  const description =
    (firstParagraph.length > 200 ? `${firstParagraph.slice(0, 197).trimEnd()}…` : firstParagraph) ||
    `${item.title}, ${item.organizer}`;

  return pageMetadata({
    title: `${item.title} | Rasel Rana`,
    description,
    path: `/achievements/${slug}`,
    // The cover photo, cropped to the 1200 × 630 shape link previews use
    image: item.cover
      ? {
          url: item.cover.url.replace("/image/upload/", "/image/upload/c_fill,g_auto,w_1200,h_630,f_jpg,q_auto/"),
          width: 1200,
          height: 630,
          alt: item.title,
        }
      : undefined,
  });
}

// The badge text shown above the title, per category.
function badgeFor({ category, item }) {
  if (category === "competition") return item.placement;
  if (category === "judging") return item.role;
  if (category === "sports") return item.result;
  return null;
}

export default async function AchievementDetailPage({ params }) {
  const { slug } = await params;
  const data = await getAchievementsData();
  const found = findAchievement(data, slug);
  if (!found) notFound();

  const { category, categoryLabel, item } = found;
  const clip =
    category === "competition"
      ? data.press.find((p) => p.competition === slug)
      : null;
  const badge = badgeFor(found);

  return (
    <article className="bg-[var(--paper)]">
      <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        <Link
          href="/achievements"
          className="text-sm text-[var(--signal)] hover:underline"
        >
          Back to achievements
        </Link>

        <p className="mt-10 font-mono text-xs text-[var(--signal)]">
          {categoryLabel}
          {badge ? ` · ${badge}` : ""}
        </p>
        <h1 className="mt-2 font-display text-4xl text-[var(--ink)] md:text-5xl">
          {item.title}
        </h1>
        <p className="mt-4 text-lg text-[var(--slate)]">
          Organized by {item.organizer}, {item.displayDate}
        </p>

        {item.cover && (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-[var(--line)]">
            <CloudImage
              image={item.cover}
              alt={item.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        {item.description ? (
          <RichText
            text={item.description}
            spacing="space-y-5"
            className="mt-10 max-w-[60ch] leading-relaxed text-[var(--slate)]"
          />
        ) : (
          <p className="mt-10 max-w-[60ch] leading-relaxed text-[var(--slate)]">
            The full story is coming soon.
          </p>
        )}

        {item.gallery?.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-xl text-[var(--ink)]">Photos</h2>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {item.gallery.map((photo, index) => (
                <li key={photo.url}>
                  {/* Opens the full-size photo in a new tab */}
                  <a
                    href={cldUrl(photo.url, { width: 2000 })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-xl border border-[var(--line)]">
                      <CloudImage
                        image={photo}
                        alt={photo.caption || `${item.title}, photo ${index + 1}`}
                        fill
                        sizes="(max-width: 640px) 50vw, 240px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    {photo.caption && (
                      <p className="mt-2 text-xs leading-relaxed text-[var(--slate)]">
                        {photo.caption}
                      </p>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-12">
          <ExternalLinks links={item.links} heading="Watch and read more" />
        </div>

        {clip && (
          <a
            href={clip.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-12 block border-l-2 border-[var(--signal)] pl-6 hover:opacity-80"
          >
            <p className="text-sm text-[var(--slate)]">
              {clip.outlet}, {clip.date}
            </p>
            <p className="mt-1 font-display text-lg text-[var(--ink)]">
              {clip.headline}
            </p>
          </a>
        )}
      </div>
    </article>
  );
}
