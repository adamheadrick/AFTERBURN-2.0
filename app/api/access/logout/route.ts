import { NextResponse } from "next/server";
import { verifiedRequestOrigin, ACCESS_COOKIE } from "@/lib/access/session";

export async function POST(request: Request) {
  const origin = verifiedRequestOrigin(request);
  if (!origin) return new Response("Invalid request origin.", { status: 403 });
  const response = NextResponse.redirect(new URL("/access", origin), 303);
  response.cookies.set(ACCESS_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
