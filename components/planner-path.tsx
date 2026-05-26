import Link from "next/link";

const steps = [
  {
    label: "Plan",
    formal: "Build and validate",
    href: "/plan",
    note: "Define purpose, objectives, scenario, partners, and readiness."
  },
  {
    label: "Execute",
    formal: "Capture reality",
    href: "/execute",
    note: "Run the event, track lanes, capture friction, and preserve evidence."
  },
  {
    label: "Review",
    formal: "Generate EXSUM/AAR",
    href: "/review",
    note: "Validate findings, cluster themes, and generate after-action outputs."
  },
  {
    label: "Improve",
    formal: "Track accountability",
    href: "/improve",
    note: "Convert recommendations into POA&M owners, due dates, and milestones."
  },
  {
    label: "Library",
    formal: "Reuse knowledge",
    href: "/library",
    note: "Store lessons, templates, prior outputs, findings, and capability gaps."
  }
];

export function PlannerPath() {
  return (
    <section className="rounded-md border border-line bg-panel p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-flare">Planner path</p>
        <p className="text-xs font-semibold text-ink">Concept to corrective action</p>
      </div>
      <div className="mt-3 grid gap-2 md:grid-cols-5">
        {steps.map((step, index) => (
          <Link key={step.label} href={step.href} className="rounded-md border border-line bg-night p-2 transition hover:border-flare/60 hover:bg-field">
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-md bg-flare px-2 py-1 text-xs font-black text-night">{index + 1}</span>
              <span className="text-xs font-black uppercase tracking-[0.12em] text-flare">{step.label}</span>
            </div>
            <p className="mt-2 text-xs font-black leading-5 text-ink">{step.formal}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
