import Link from "next/link";
import { ButtonLink } from "@/components/button";
import { PlacematExportButton } from "@/components/placemat-export-button";
import { getAppData } from "@/lib/data";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function shortExerciseName(name: string) {
  return name.replace(/^Exercise\s+/i, "");
}

const issueRows = [
  {
    severity: "High",
    issue: "Communications interoperability plan needs owner validation",
    phase: "Plan",
    owner: "Comms lead",
    status: "Open",
    action: "Assign owner",
    href: "/plan"
  },
  {
    severity: "Medium",
    issue: "Observer/evaluator coverage is uneven across COP, UAS, and resource lanes",
    phase: "Execute",
    owner: "Evaluator lead",
    status: "Needs coverage",
    action: "Close gap",
    href: "/execute"
  },
  {
    severity: "Medium",
    issue: "Timeline rows need confirmed lead, task, purpose, and location by entity",
    phase: "Execute",
    owner: "Planning cell",
    status: "In progress",
    action: "Close gap",
    href: "/sync-matrix"
  },
  {
    severity: "Medium",
    issue: "UAS airspace coordination and TAK/COP data flow require final rehearsal check",
    phase: "Plan",
    owner: "UAS/Airspace cell",
    status: "Review",
    action: "Generate draft",
    href: "/plan"
  },
  {
    severity: "Low",
    issue: "Validated findings need conversion into owner-tracked POA&M items",
    phase: "Improve",
    owner: "Improvement lead",
    status: "Ready",
    action: "Convert to POA&M",
    href: "/improve"
  }
];

const lifecycleSteps = [
  { label: "Plan", status: "Complete", href: "/plan" },
  { label: "Execute", status: "Complete", href: "/execute" },
  { label: "Review", status: "In progress", href: "/review", active: true },
  { label: "Improve", status: "Started", href: "/improve" },
  { label: "Library", status: "Capturing", href: "/library" }
];

const severityClass = {
  High: "border-red-400/30 bg-red-500/10 text-red-100",
  Medium: "border-flare/25 bg-flare/10 text-flare",
  Low: "border-line bg-field text-steel"
};

const issueDotClass = {
  High: "bg-red-300",
  Medium: "bg-flare",
  Low: "bg-steel"
};

