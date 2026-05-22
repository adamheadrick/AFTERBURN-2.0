import Link from "next/link";

const steps = [
  {
    label: "Frame",
    formal: "Exercise setup + scenario",
    href: "/exercises/new",
    note: "Define the event, hazard, participants, location, assumptions, and operating picture."
  },
  {
    label: "Align",
    formal: "Tasking + objectives",
    href: "/mission-assignment",
    note: "Clarify who does what, why it matters, and what the exercise must test."
  },
  {
    label: "Rehearse",
    formal: "Injects + sync matrix",
    href: "/sync-matrix",
    note: "Sequence injects, organization task/purpose, personnel, locations, and reporting."
  },
  {
    label: "Capture",
    formal: "Evaluators + feedback",
    href: "/feedback",
    note: "Collect observations, decisions, friction, evidence, and participant feedback."
  },
  {
    label: "Review",
    formal: "AAR + improvement plan",
    href: "/exsum",
    note: "Generate findings, EXSUM/AAR outputs, lessons, owners, and corrective actions."
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
