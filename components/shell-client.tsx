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
import { signOut } from "@/lib/actions/auth";
import { BrandMark, BrandWordmark } from "@/components/brand-mark";
import { BreadcrumbTrail } from "@/components/breadcrumb-trail";
import { Button } from "@/components/button";
import { DropoffDrawer } from "@/components/dropoff-drawer";
import { NavLink } from "@/components/nav-link";

const nav = [
  { href: "/overview", label: "Command Center", icon: Gauge, activePaths: ["/overview", "/dashboard", "/readiness"] },
  { href: "/plan", label: "Plan", icon: Route, activePaths: ["/advanced", "/plan", "/exercises/new", "/scenario-builder", "/graphic-overview", "/mission-assignment", "/objectives", "/red-team", "/briefing"] },
  { href: "/execute", label: "Execute", icon: RadioTower, activePaths: ["/execute", "/injects", "/sync-matrix", "/evaluators", "/decision-points", "/white-cell", "/participant-portal", "/feedback"] },
  { href: "/review", label: "Review", icon: FileText, activePaths: ["/review", "/analysis", "/exsum", "/evidence", "/exercise-package", "/ask-exercise"] },
  { href: "/improve", label: "Improve", icon: ClipboardCheck, activePaths: ["/improve", "/poam", "/lessons", "/insights"] },
  { href: "/library", label: "Library", icon: Archive, activePaths: ["/library", "/exercises"], excludePaths: ["/exercises/new"] }
];

const sidebarStorageKey = "afterburn.sidebarCollapsed";

export function AppShellClient({
  authEnabled,
  children
}: {
  authEnabled: boolean;
  children: React.ReactNode;
}) {
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

  return (
    <div className="min-h-screen bg-night text-ink">
      <div className={`grid min-h-screen transition-[grid-template-columns] ${collapsed ? "md:grid-cols-[72px_1fr]" : "md:grid-cols-[236px_1fr] xl:grid-cols-[248px_1fr]"}`}>
        <aside
          className={`${mobileMenuOpen ? "fixed inset-x-0 top-[2.75rem] z-30 max-h-[calc(100vh-2.75rem)] overflow-y-auto border-b border-line" : "hidden"} border-line bg-night transition-[width] md:sticky md:top-0 md:z-20 md:block md:h-screen md:overflow-visible md:border-b-0 md:border-r ${collapsed ? "md:w-[72px]" : ""}`}
        >
          <div className="flex h-full flex-col">
            <div className={`grid justify-items-center gap-2 border-b border-line ${railCollapsed ? "p-3" : "p-4"}`}>
              <Link href="/" className="flex justify-center" title="AFTERBURN Home">
                <BrandMark className={railCollapsed ? "h-8 w-8" : "h-9 w-9"} />
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
              {nav.map((item) => (
                <NavLink key={item.href} href={item.href} label={item.label} collapsed={railCollapsed} activePaths={item.activePaths} excludePaths={item.excludePaths}>
                  <item.icon size={18} />
                </NavLink>
              ))}
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
              <Link href="/" title="AFTERBURN Home" className="block rounded-md px-2 py-1 transition hover:bg-field">
                <BrandWordmark className="text-[1.25rem]" />
              </Link>
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
