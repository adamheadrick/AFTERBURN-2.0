import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export function WorkspaceCard({
  title,
  eyebrow,
  description,
  href,
  action = "Open",
  metric,
  icon: Icon
}: {
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  action?: string;
  metric?: string | number;
  icon: LucideIcon;
}) {
  return (
    <Link href={href} className="ops-hover group rounded-md border border-line bg-panel p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-steel">{eyebrow}</p>
          <h2 className="mt-1 text-base font-semibold text-ink">{title}</h2>
        </div>
        <Icon className="text-steel" size={17} />
      </div>
      <p className="mt-2 text-sm font-semibold leading-6 text-steel">{description}</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-steel group-hover:text-ink">{action}</span>
        {metric !== undefined ? <span className="rounded-md border border-line bg-field px-2 py-0.5 text-xs font-semibold text-steel">{metric}</span> : null}
      </div>
    </Link>
  );
}

export function SignalCard({
  label,
  value,
  note
}: {
  label: string;
  value: string | number;
  note: string;
}) {
  return (
    <div className="rounded-md border border-line bg-panel p-3">
      <p className="text-xs font-semibold text-steel">{label}</p>
      <p className="mt-2 text-xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-xs font-semibold leading-5 text-steel">{note}</p>
    </div>
  );
}
