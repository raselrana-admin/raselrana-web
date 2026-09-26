import RaselPhoto from "@/assets/Rasel_profile_photo.jpg";
import { SignalWave } from "@/components";
import { aboutHero } from "@/lib/data/about";
import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="border-b border-[var(--line)] bg-[var(--paper)]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-[1.2fr_0.8fr] md:py-28">
        <div>
          <p className="font-mono text-sm text-[var(--slate)]">
            {aboutHero.eyebrow}
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-[var(--ink)] md:text-5xl">
            {aboutHero.headline}
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg text-[var(--slate)]">
            {aboutHero.intro}
          </p>
          <p className="mt-4 font-mono text-sm text-[var(--slate)]">
            {aboutHero.location}
          </p>
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--line)]">
          <Image
            src={RaselPhoto}
            alt="Rasel Rana"
            fill
            sizes="(max-width: 768px) 80vw, 400px"
            className="object-cover"
            priority
          />
        </div>
      </div>

      <SignalWave variant="divider" />
    </section>
  );
}
