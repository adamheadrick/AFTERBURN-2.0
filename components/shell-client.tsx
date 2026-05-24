"use client";

import {
  Archive,
  ChevronsLeft,
  ChevronsRight,
  ClipboardCheck,
  FileText,
  Gauge,
  LogOut,
  Menu,
  Plus,
  RadioTower,
  Route,
  X
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/actions/auth";
import { BrandMark, BrandWordmark } from "@/components/brand-mark";
import { BreadcrumbTrail } from "@/components/breadcrumb-trail";
import { Button } from "@/components/button";
import { DropoffDrawer } from "@/components/dropoff-drawer";
import { NavLink } from "@/components/nav-link";

const nav = [
  { href: "/command-center", label: "Command Center", icon: Gauge, activePaths: ["/command-center", "/overview", "/dashboard", "/readiness"] },
  {
    href: "/plan",
    label: "Plan",
    icon: Route,
    activePaths: ["/advanced", "/plan", "/exercises/new", "/scenario-builder", "/graphic-overview", "/mission-assignment", "/objectives", "/red-team", "/briefing"],
    children: [
      { href: "/exercises/new", label: "Exercise Setup" },
      { href: "/scenario-builder", label: "Scenario / MSEL" },
      { href: "/mission-assignment", label: "Mission Assignment" },
      { href: "/objectives", label: "Objectives" },
      { href: "/graphic-overview", label: "Graphic Overview" },
      { href: "/red-team", label: "AI Red Team" }
    ]
  },
  {
    href: "/execute",
    label: "Execute",
    icon: RadioTower,
    activePaths: ["/execute", "/injects", "/sync-matrix", "/evaluators", "/decision-points", "/white-cell", "/participant-portal", "/feedback"],
    children: [
      { href: "/injects", label: "MSEL / Injects" },
      { href: "/sync-matrix", label: "Sync Matrix" },
      { href: "/evaluators", label: "Evaluator Coverage" },
      { href: "/decision-points", label: "Decisions" },
      { href: "/white-cell", label: "White Cell" },
      { href: "/feedback", label: "Feedback" }
    ]
  },
  {
    href: "/review",
    label: "Review",
    icon: FileText,
    activePaths: ["/review", "/analysis", "/exsum", "/evidence", "/exercise-package", "/ask-exercise"],
    children: [
      { href: "/analysis", label: "Analysis" },
      { href: "/evidence", label: "Evidence Map" },
      { href: "/exsum", label: "EXSUM / AAR" },
      { href: "/exercise-package", label: "Package" },
      { href: "/ask-exercise", label: "Ask Exercise" }
    ]
  },
  {
    href: "/improve",
    label: "Improve",
    icon: ClipboardCheck,
    activePaths: ["/improve", "/poam", "/insights"],
    children: [
      { href: "/poam", label: "POA&M Tracker" },
      { href: "/insights", label: "Trends" }
    ]
  },
  {
    href: "/library",
    label: "Library",
    icon: Archive,
    activePaths: ["/library", "/exercises", "/lessons"],
    excludePaths: ["/exercises/new"],
    children: [
      { href: "/library", label: "Repository" },
      { href: "/lessons", label: "Lessons Learned" },
      { href: "/exercises", label: "Exercise Archive" },
      { href: "/advanced", label: "Full Workspace" }
    ]
  }
];

const sidebarStorageKey = "afterburn.sidebarCollapsed";

export function AppShellClient({
  authEnabled,
  children
}: {
  authEnabled: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const labelsVisible = !collapsed;
  const railCollapsed = collapsed;

  useEffect(() => {
    setCollapsed(localStorage.getItem(sidebarStorageKey) === "true");
  }, []);

  function updateCollapsed(nextValue: boolean) {
    setCollapsed(nextValue);
    localStorage.setItem(sidebarStorageKey, String(nextValue));
  }

  function isActiveHref(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function isActiveItem(item: (typeof nav)[number]) {
    const excluded = item.excludePaths?.some((path) => pathname === path || pathname.startsWith(`${path}/`));
    return !excluded && item.activePaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  }

  return (
    <div className="min-h-screen bg-night text-ink">
      <div className={`grid min-h-screen transition-[grid-template-columns] ${collapsed ? "md:grid-cols-[72px_1fr]" : "md:grid-cols-[236px_1fr] xl:grid-cols-[248px_1fr]"}`}>
        <aside
          className={`${mobileMenuOpen ? "fixed inset-x-0 top-[2.75rem] z-30 max-h-[calc(100vh-2.75rem)] overflow-y-auto border-b border-line" : "hidden"} border-line bg-night transition-[width] md:sticky md:top-0 md:z-20 md:block md:h-screen md:border-b-0 md:border-r ${collapsed ? "md:w-[72px] md:overflow-visible" : "md:overflow-y-auto"}`}
        >
          <div className="flex h-full flex-col">
            <div className={`grid justify-items-center gap-2 border-b border-line ${railCollapsed ? "p-3" : "p-4"}`}>
              <Link href="/" className="flex justify-center" title="AFTERBURN Home">
                {railCollapsed ? <BrandMark className="h-8 w-8" /> : <BrandWordmark className="text-[0.98rem]" />}
              </Link>
              <button
                className="nav-tooltip-host relative hidden rounded-md border border-line bg-field p-1.5 text-steel transition hover:bg-[#151c28] hover:text-ink md:inline-flex"
                type="button"
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                onClick={() => updateCollapsed(!collapsed)}
              >
                {collapsed ? <ChevronsRight size={15} /> : <ChevronsLeft size={15} />}
                <span className="nav-tooltip">
                  {collapsed ? "Expand sidebar" : "Collapse sidebar"}
                </span>
              </button>
            </div>
            <nav className={`${mobileMenuOpen ? "grid" : "hidden"} gap-1.5 md:grid ${railCollapsed ? "p-2" : "p-3"}`}>
              {nav.map((item) => {
                const Icon = item.icon;
                const activeItem = isActiveItem(item);
                return (
                  <div key={item.href}>
                    <NavLink href={item.href} label={item.label} collapsed={railCollapsed} activePaths={item.activePaths} excludePaths={item.excludePaths}>
                      <Icon size={18} />
                    </NavLink>
                    {!railCollapsed && activeItem && item.children?.length ? (
                      <div className="ml-[1.1rem] mt-1 grid gap-0.5 border-l border-line/80 pl-3">
                        {item.children.map((child) => {
                          const active = isActiveHref(child.href);
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`rounded-md px-2 py-1.5 text-[0.78rem] font-medium transition ${
                                active
                                  ? "bg-field text-ink"
                                  : "text-steel hover:bg-field hover:text-ink"
                              }`}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </nav>
            <div className={`${mobileMenuOpen ? "grid" : "hidden"} mt-auto gap-2 border-t border-line md:grid ${railCollapsed ? "p-2" : "p-3"}`}>
              <Link
                href="/exercises/new"
                title="Create Exercise"
                className={`nav-tooltip-host relative flex min-h-8 items-center justify-center gap-2 rounded-md border border-line bg-field px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-[#151c28] ${railCollapsed ? "px-2" : ""}`}
              >
                <Plus size={15} />
                {labelsVisible ? "Create Exercise" : null}
                {railCollapsed ? (
                  <span className="nav-tooltip">
                    Create Exercise
                  </span>
                ) : null}
              </Link>
              {authEnabled ? (
                <form action={signOut}>
                  <Button variant="ghost" className={`w-full ${railCollapsed ? "px-2" : ""}`} title="Sign out">
                    <LogOut size={16} />
                    {labelsVisible ? "Sign out" : null}
                  </Button>
                </form>
              ) : (
                <div className="rounded-md border border-line bg-panel px-3 py-2 text-center text-sm font-semibold text-ink">
                  {railCollapsed ? "Preview" : "Preview mode"}
                </div>
              )}
            </div>
          </div>
        </aside>
        <div className="min-w-0">
          <header className="sticky top-0 z-10 border-b border-line bg-night/95 backdrop-blur">
            <div className="flex min-h-[2.75rem] items-center justify-between gap-4 px-4 sm:px-5 lg:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <Link href="/" title="AFTERBURN Home" className="block rounded-md py-1 transition md:hidden">
                  <BrandWordmark className="text-[0.96rem]" />
                </Link>
                <div className="hidden min-w-0 items-center gap-2 md:flex">
                  <span className="rounded-md border border-line bg-panel px-2 py-1 text-xs font-semibold text-ink">LIGHTNING STRIKE</span>
                  <span className="text-xs text-steel">Review Phase · Demo Mode</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DropoffDrawer />
                <button
                  className="rounded-md border border-line p-1.5 text-steel hover:bg-field hover:text-ink md:hidden"
                  type="button"
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              </div>
            </div>
            <BreadcrumbTrail />
          </header>
          <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
