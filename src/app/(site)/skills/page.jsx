import SkillsView from "@/views/skills/SkillsView";

export const metadata = {
  title: "Skills | Rasel Rana",
  description:
    "Technical skills and tools of Rasel Rana, grouped by discipline.",
};

// Skills are edited from /admin and read from MongoDB on every request, so
// changes show up immediately.
export const dynamic = "force-dynamic";

export default function SkillsPage() {
  return <SkillsView />;
}
