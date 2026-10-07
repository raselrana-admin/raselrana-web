import { ContactForm, ContactInfo } from "@/components";
import PageHeader from "@/components/ui/PageHeader";
import { contactPage } from "@/lib/data/contact";

export const metadata = {
  title: "Contact | Rasel Rana",
  description:
    "Get in touch with Rasel Rana for inquiries, collaborations, or technical discussions in telecommunications and electrical/electronic engineering.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader {...contactPage} />

      <section className="border-t border-[var(--line)] py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl items-start gap-12 px-6 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <ContactInfo />
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 md:p-10">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
