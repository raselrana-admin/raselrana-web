import {
  AboutCTA,
  AboutFocus,
  AboutHero,
  AboutHighlights,
  AboutStory,
} from "@/components";

export const metadata = {
  title: "About | Rasel Rana",
  description:
    "About Rasel Rana, Manager (Technical) at BTCL — background, way of working, and career so far.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutFocus />
      <AboutHighlights />
      <AboutCTA />
    </>
  );
}
