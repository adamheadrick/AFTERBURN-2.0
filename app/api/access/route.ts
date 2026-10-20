import { NextResponse } from "next/server";
import { verifiedRequestOrigin, ACCESS_COOKIE, SESSION_SECONDS, accessPassword, createAccessSession, passwordMatches, safeReturnPath } from "@/lib/access/session";
import { allowAccessAttempt } from "@/lib/access/attempts";

export const dynamic = "force-dynamic";

async function readSmallForm(request: Request): Promise<URLSearchParams | null> {
  if (!request.headers.get("content-type")?.startsWith("application/x-www-form-urlencoded")) return null;
  const reader = request.body?.getReader();
  if (!reader) return null;
  const decoder = new TextDecoder();
  let size = 0, body = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 4096) { await reader.cancel(); return null; }
    body += decoder.decode(value, { stream: true });
  }
  return new URLSearchParams(body + decoder.decode());
}

export async function POST(request: Request) {
  const origin = verifiedRequestOrigin(request);
  if (!origin) return new Response("Invalid request origin.", { status: 403 });
  const password = accessPassword();
  if (!password) return new Response("Private preview access has not been configured. Contact the site owner.", { status: 503, headers: { "Cache-Control": "no-store" } });
  const ip = (request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown").trim().slice(0, 100);
  if (!allowAccessAttempt(ip)) return new Response("Too many attempts. Please try again in ten minutes.", { status: 429, headers: { "Retry-After": "600", "Cache-Control": "no-store" } });
  const form = await readSmallForm(request);
  if (!form) return new Response("Invalid form.", { status: 400 });
  const candidate = form.get("password") ?? "";
  const returnTo = safeReturnPath(form.get("returnTo"));
  if (candidate.length > 256 || !(await passwordMatches(candidate, password))) {
    const target = new URL("/access", origin);
    target.searchParams.set("error", "incorrect"); target.searchParams.set("returnTo", returnTo);
    const response = NextResponse.redirect(target, 303);
    response.headers.set("Cache-Control", "no-store");
    return response;
  }
  const response = NextResponse.redirect(new URL(returnTo, origin), 303);
  response.cookies.set(ACCESS_COOKIE, await createAccessSession(password), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_SECONDS
  });
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
