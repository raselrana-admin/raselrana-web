import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session-token";

// First gate for /admin: no genuine, unexpired session cookie -> login page.
// It cannot tell whether the session was ended by a password change (that
// needs the database), so every admin page and Server Action re-checks with
// requireAdmin(). This is a first gate, not the only one.
export async function proxy(request) {
  if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();

  const session = await verifySessionToken(
    request.cookies.get(SESSION_COOKIE)?.value,
  );
  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
