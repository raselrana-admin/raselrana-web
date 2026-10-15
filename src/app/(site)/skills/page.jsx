import SkillsView from "@/views/skills/SkillsView";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Skills | Rasel Rana",
  description:
    "Technical skills and tools of Rasel Rana, grouped by discipline.",
  path: "/skills",
});

// Skills are edited from /admin and read from MongoDB on every request, so
// changes show up immediately.
export const dynamic = "force-dynamic";

export default function SkillsPage() {
  return <SkillsView />;
}
