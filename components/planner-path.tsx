import Link from "next/link";
import { workspaceSections } from "@/lib/workspace-navigation";
export function PlannerPath() {
  return <nav aria-label="Exercise lifecycle" className="flex flex-wrap gap-2 rounded-xl border border-line bg-panel p-4">
    {workspaceSections.filter(section => ["plan", "execute", "review", "improve"].includes(section.id)).map(section =>
      <Link key={section.id} href={section.href} className="rounded-lg border border-line px-4 py-2 text-sm text-steel transition hover:bg-field hover:text-ink">{section.label}</Link>)}
  </nav>;
}
