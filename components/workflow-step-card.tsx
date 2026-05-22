import type { LucideIcon } from "lucide-react";
import Link from "next/link";

type WorkflowLink = {
  label: string;
  href: string;
  note?: string;
};

export function WorkflowStepCard({
  title,
  eyebrow,
  description,
  href,
  action = "Open",
  metric,
  icon: Icon,
  links = []
}: {
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  action?: string;
  metric?: string | number;
  icon: LucideIcon;
  links?: WorkflowLink[];
}) {
  return (
    <section className="ops-hover rounded-md border border-line bg-panel p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-steel">{eyebrow}</p>
          <h2 className="mt-1 text-base font-semibold text-ink">{title}</h2>
        </div>
        <Icon className="shrink-0 text-steel" size={17} />
      </div>

      <p className="mt-2 text-sm font-semibold leading-6 text-steel">{description}</p>

      {links.length > 0 ? (
        <div className="mt-4 grid gap-2">
          {links.map((link) => (
            <Link
              key={`${title}-${link.label}`}
              href={link.href}
              className="group rounded-md border border-line bg-night px-3 py-2 transition hover:bg-field"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-ink">{link.label}</span>
                <span className="text-xs font-semibold text-steel group-hover:text-ink">Open</span>
              </div>
              {link.note ? <p className="mt-1 text-xs font-semibold leading-5 text-steel">{link.note}</p> : null}
            </Link>
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex items-center justify-between gap-3">
        <Link href={href} className="text-sm font-semibold text-steel transition hover:text-ink">
          {action}
        </Link>
        {metric !== undefined ? <span className="rounded-md border border-line bg-field px-2 py-0.5 text-xs font-semibold text-steel">{metric}</span> : null}
      </div>
    </section>
  );
}
