import Link from "next/link";
import { notFound } from "next/navigation";
import ExternalLinks from "@/components/ui/ExternalLinks";
import {
  competitions,
  getCompetition,
  getPressForCompetition,
} from "@/lib/data/achievements";

export function generateStaticParams() {
  return competitions.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const competition = getCompetition(slug);
  if (!competition) return {};
  return {
    title: `${competition.title}, ${competition.placement}`,
    description: `${competition.placement} at ${competition.title}, organized by ${competition.organizer}.`,
  };
}

export default async function CompetitionPage({ params }) {
  const { slug } = await params;
  const competition = getCompetition(slug);
  if (!competition) notFound();

  const clip = getPressForCompetition(slug);

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
          {competition.placement}
        </p>
        <h1 className="mt-2 font-display text-4xl text-[var(--ink)] md:text-5xl">
          {competition.title}
        </h1>
        <p className="mt-4 text-lg text-[var(--slate)]">
          Organized by {competition.organizer}, {competition.displayDate}
        </p>

        {competition.description ? (
          <p className="mt-10 max-w-[60ch] leading-relaxed text-[var(--slate)]">
            {competition.description}
          </p>
        ) : (
          <p className="mt-10 max-w-[60ch] leading-relaxed text-[var(--slate)]">
            The full story of this competition is coming soon.
          </p>
        )}

        <div className="mt-12">
          <ExternalLinks
            links={competition.links}
            heading="Watch and read more"
          />
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
