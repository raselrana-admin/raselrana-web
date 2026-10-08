import {
  AboutCTA,
  AboutFocus,
  AboutHero,
  AboutHighlights,
  AboutStory,
} from "@/components";
import { getSiteProfile } from "@/lib/services/site-profile";

export const metadata = {
  title: "About | Rasel Rana",
  description:
    "About Rasel Rana, Manager (Technical) at BTCL — background, way of working, and career so far.",
};

export default async function AboutPage() {
  // The portrait comes from the public profile (dashboard)
  const profile = await getSiteProfile();

  return (
    <>
      <AboutHero photo={profile.photo} name={profile.name} />
      <AboutStory />
      <AboutFocus />
      <AboutHighlights />
      <AboutCTA />
    </>
  );
}
