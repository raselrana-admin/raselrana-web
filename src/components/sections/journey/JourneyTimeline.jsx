import JourneyNav from "./JourneyNav";
import JourneyStage from "./JourneyStage";

// `stages` are the journey entries from the dashboard, in order.
export default function JourneyTimeline({ stages }) {
  if (stages.length === 0) return null;

  return (
    <section className="border-t border-[var(--line)] py-16 md:py-20">
      <div className="mx-auto flex max-w-6xl gap-16 px-6">
        {/* The side nav only needs each stage's id and title */}
        <JourneyNav stages={stages.map(({ id, title }) => ({ id, title }))} />
        <div className="min-w-0 flex-1">
          {stages.map((stage) => (
            <JourneyStage key={stage.id} stage={stage} />
          ))}
        </div>
      </div>
    </section>
  );
}
