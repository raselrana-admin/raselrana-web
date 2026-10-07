import SkillsGroups from "@/components/sections/skills/SkillsGroups";
import PageHeader from "@/components/ui/PageHeader";
import { skillsPage } from "@/lib/data/skills";

export const metadata = {
  title: "Skills | Rasel Rana",
  description:
    "Technical skills and tools of Rasel Rana, grouped by discipline.",
};

export default function SkillsPage() {
  return (
    <>
      <PageHeader {...skillsPage} />
      <SkillsGroups />
    </>
  );
}
