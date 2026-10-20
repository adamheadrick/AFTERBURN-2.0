import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_COOKIE, accessPassword, verifyAccessSession } from "./session";

export async function requireWorkspaceAccess() {
  const password = accessPassword();
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!password || !(await verifyAccessSession(token, password))) redirect("/access");
}
