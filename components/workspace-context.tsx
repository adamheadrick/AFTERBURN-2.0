"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBrowserConcept } from "@/components/use-browser-concept";

export function WorkspaceContext({ connected }: { connected: boolean }) {
  const path = usePathname();
  const { concept, loaded, unavailable } = useBrowserConcept();
  const draftView = path === "/exercises/new" || (path === "/briefing" && !!concept?.draft);
  const hub = ["/overview", "/plan", "/execute", "/review", "/improve", "/library"].includes(path);
  if (!loaded) return <div className="workspace-context print-hidden" role="status">Loading workspace context…</div>;
  return <div className="workspace-context print-hidden">
    <span className="context-label">{draftView ? "Browser draft" : connected ? "Workspace records" : "Demonstration"}</span>
    <p>{unavailable ? "Your browser draft could not be read. Open the planner to check your work." :
      draftView ? "Saved on this device. Export a copy to keep or share." :
      hub ? "The guided planner and its briefing use your browser draft. Other tools currently use separate workspace records." :
      connected ? "These records are separate from the guided planner draft." :
      "Sample exercise data. These records do not reflect your guided planner draft."}</p>
    {!draftView && <Link href="/exercises/new" className="shrink-0 font-semibold text-flare underline underline-offset-4">{concept ? "Return to draft" : "Open planner"}</Link>}
  </div>;
}
