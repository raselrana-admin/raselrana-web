import AboutView from "@/views/about/AboutView";

export const metadata = {
  title: "About | Rasel Rana",
  description:
    "About Rasel Rana, Manager (Technical) at BTCL — background, way of working, and career so far.",
};

// The About page is edited from /admin and read from MongoDB on every
// request, so changes show up immediately.
export const dynamic = "force-dynamic";

export default function AboutPage() {
  return <AboutView />;
}
