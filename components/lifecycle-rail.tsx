"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { workspaceSections, workspaceForPath } from "@/lib/workspace-navigation";
export function LifecycleRail() {
  const active = workspaceForPath(usePathname());
  return <nav aria-label="Exercise lifecycle" className="hidden items-center gap-1 2xl:flex">
    {workspaceSections.map(section => <Link key={section.id} href={section.href} aria-current={active?.id === section.id ? "page" : undefined}
      className={`rounded-md px-3 py-2 text-sm ${active?.id === section.id ? "bg-field text-flare" : "text-steel hover:bg-field"}`}>{section.label}</Link>)}
  </nav>;
}
