import RaselPhoto from "@/assets/Rasel_profile_photo.jpg";
import CloudImage from "@/components/ui/CloudImage";
import { aboutHero } from "@/lib/data/about";
import Image from "next/image";

// `photo` is the portrait uploaded in Dashboard → Public profile. Until one
// is uploaded, the portrait bundled with the site is shown.
export default function AboutHero({ photo, name = "Rasel Rana" }) {
  return (
    <section className="bg-[var(--paper)]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 pt-16 pb-16 md:pt-24 md:pb-20 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
        <div>
          <p className="rise flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--slate)]">
            <span aria-hidden className="h-px w-10 bg-[var(--signal)]" />
            {aboutHero.eyebrow}
          </p>
          <h1
            className="rise mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--ink)] md:text-6xl"
            style={{ "--delay": "80ms" }}
          >
            {aboutHero.headline}
          </h1>
          <p
            className="rise mt-6 max-w-[60ch] text-lg leading-relaxed text-[var(--slate)] md:text-xl"
            style={{ "--delay": "160ms" }}
          >
            {aboutHero.intro}
          </p>
          <p
            className="rise mt-6 font-mono text-sm text-[var(--slate)]"
            style={{ "--delay": "240ms" }}
          >
            {aboutHero.location}
          </p>
        </div>

        <div
          className="rise relative mx-auto w-full max-w-xs sm:max-w-sm"
          style={{ "--delay": "160ms" }}
        >
          {/* Offset outline behind the portrait */}
          <div
            aria-hidden
            className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl border border-[var(--signal)] opacity-40"
          />
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--line)]">
            {photo ? (
              <CloudImage
                image={photo}
                alt={`Portrait of ${name}`}
                fill
                priority
                sizes="(max-width: 768px) 80vw, 400px"
                className="object-cover object-top"
              />
            ) : (
              <Image
                src={RaselPhoto}
                alt={`Portrait of ${name}`}
                fill
                priority
                placeholder="blur"
                sizes="(max-width: 768px) 80vw, 400px"
                className="object-cover object-top"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
