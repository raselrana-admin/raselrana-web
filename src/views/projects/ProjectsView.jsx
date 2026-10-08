import ProjectsList from "@/components/sections/projects/ProjectsList";
import { getEntries } from "@/lib/services/content-service";

// Server Component — reads projects from MongoDB. Lives in views/ because it
// touches the database; see DownloadsView.
export default async function ProjectsView() {
  const { project } = await getEntries("projects");
  return <ProjectsList projects={project} />;
}
