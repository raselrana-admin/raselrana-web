import { NextResponse } from "next/server";
import { getDownloadCounts, getDownloadCount, trackDownload } from "@/lib/services/downloads-service";

// POST /api/downloads/track  { id: "cv" }
// Increments that document's download counter (upserts if it's the first).
export async function POST(request) {
  try {
    const { id } = await request.json();

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid document id" },
        { status: 400 }
      );
    }

    const count = await trackDownload(id);
    return NextResponse.json({ id, count });
  } catch (err) {
    console.error("Download tracking error:", err);
    return NextResponse.json(
      { error: "Failed to track download" },
      { status: 500 }
    );
  }
}

// GET /api/downloads/track            -> all counts, { [id]: count }
// GET /api/downloads/track?id=cv      -> single count, { id, count }
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const count = await getDownloadCount(id);
      return NextResponse.json({ id, count });
    }

    const counts = await getDownloadCounts();
    return NextResponse.json(counts);
  } catch (err) {
    console.error("Download stats fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch download stats" },
      { status: 500 }
    );
  }
}
