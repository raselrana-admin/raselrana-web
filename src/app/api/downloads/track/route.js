import { NextResponse } from "next/server";
import { getDownloadKeys } from "@/lib/services/content-service";
import { getDownloadCounts, getDownloadCount, trackDownload } from "@/lib/services/downloads-service";
import { getClientIp, isRateLimited } from "@/lib/services/rate-limit";

// Only published documents from the Downloads dashboard can be counted
// (getDownloadKeys). Without this, anyone could POST arbitrary ids and fill
// the collection with junk.

// POST /api/downloads/track  { id: "cv" }
// Increments that document's download counter (upserts if it's the first).
export async function POST(request) {
  try {
    const { id } = await request.json();

    if (typeof id !== "string" || !(await getDownloadKeys()).has(id)) {
      return NextResponse.json(
        { error: "Missing or invalid document id" },
        { status: 400 }
      );
    }

    // 30 per 10 minutes per IP: generous for real use, but stops a script
    // from inflating the public download counts.
    const limited = await isRateLimited({
      bucket: "download",
      ip: getClientIp(request),
      max: 30,
      windowSeconds: 10 * 60,
    });
    if (limited) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
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
      const known = (await getDownloadKeys()).has(id);
      const count = known ? await getDownloadCount(id) : 0;
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
