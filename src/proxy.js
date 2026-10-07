import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session-token";

// Keeps signed-out visitors away from /admin. Pages and Server Actions
// re-check the session themselves (requireAdmin), so this is a first gate,
// not the only one.
export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const session = await verifySessionToken(
    request.cookies.get(SESSION_COOKIE)?.value,
  );

  if (pathname === "/admin/login") {
    return session
      ? NextResponse.redirect(new URL("/admin/achievements", request.url))
      : NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