export default async function OverviewPage() {
  const data = await getAppData();
  const { exercise, readinessScore } = data;
  const hasActiveExercise = data.exercises.length > 0 && exercise.id !== "instructional-exercise";

  if (!hasActiveExercise) {
    return (
      <div className="mx-auto grid max-w-4xl gap-4">
        <header>
          <h1 className="text-xl font-semibold text-ink">Command Center</h1>
          <p className="mt-1 text-sm leading-6 text-steel">Current status, risk, next actions, and briefable outputs for the active exercise.</p>
        </header>
        <section className="rounded-lg border border-line bg-panel p-5">
          <h2 className="text-base font-semibold text-ink">No active exercise</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-steel">
            Create a new exercise or open an existing one to begin planning, execution tracking, review, and improvement.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <ButtonLink href="/exercises/new" variant="flame">Start New Exercise</ButtonLink>
            <ButtonLink href="/exercises" variant="subtle">Open Existing Exercise</ButtonLink>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="placemat-print mx-auto grid max-w-6xl gap-4">
      <header className="print-hidden flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
        <div>
          <p className="text-xs text-steel">Active exercise placemat</p>
          <h1 className="mt-1 text-xl font-semibold text-ink">Command Center</h1>
          <p className="mt-1 text-sm leading-6 text-steel">Status, risk, next action, and briefable outputs for the active exercise.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/ask-exercise" variant="ghost">Ask AFTERBURN</ButtonLink>
          <ButtonLink href="/exsum" variant="ghost">Generate EXSUM draft</ButtonLink>
          <PlacematExportButton />
        </div>
      </header>

      <section className="rounded-lg border border-line bg-panel p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight text-ink">{shortExerciseName(exercise.name)}</h2>
              <span className="rounded-md border border-line bg-night px-2 py-0.5 text-xs font-semibold text-steel">Review Phase</span>
              <span className="rounded-md border border-flare/25 bg-flare/10 px-2 py-0.5 text-xs font-semibold text-flare">
                {readinessScore.score}% {readinessScore.label}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-steel">
              Updated {formatDate(exercise.updated_at)} · Exercise Date {formatDate(exercise.date)} · {exercise.location}
            </p>
          </div>
          <ButtonLink href="/exsum" variant="ghost" className="print-hidden">Export EXSUM</ButtonLink>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold text-steel">Biggest risk</p>
            <p className="mt-1 text-sm leading-6 text-ink">
              Rehearsal friction remains around communications ownership, observer/evaluator coverage, and entity-specific task/purpose confirmation.
            </p>
          </div>
          <div className="rounded-md border border-line bg-night/75 p-3">
            <p className="text-xs font-semibold text-steel">Next best action</p>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
              <p className="max-w-2xl text-sm leading-6 text-ink">
                Assign the communications lead, confirm evaluator coverage, and close sync matrix ownership gaps before final rehearsal.
              </p>
              <ButtonLink href="/plan" variant="flame">Close gap</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-line bg-panel">
        <div className="flex items-center justify-between gap-3 border-b border-line px-3 py-3">
          <div>
            <h2 className="text-sm font-semibold text-ink">Priority Issues</h2>
            <p className="mt-0.5 text-xs text-steel">Issue-first view of what is at risk, who owns it, and what action is needed.</p>
          </div>
          <Link href="/advanced" className="print-hidden text-xs font-semibold text-steel transition hover:text-ink">Open Full Workspace</Link>
        </div>

        <div className="hidden grid-cols-[5rem_1fr_5.5rem_9rem_7rem_8.5rem] border-b border-line bg-night/70 px-3 py-2 text-xs text-steel md:grid">
          <span>Severity</span>
          <span>Issue</span>
          <span>Phase</span>
          <span>Owner</span>
          <span>Status</span>
          <span className="text-right">Action</span>
        </div>
        {issueRows.map((issue) => (
          <div key={issue.issue} className="grid gap-2 border-b border-line px-3 py-2.5 transition last:border-b-0 hover:bg-field/55 md:grid-cols-[5rem_1fr_5.5rem_9rem_7rem_8.5rem] md:items-center">
            <span className={`inline-flex w-fit items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-semibold ${severityClass[issue.severity as keyof typeof severityClass]}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${issueDotClass[issue.severity as keyof typeof issueDotClass]}`} />
              {issue.severity}
            </span>
            <p className="text-sm leading-5 text-ink">{issue.issue}</p>
            <p className="text-xs text-steel">{issue.phase}</p>
            <p className="text-xs text-steel">{issue.owner}</p>
            <p className="text-xs text-steel">{issue.status}</p>
            <Link href={issue.href} className="print-hidden rounded-md px-2 py-1 text-xs font-semibold text-steel transition hover:bg-night hover:text-ink md:text-right">
              {issue.action}
            </Link>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-line bg-panel px-3 py-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-steel">
          <span className="text-xs text-steel">Lifecycle</span>
          {lifecycleSteps.map((step, index) => (
            <span key={step.label} className="flex items-center gap-3">
              <Link
                href={step.href}
                className={`rounded-md border px-2 py-1 text-xs transition hover:bg-field hover:text-ink ${step.active ? "border-flare/25 bg-flare/10 text-flare" : "border-line bg-night text-steel"}`}
              >
                {step.label} <span className={step.active ? "text-flare" : "text-steel"}>{step.status}</span>
              </Link>
              {index < lifecycleSteps.length - 1 ? <span className="hidden h-px w-5 bg-line sm:inline-block" /> : null}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
