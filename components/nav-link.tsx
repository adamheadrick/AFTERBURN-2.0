"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({
  href,
  children,
  label,
  collapsed = false,
  activePaths = [href],
  excludePaths = []
}: {
  href: string;
  children: ReactNode;
  label: string;
  collapsed?: boolean;
  activePaths?: string[];
  excludePaths?: string[];
}) {
  const pathname = usePathname();
  const isExcluded = excludePaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const isActive = !isExcluded && activePaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  return (
    <Link
      href={href}
      title={label}
      aria-current={isActive ? "page" : undefined}
      className={`nav-tooltip-host relative flex min-h-11 items-center rounded-md border px-3 py-2 text-sm font-semibold transition duration-150 ${collapsed ? "justify-center" : "gap-3"} ${
        isActive
          ? collapsed
            ? "border-flare/30 bg-flare/10 text-flare"
            : "border-flare/30 bg-flare/10 text-flare"
          : "border-transparent text-steel hover:border-line hover:bg-field hover:text-ink"
      }`}
    >
      {children}
      {!collapsed ? <span>{label}</span> : null}
      {collapsed ? (
        <span className="nav-tooltip">
          {label}
        </span>
      ) : null}
    </Link>
  );
}
