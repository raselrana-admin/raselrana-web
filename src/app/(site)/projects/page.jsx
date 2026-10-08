import PageHeading from "@/views/layout/PageHeading";
import ProjectsView from "@/views/projects/ProjectsView";

export const metadata = {
  title: "Projects | Rasel Rana",
  description:
    "Selected engineering projects by Rasel Rana across telecommunications, power systems and robotics.",
};

// Projects are edited from /admin and read from MongoDB on every request,
// so changes show up immediately.
export const dynamic = "force-dynamic";

export default function ProjectsPage() {
  return (
    <>
      <PageHeading page="projects" />
      <ProjectsView />
    </>
  );
}
