import ExperienceView from "@/views/experience/ExperienceView";
import PageHeading from "@/views/layout/PageHeading";

export const metadata = {
  title: "Experience | Rasel Rana",
  description:
    "Career experience of Rasel Rana across telecommunications at BTCL and power generation at Summit Power Limited.",
};

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
