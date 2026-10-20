import { requireWorkspaceAccess } from "@/lib/access/server";
import { AppShell } from "@/components/shell";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireWorkspaceAccess();
  return <AppShell>{children}</AppShell>;
}
