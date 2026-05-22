import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { SetAllCookies } from "@supabase/ssr";
import { hasSupabaseConfig } from "@/lib/config";
import type { Database } from "@/lib/types/database";

export async function updateSession(request: NextRequest) {
  if (!hasSupabaseConfig()) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const protectedPrefixes = [
    "/home",
    "/overview",
    "/advanced",
    "/plan",
    "/execute",
    "/review",
    "/improve",
    "/library",
    "/admin",
    "/dashboard",
    "/readiness",
    "/exercises",
    "/scenario-builder",
    "/graphic-overview",
    "/mission-assignment",
    "/objectives",
    "/red-team",
    "/briefing",
    "/injects",
    "/sync-matrix",
    "/evaluators",
    "/decision-points",
    "/white-cell",
    "/participant-portal",
    "/feedback",
    "/analysis",
    "/exsum",
    "/evidence",
    "/poam",
    "/lessons",
    "/insights",
    "/exercise-package",
    "/ask-exercise",
    "/settings"
  ];
  const isAppRoute = protectedPrefixes.some((prefix) => request.nextUrl.pathname.startsWith(prefix));

  if (!user && isAppRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && request.nextUrl.pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  return response;
}
