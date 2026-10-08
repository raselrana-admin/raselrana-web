import { ContactForm, ContactInfo } from "@/components";
import { getPageText } from "@/lib/services/page-text";
import { getSiteProfile } from "@/lib/services/site-profile";
import PageHeading from "@/views/layout/PageHeading";

export const metadata = {
  title: "Contact | Rasel Rana",
  description:
    "Get in touch with Rasel Rana for inquiries, collaborations, or technical discussions in telecommunications and electrical/electronic engineering.",
};

export default async function ContactPage() {
  // Email and location come from the public profile, the response time from
  // the Contact page's text (both edited in the dashboard)
  const [profile, text] = await Promise.all([getSiteProfile(), getPageText("contact")]);

  return (
    <>
      <PageHeading page="contact" />

      <section className="border-t border-[var(--line)] py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl items-start gap-12 px-6 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <ContactInfo profile={profile} responseTime={text.responseTime} />
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 md:p-10">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
