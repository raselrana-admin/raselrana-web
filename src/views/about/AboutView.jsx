import {
  AboutCTA,
  AboutFocus,
  AboutHero,
  AboutHighlights,
  AboutStory,
} from "@/components";
import { getEntries } from "@/lib/services/content-service";
import { getPageText } from "@/lib/services/page-text";
import { getSiteProfile } from "@/lib/services/site-profile";
import { toParagraphs } from "@/lib/text";

// Server Component — gathers the About page from MongoDB: its text
// (dashboard → About → Page heading and text), its two lists (the entries on
// that screen) and the portrait/location from the public profile. Lives in
// views/ because it touches the database.
export default async function AboutView() {
  const [text, entries, profile] = await Promise.all([
    getPageText("about"),
    getEntries("about"),
    getSiteProfile(),
  ]);

  return (
    <>
      <AboutHero
        eyebrow={text.eyebrow}
        headline={text.heading}
        intro={text.intro}
        location={profile.location}
        photo={profile.photo}
        name={profile.name}
      />
      <AboutStory heading={text.storyHeading} paragraphs={toParagraphs(text.storyText)} />
      <AboutFocus heading={text.focusHeading} principles={entries.principle} />
      <AboutHighlights heading={text.highlightsHeading} timeline={entries.highlight} />
      <AboutCTA heading={text.ctaHeading} description={text.ctaDescription} />
    </>
  );
}
