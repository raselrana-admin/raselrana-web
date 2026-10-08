import Link from "next/link";
import { notFound } from "next/navigation";
import CloudImage from "@/components/ui/CloudImage";
import ExternalLinks from "@/components/ui/ExternalLinks";
import { cldUrl } from "@/lib/cloudinary-url";
import {
  findAchievement,
  getAchievementsData,
} from "@/lib/services/achievements-service";

// Read from MongoDB on every request so admin edits show up immediately.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const found = findAchievement(await getAchievementsData(), slug);
  if (!found) return {};
  const { item } = found;
  return {
    title: item.title,
    description: item.description || `${item.title}, ${item.organizer}`,
  };
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
          <p className="mt-10 max-w-[60ch] leading-relaxed text-[var(--slate)]">
            {item.description}
          </p>
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
