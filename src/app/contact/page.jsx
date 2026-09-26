import { ContactHero, ContactInfo, ContactForm } from "@/components";

export const metadata = {
  title: "Contact | Rasel Rana",
  description:
    "Get in touch with Rasel Rana for inquiries, collaborations, or technical discussions in telecommunications and electrical/electronic engineering.",
};

export default function ContactPage() {
  return (
    <main>
      <ContactHero />

      <section className="mx-auto grid max-w-5xl gap-12 px-6 pb-24 sm:grid-cols-5">
        <div className="sm:col-span-2">
          <ContactInfo />
        </div>
        <div className="sm:col-span-3">
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
