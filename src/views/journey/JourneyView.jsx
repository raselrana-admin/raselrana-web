import JourneyTimeline from "@/components/sections/journey/JourneyTimeline";
import { getEntries } from "@/lib/services/content-service";
import PageHeading from "@/views/layout/PageHeading";

// Server Component — reads the journey stages from MongoDB. Lives in views/
// because it touches the database; see DownloadsView.
export default async function JourneyView() {
  const { stage } = await getEntries("journey");

  return (
    <>
      <PageHeading page="journey" />
      <JourneyTimeline stages={stage} />
    </>
  );
}
