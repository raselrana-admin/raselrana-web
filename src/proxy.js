import { NextResponse } from "next/server";

// The site is being rebuilt. Until the new version is released, every page
// shows the "Under development" page (src/app/under-development/page.jsx).
// The address in the browser does not change, so links keep working later.
//
// To open the site again: delete this file's rewrite (or the whole file) and
// put the navbar and footer back in src/app/layout.js.
export function proxy(request) {
  const url = request.nextUrl.clone();
  if (url.pathname === "/under-development") return NextResponse.next();

  url.pathname = "/under-development";
  url.search = "";
  return NextResponse.rewrite(url);
}

export const config = {
  // Every page, but not: the blog (another app), the API, Next's own files,
  // or anything with a file extension (images, icons, robots.txt, ...).
  matcher: ["/((?!blog|api|_next/static|_next/image|.*\\..*).*)"],
};
