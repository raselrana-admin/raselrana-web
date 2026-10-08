import EducationView from "@/views/education/EducationView";

export const metadata = {
  title: "Education | Rasel Rana",
  description: "Academic qualifications and training of Rasel Rana.",
};

// Education is edited from /admin and read from MongoDB on every request,
// so changes show up immediately.
export const dynamic = "force-dynamic";

export default function EducationPage() {
  return <EducationView />;
}
