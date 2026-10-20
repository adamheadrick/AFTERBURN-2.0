"use client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toolForPath, workspaceForPath } from "@/lib/workspace-navigation";

export function BreadcrumbTrail() {
  const path = usePathname();
  const section = workspaceForPath(path);
  const tool = toolForPath(path);
  const label = tool?.label ?? (path.startsWith("/exercises/") ? "Exercise record" : path.startsWith("/summaries/") ? "Summary" : path === "/observations/new" ? "New observation" : path === "/settings" ? "Settings" : path.startsWith("/admin") ? "Administration" : section?.label ?? "Workspace");
  return <nav aria-label="Breadcrumb" className="border-t border-line px-4 sm:px-6 lg:px-8">
    <ol className="flex min-h-10 flex-wrap items-center gap-2 py-2 text-xs text-steel">
      {section && path !== section.href && <li className="flex items-center gap-2">
        <Link href={section.href} className="rounded hover:text-ink">{section.label}</Link>
        <ChevronRight size={13} aria-hidden="true" />
      </li>}
      <li aria-current="page" className="text-ink">{label}</li>
    </ol>
  </nav>;
}
