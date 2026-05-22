import { AppShellClient } from "@/components/shell-client";
import { hasSupabaseConfig } from "@/lib/config";

export function AppShell({ children }: { children: React.ReactNode }) {
  return <AppShellClient authEnabled={hasSupabaseConfig()}>{children}</AppShellClient>;
}
