import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";

// `items` are the competitions picked for the home page (views/home/HomeView.jsx).
export default function AchievementsPreview({ items }) {
  if (items.length === 0) return null;

  return (
    <section className="border-t border-[var(--line)] py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          eyebrow="Achievements"
          heading="Recognition"
          href="/achievements"
          linkLabel="All achievements"
        />

        <div className="reveal mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group flex h-full flex-col rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-7 transition-colors hover:border-[var(--signal)]"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full border border-[var(--signal)] px-3 py-1 font-mono text-xs text-[var(--signal)]">
                  {item.badge}
                </span>
                <span className="font-mono text-xs text-[var(--slate)]">
                  {item.meta}
                </span>
              </div>
              <h3 className="mt-6 font-display text-xl font-medium text-[var(--ink)]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--slate)]">
                {item.description}
              </p>
              <span className="mt-auto pt-8 font-mono text-xs text-[var(--slate)] transition-colors group-hover:text-[var(--signal)]">
                Read more →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
