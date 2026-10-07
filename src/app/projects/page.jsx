import ProjectsList from "@/components/sections/projects/ProjectsList";
import PageHeader from "@/components/ui/PageHeader";
import { projectsPage } from "@/lib/data/projects";

export const metadata = {
  title: "Projects | Rasel Rana",
  description:
    "Selected engineering projects by Rasel Rana across telecommunications, power systems and robotics.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader {...projectsPage} />
      <ProjectsList />
    </>
  );
}
