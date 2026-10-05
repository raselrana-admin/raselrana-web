import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAchievement,
  getAllAchievementSlugs,
  getPressForCompetition,
} from "@/lib/data/achievements";
import ExternalLinks from "@/components/ui/ExternalLinks";

export function generateStaticParams() {
  return getAllAchievementSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const found = getAchievement(slug);
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
  const found = getAchievement(slug);
  if (!found) notFound();

  const { category, categoryLabel, item } = found;
  const clip =
    category === "competition" ? getPressForCompetition(slug) : null;
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

        {item.description ? (
          <p className="mt-10 max-w-[60ch] leading-relaxed text-[var(--slate)]">
            {item.description}
          </p>
        ) : (
          <p className="mt-10 max-w-[60ch] leading-relaxed text-[var(--slate)]">
            The full story is coming soon.
          </p>
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
