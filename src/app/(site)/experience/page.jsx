import ExperienceView from "@/views/experience/ExperienceView";
import PageHeading from "@/views/layout/PageHeading";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Experience | Rasel Rana",
  description:
    "Career experience of Rasel Rana across telecommunications at BTCL and power generation at Summit Power Limited.",
  path: "/experience",
});

// Roles are edited from /admin and read from MongoDB on every request, so
// changes show up immediately.
export const dynamic = "force-dynamic";

export default function ExperiencePage() {
  return (
    <>
      <PageHeading page="experience" />
      <ExperienceView />
    </>
  );
}
