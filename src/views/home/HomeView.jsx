import {
  AboutPreview,
  AchievementsPreview,
  ContactCTA,
  ExperiencePreview,
  FocusAreas,
  Hero,
  LatestWriting,
  ProjectsPreview,
} from "@/components";
import { getLatestPosts } from "@/lib/services/blog-posts";
import { getEntries } from "@/lib/services/content-service";
import { getSiteProfile } from "@/lib/services/site-profile";

// Entries ticked "Show on the home page" in the dashboard; if none are
// ticked, the first few, so a section is never empty.
function pickForHome(list, max) {
  const chosen = list.filter((item) => item.showOnHome);
  return (chosen.length > 0 ? chosen : list).slice(0, max);
}

// Server Component — gathers everything the home page shows from MongoDB
// (profile plus the previews picked in the dashboard) and hands plain data
// to the section components. Lives in views/ because it touches the database.
export default async function HomeView() {
  const [profile, projects, experience, achievements, posts] = await Promise.all([
    getSiteProfile(),
    getEntries("projects"),
    getEntries("experience"),
    getEntries("achievements"),
    // From the blog app's API; an empty list if the blog can't be reached
    getLatestPosts(3),
  ]);

  const featuredProjects = pickForHome(projects.project, 3).map((p) => ({
    id: p.id,
    tag: p.category,
    title: p.title,
    description: p.description,
    href: `/projects#${p.id}`,
  }));

  const roles = pickForHome(experience.role, 3).map((r) => ({
    id: r.id,
    period: `${r.start} — ${r.end || "Present"}`,
    role: r.role,
    org: r.organization,
    summary: r.summary,
  }));

  const competitions = pickForHome(achievements.competition, 3).map((c) => ({
    id: c.id,
    badge: c.placement,
    meta: c.displayDate,
    title: c.title,
    description: `Organized by ${c.organizer}`,
    href: `/achievements/${c.slug}`,
  }));

  return (
    <>
      <Hero profile={profile} />
      <AboutPreview />
      <FocusAreas />
      <ExperiencePreview items={roles} />
      <ProjectsPreview projects={featuredProjects} />
      <AchievementsPreview items={competitions} />
      <LatestWriting posts={posts} />
      <ContactCTA email={profile.email} />
    </>
  );
}
