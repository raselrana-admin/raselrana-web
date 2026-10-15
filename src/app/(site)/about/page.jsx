import AboutView from "@/views/about/AboutView";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About | Rasel Rana",
  description:
    "About Rasel Rana, Manager (Technical) at BTCL — background, way of working, and career so far.",
  path: "/about",
});

// The About page is edited from /admin and read from MongoDB on every
// request, so changes show up immediately.
export const dynamic = "force-dynamic";

export default function AboutPage() {
  return <AboutView />;
}
