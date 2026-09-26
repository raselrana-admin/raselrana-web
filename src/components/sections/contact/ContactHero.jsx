import { contactPage } from "@/lib/data/contact";
import { SignalWave } from "@/components";

export default function ContactHero() {
  return (
    <section className="mx-auto max-w-3xl px-6 pt-24 pb-12 text-center sm:pt-32">
      <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-[color:var(--signal)]">
        {contactPage.eyebrow}
      </p>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-[color:var(--ink)] sm:text-5xl">
        {contactPage.heading}
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-[color:var(--slate)]">
        {contactPage.intro}
      </p>
      <div className="mx-auto mt-10 max-w-xs">
        <SignalWave variant="divider" />
      </div>
    </section>
  );
}
