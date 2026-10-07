import PageHeader from "@/components/ui/PageHeader";
import { achievementsHero } from "@/lib/data/achievements";

export default function AchievementsHero({ featured }) {
  return (
    <PageHeader
      eyebrow="Recognition"
      heading={achievementsHero.heading}
      intro={achievementsHero.intro}
    >
      {featured && (
        <a
          href={featured.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block max-w-2xl border-l-2 border-[var(--signal)] py-1 pl-6"
        >
          <p className="text-sm text-[var(--slate)]">
            Featured in{" "}
            <span className="font-medium text-[var(--ink)]">
              {featured.outlet}
            </span>
            , {featured.date}
          </p>
          <p className="mt-2 font-display text-xl text-[var(--ink)] group-hover:text-[var(--signal)] md:text-2xl">
            {featured.headline}
          </p>
          <p className="mt-3 text-sm text-[var(--signal)] group-hover:underline">
            Read the article
          </p>
        </a>
      )}
    </PageHeader>
  );
}
