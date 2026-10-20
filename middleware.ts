import { type NextRequest, NextResponse } from "next/server";
import { accessAllowed, safeReturnPath } from "@/lib/access/session";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicAccessRoute = path === "/access" || path === "/api/access" || path === "/api/access/logout";
  let response: NextResponse;
  if (publicAccessRoute || await accessAllowed(request)) {
    response = NextResponse.next();
  } else if (path.startsWith("/api/") || request.method !== "GET" && request.method !== "HEAD") {
    response = NextResponse.json({ error: "Unlock AFTERBURN to continue.", accessRequired: true }, { status: 401 });
  } else {
    const target = new URL("/access", request.url);
    target.searchParams.set("returnTo", safeReturnPath(path + request.nextUrl.search));
    response = NextResponse.redirect(target);
  }
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "same-origin");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static/|_next/image|favicon.ico).*)"]
};
