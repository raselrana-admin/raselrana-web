"use client";

import { journeyStages } from "@/lib/data/journey";
import JourneyNav from "./JourneyNav";
import JourneyStage from "./JourneyStage";

export default function JourneyTimeline() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex gap-12">
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
