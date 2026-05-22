"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Archive, BarChart3, FileCheck2, Gauge, RadioTower, Route } from "lucide-react";

const phases = [
  {
    label: "Command",
    meta: "Status + risk",
    href: "/overview",
    paths: ["/overview", "/dashboard", "/readiness"],
    icon: Gauge
  },
  {
    label: "Plan",
    meta: "Build products",
    href: "/plan",
    paths: ["/plan", "/exercises/new", "/scenario-builder", "/graphic-overview", "/mission-assignment", "/objectives", "/red-team", "/briefing"],
    icon: Route
  },
  {
    label: "Execute",
    meta: "Control event",
    href: "/execute",
    paths: ["/execute", "/injects", "/sync-matrix", "/evaluators", "/decision-points", "/white-cell", "/participant-portal", "/feedback"],
    icon: RadioTower
  },
  {
    label: "Review",
    meta: "AAR + evidence",
    href: "/review",
    paths: ["/review", "/analysis", "/exsum", "/evidence", "/exercise-package", "/ask-exercise"],
    icon: BarChart3
  },
  {
    label: "Improve",
    meta: "Close gaps",
    href: "/improve",
    paths: ["/improve", "/poam", "/lessons", "/insights"],
    icon: FileCheck2
  },
  {
    label: "Library",
    meta: "Reuse",
    href: "/library",
    paths: ["/library", "/exercises"],
    excludePaths: ["/exercises/new"],
    icon: Archive
  }
];

export function LifecycleRail() {
  const pathname = usePathname();

  return (
    <div className="hidden min-w-0 items-center gap-1 rounded-md border border-line bg-panel p-1 2xl:flex">
      {phases.map((phase) => {
        const isExcluded = phase.excludePaths?.some((path) => pathname === path || pathname.startsWith(`${path}/`));
        const isActive = !isExcluded && phase.paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

        return (
          <Link
            key={phase.label}
            href={phase.href}
            className={`flex min-w-[112px] items-center gap-2 rounded px-3 py-2 text-xs transition ${
              isActive ? "border border-flare/50 bg-field text-flare" : "text-steel hover:bg-field hover:text-ink"
            }`}
          >
            <phase.icon size={15} />
            <span className="min-w-0">
              <span className="block font-black leading-4">{phase.label}</span>
              <span className="block truncate text-[0.68rem] font-semibold leading-4 opacity-90">{phase.meta}</span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
