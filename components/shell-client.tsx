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
import { usePathname } from "next/navigation";
import { workspaceSections, pathsForWorkspace } from "@/lib/workspace-navigation";
import { WorkspaceContext } from "@/components/workspace-context";
import { useEffect, useState } from "react";
import { signOut } from "@/lib/actions/auth";
import { BrandMark, BrandWordmark } from "@/components/brand-mark";
import { BreadcrumbTrail } from "@/components/breadcrumb-trail";
import { Button } from "@/components/button";
import { DropoffDrawer } from "@/components/dropoff-drawer";
import { NavLink } from "@/components/nav-link";

const icons = { overview: Gauge, plan: Route, execute: RadioTower, review: FileText, improve: ClipboardCheck, library: Archive };
const nav = workspaceSections.map(section => ({
  href: section.href, label: section.label, icon: icons[section.id],
  activePaths: pathsForWorkspace(section.id),
  excludePaths: section.id === "library" ? ["/exercises/new"] : []
}));

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
  const pathname = usePathname();
  const railCollapsed = collapsed && !mobileMenuOpen;
  const labelsVisible = !railCollapsed;

  useEffect(() => {
    try { setCollapsed(localStorage.getItem(sidebarStorageKey) === "true"); } catch { /* Keep navigation usable without storage. */ }
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  function updateCollapsed(nextValue: boolean) {
    setCollapsed(nextValue);
    try { localStorage.setItem(sidebarStorageKey, String(nextValue)); } catch { /* Preference is optional. */ }
  }

  return (
    <div className="app-workspace min-h-screen bg-night text-ink">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className={`grid min-h-screen transition-[grid-template-columns] ${collapsed ? "md:grid-cols-[72px_1fr]" : "md:grid-cols-[236px_1fr] xl:grid-cols-[248px_1fr]"}`}>
        <aside id="workspace-navigation"
          className={`${mobileMenuOpen ? "fixed inset-x-0 top-[2.75rem] z-30 max-h-[calc(100vh-2.75rem)] overflow-y-auto border-b border-line" : "hidden"} border-line bg-night transition-[width] md:sticky md:top-0 md:z-20 md:block md:h-screen md:overflow-visible md:border-b-0 md:border-r ${collapsed ? "md:w-[72px]" : ""}`}
        >
          <div className="flex h-full flex-col">
            <div className={`grid justify-items-center gap-2 border-b border-line ${railCollapsed ? "p-3" : "p-4"}`}>
              <Link href="/overview" className="flex justify-center" title="AFTERBURN overview">
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
            <nav aria-label="Exercise workspace" className={`${mobileMenuOpen ? "grid" : "hidden"} gap-1.5 md:grid ${railCollapsed ? "p-2" : "p-3"}`}>
              {nav.map((item) => (
                <NavLink key={item.href} href={item.href} label={item.label} collapsed={railCollapsed} activePaths={item.activePaths} excludePaths={item.excludePaths}>
                  <item.icon size={18} />
                </NavLink>
              ))}
            </nav>
            <div className={`${mobileMenuOpen ? "grid" : "hidden"} mt-auto gap-2 border-t border-line md:grid ${railCollapsed ? "p-2" : "p-3"}`}>
              <Link
                href="/exercises/new"
                title="Guided planner"
                className={`nav-tooltip-host relative flex min-h-11 items-center justify-center gap-2 rounded-md border border-line bg-field px-3 py-2 text-sm font-semibold text-ink transition hover:bg-[#151c28] ${railCollapsed ? "px-2" : ""}`}
              >
                <Plus size={15} />
                {labelsVisible ? "Guided planner" : null}
                {railCollapsed ? (
                  <span className="nav-tooltip">
                    Guided planner
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
              <Link href="/overview" title="AFTERBURN overview" className="block rounded-md px-2 py-1 transition hover:bg-field">
                <BrandWordmark className="text-[1.25rem]" />
              </Link>
              <div className="flex items-center gap-2">
                <DropoffDrawer />
                <button
                  className="rounded-md border border-line p-1.5 text-steel hover:bg-field hover:text-ink md:hidden"
                  type="button"
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={mobileMenuOpen}
                  aria-controls="workspace-navigation"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              </div>
            </div>
            <BreadcrumbTrail />
          </header>
          <main id="main-content" tabIndex={-1} className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8"><WorkspaceContext connected={authEnabled} />{children}</main>
        </div>
      </div>
    </div>
  );
}
