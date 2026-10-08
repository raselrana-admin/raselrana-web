import ExperienceSkills from "@/components/sections/experience/ExperienceSkills";
import ExperienceTimeline from "@/components/sections/experience/ExperienceTimeline";
import { getEntries } from "@/lib/services/content-service";

// Roles are stored one per document. Group them under their organization,
// keeping the order in which each organization first appears.
function groupByOrganization(roles) {
  const groups = new Map();
  for (const role of roles) {
    if (!groups.has(role.organization)) {
      groups.set(role.organization, {
        organization: role.organization,
        sector: role.sector,
        positions: [],
      });
    }
    const group = groups.get(role.organization);
    if (!group.sector && role.sector) group.sector = role.sector;
    group.positions.push(role);
  }
  return [...groups.values()];
}

// Server Component — reads roles from MongoDB. Lives in views/ because it
// touches the database; see DownloadsView.
export default async function ExperienceView() {
  const { role } = await getEntries("experience");
  const skills = [...new Set(role.flatMap((r) => r.tools ?? []))];

  return (
    <>
      <ExperienceTimeline organizations={groupByOrganization(role)} />
      <ExperienceSkills skills={skills} />
    </>
  );
}
