"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Breadcrumb = {
  label: string;
  href?: string;
};

const routeCrumbs: Record<string, Breadcrumb[]> = {
  "/home": [{ label: "Home" }],
  "/overview": [{ label: "Command Center" }],
  "/advanced": [{ label: "Advanced Workspace" }],
  "/dashboard": [{ label: "Command Center", href: "/overview" }, { label: "Dashboard" }],
  "/readiness": [{ label: "Command Center", href: "/overview" }, { label: "Readiness" }],
  "/plan": [{ label: "Plan" }],
  "/scenario-builder": [{ label: "Plan", href: "/plan" }, { label: "Scenario Builder" }],
  "/mission-assignment": [{ label: "Plan", href: "/plan" }, { label: "Tasking / Mission Assignment" }],
  "/objectives": [{ label: "Plan", href: "/plan" }, { label: "Objectives" }],
  "/graphic-overview": [{ label: "Plan", href: "/plan" }, { label: "Graphic Overview" }],
  "/red-team": [{ label: "Plan", href: "/plan" }, { label: "AI Exercise Check" }],
  "/briefing": [{ label: "Plan", href: "/plan" }, { label: "Leadership Brief" }],
  "/execute": [{ label: "Execute" }],
  "/injects": [{ label: "Execute", href: "/execute" }, { label: "Inject List / MSEL" }],
  "/sync-matrix": [{ label: "Execute", href: "/execute" }, { label: "Rehearsal Timeline / Sync Matrix" }],
  "/evaluators": [{ label: "Execute", href: "/execute" }, { label: "Evaluator Coverage" }],
  "/decision-points": [{ label: "Execute", href: "/execute" }, { label: "Decisions & Authorities" }],
  "/white-cell": [{ label: "Execute", href: "/execute" }, { label: "Exercise Control / White Cell" }],
  "/participant-portal": [{ label: "Execute", href: "/execute" }, { label: "Partner Access" }],
  "/feedback": [{ label: "Execute", href: "/execute" }, { label: "Feedback Collection" }],
  "/observations/new": [{ label: "Execute", href: "/execute" }, { label: "New Observation" }],
  "/review": [{ label: "Review" }],
  "/analysis": [{ label: "Review", href: "/review" }, { label: "Feedback Analysis" }],
  "/evidence": [{ label: "Review", href: "/review" }, { label: "Evidence Map" }],
  "/exsum": [{ label: "Review", href: "/review" }, { label: "Executive Summary / AAR Builder" }],
  "/exercise-package": [{ label: "Review", href: "/review" }, { label: "Export Package" }],
  "/ask-exercise": [{ label: "Review", href: "/review" }, { label: "Ask Exercise" }],
  "/improve": [{ label: "Improve" }],
  "/poam": [{ label: "Improve", href: "/improve" }, { label: "Improvement Plan / POA&M" }],
  "/lessons": [{ label: "Improve", href: "/improve" }, { label: "Lessons Learned" }],
  "/insights": [{ label: "Improve", href: "/improve" }, { label: "Trend Analysis" }],
  "/library": [{ label: "Library" }],
  "/exercises": [{ label: "Library", href: "/library" }, { label: "Exercise Archive" }],
  "/admin": [{ label: "Admin" }],
  "/admin/dropoff": [{ label: "Admin", href: "/admin" }, { label: "Dropoff Review Queue" }],
  "/settings": [{ label: "Admin", href: "/admin" }, { label: "Settings" }]
};

function getBreadcrumbs(pathname: string): Breadcrumb[] {
  if (pathname.startsWith("/exercises/new")) {
    return [{ label: "Plan", href: "/plan" }, { label: "Start New Exercise" }];
  }

  if (pathname.startsWith("/exercises/")) {
    return [{ label: "Library", href: "/library" }, { label: "Exercise Record" }];
  }

  if (pathname.startsWith("/summaries/")) {
    return [{ label: "Review", href: "/review" }, { label: "Summary Record" }];
  }

  return routeCrumbs[pathname] ?? [{ label: "Command Center", href: "/overview" }, { label: "Workspace" }];
}

export function BreadcrumbTrail() {
  const pathname = usePathname();

  const breadcrumbs = getBreadcrumbs(pathname);
  const contextCrumbs = breadcrumbs.slice(0, -1).filter((crumb) => crumb.href);

  if (!contextCrumbs.length) return null;

  return (
    <nav aria-label="Parent workspace" className="border-t border-line bg-night px-4 sm:px-6 lg:px-8">
      <ol className="flex min-h-8 items-center gap-1.5 overflow-x-auto whitespace-nowrap py-1 text-xs font-semibold text-steel">
        {contextCrumbs.map((crumb, index) => (
          <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
            <Link
              href={crumb.href ?? "/overview"}
              className="rounded px-2 py-0.5 text-steel transition hover:bg-field hover:text-ink"
            >
              {crumb.label}
            </Link>
            {index < contextCrumbs.length - 1 ? <ChevronRight aria-hidden="true" size={13} className="shrink-0 text-steel" /> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
