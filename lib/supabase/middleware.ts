import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  // Public demo mode: do not require login for any AFTERBURN route.
  return NextResponse.next({ request });
}
