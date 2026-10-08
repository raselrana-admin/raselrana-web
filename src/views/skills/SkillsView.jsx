import SkillsGroups from "@/components/sections/skills/SkillsGroups";
import { getEntries } from "@/lib/services/content-service";
import PageHeading from "@/views/layout/PageHeading";

// Server Component — reads the skill groups from MongoDB. Lives in views/
// because it touches the database; see DownloadsView.
export default async function SkillsView() {
  const { group } = await getEntries("skills");

  return (
    <>
      <PageHeading page="skills" />
      <SkillsGroups groups={group} />
    </>
  );
}
