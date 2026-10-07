import { journeyStages } from "@/lib/data/journey";
import JourneyNav from "./JourneyNav";
import JourneyStage from "./JourneyStage";

export default function JourneyTimeline() {
  return (
    <section className="border-t border-[var(--line)] py-16 md:py-20">
      <div className="mx-auto flex max-w-6xl gap-16 px-6">
        <JourneyNav stages={journeyStages} />
        <div className="min-w-0 flex-1">
          {journeyStages.map((stage) => (
            <JourneyStage key={stage.id} stage={stage} />
          ))}
        </div>
      </div>
    </section>
  );
}
