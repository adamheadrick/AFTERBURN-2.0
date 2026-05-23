import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="AFTERBURN"'
    }
  });
}

function basicAuthChallenge(request: NextRequest) {
  const expectedUser = process.env.BASIC_AUTH_USER;
  const expectedPassword = process.env.BASIC_AUTH_PASSWORD;
  const isDevelopment = process.env.NODE_ENV === "development";
  const isPreviewBypassEnabled =
    process.env.VERCEL_ENV === "preview" &&
    process.env.BASIC_AUTH_DISABLED_FOR_PREVIEW === "true";

  if (isDevelopment) {
    return null;
  }

  if (isPreviewBypassEnabled) {
    return null;
  }

  if (!expectedUser || !expectedPassword) {
    return unauthorized();
  }

  const header = request.headers.get("authorization");

  if (!header?.startsWith("Basic ")) {
    return unauthorized();
  }

  let decoded = "";

  try {
    decoded = atob(header.slice("Basic ".length));
  } catch {
    return unauthorized();
  }

  const separatorIndex = decoded.indexOf(":");

  if (separatorIndex < 0) {
    return unauthorized();
  }

  const suppliedUser = decoded.slice(0, separatorIndex);
  const suppliedPassword = decoded.slice(separatorIndex + 1);

  if (suppliedUser !== expectedUser || suppliedPassword !== expectedPassword) {
    return unauthorized();
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const authResponse = basicAuthChallenge(request);

  if (authResponse) {
    return authResponse;
  }

  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml)$).*)"]
};
