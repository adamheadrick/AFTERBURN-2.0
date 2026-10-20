import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Public partner review, explicitly authorized by the site owner.
  const response = NextResponse.next({ request });
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "same-origin");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static/|_next/image|favicon.ico).*)"]
};
