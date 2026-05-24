import Link from "next/link";
import { ButtonLink } from "@/components/button";
import { StatusBriefExportButton } from "@/components/status-brief-export-button";
import { getAppData } from "@/lib/data";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(value));
}

function shortExerciseName(name: string) {
  return name.replace(/^Exercise\s+/i, "");
}

const priorityIssues = [
  {
    severity: "High",
    issue: "Communications plan ownership",
    owner: "Comms lead",
    status: "Unassigned",
    action: "Assign owner",
    href: "/plan"
  },
  {
    severity: "Medium",
    issue: "Observer coverage by lane",
    owner: "Evaluator lead",
    status: "Needs coverage",
    action: "Close gap",
    href: "/execute"
  },
  {
    severity: "Medium",
    issue: "UAS / airspace coordination",
    owner: "Air operations",
    status: "Rehearsal check",
    action: "Fix",
    href: "/plan"
  },
  {
    severity: "Medium",
    issue: "Hotwash inputs pending validation",
    owner: "Review team",
    status: "Pending",
    action: "Open review",
    href: "/review"
  },
  {
    severity: "Low",
    issue: "POA&M conversion pending",
    owner: "Improvement lead",
    status: "Ready",
    action: "Convert",
    href: "/improve"
  }
];

const lifecycleSteps = [
  { label: "Plan", status: "Complete", href: "/plan" },
  { label: "Execute", status: "Complete", href: "/execute" },
  { label: "Review", status: "Active", href: "/review", active: true },
  { label: "Improve", status: "Started", href: "/improve" },
  { label: "Library", status: "Pending", href: "/library" }
];

const recentOutputs = [
  { label: "Commander Summary", status: "Draft ready", href: "/exsum" },
  { label: "Evidence Map", status: "Needs review", href: "/evidence" },
  { label: "Status Brief", status: "Exportable", href: "/command-center" }
];

const upcomingActions = [
  { label: "Validate top findings", owner: "Review team", href: "/review" },
  { label: "Assign communications owner", owner: "Comms lead", href: "/plan" },
  { label: "Convert priority recommendation", owner: "Improvement lead", href: "/improve" }
];

const severityClass = {
  High: "border-red-400/30 bg-red-500/10 text-red-100",
  Medium: "border-flare/25 bg-flare/10 text-flare",
  Low: "border-line bg-field text-steel"
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
          <p className="mt-1 text-sm leading-6 text-steel">Start or open an exercise to begin the lifecycle workspace.</p>
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
    <div className="status-brief-print mx-auto grid max-w-6xl gap-4">
      <header className="print-hidden border-b border-line pb-4">
        <h1 className="text-xl font-semibold text-ink">Command Center</h1>
        <p className="mt-1 text-sm leading-6 text-steel">Current exercise status, priority issues, and next action.</p>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-lg border border-line bg-panel p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs text-steel">Current exercise</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink">{shortExerciseName(exercise.name)}</h2>
              <p className="mt-2 text-sm text-steel">
                Review Phase · Updated {formatDate(exercise.updated_at)} · Exercise Date {formatDate(exercise.date)}
              </p>
            </div>
            <span className="rounded-md border border-flare/25 bg-flare/10 px-2 py-1 text-xs font-semibold text-flare">
              {readinessScore.score}% Ready with Friction
            </span>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-ink">
            Review is active. Core exercise products are usable, but communications ownership, observer coverage,
            and UAS/airspace coordination need validation before final summary generation.
          </p>
        </div>

        <div className="rounded-lg border border-line bg-panel p-4">
          <p className="text-xs text-steel">Next best action</p>
          <p className="mt-2 text-sm leading-6 text-ink">
            Validate top findings and assign unresolved communications issues.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <ButtonLink href="/review" variant="flame">Open Review</ButtonLink>
            <ButtonLink href="/plan" variant="subtle">Fix Priority Issues</ButtonLink>
            <ButtonLink href="/exsum" variant="ghost">Generate Commander Summary</ButtonLink>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-line bg-panel">
        <div className="border-b border-line px-3 py-3">
          <h2 className="text-sm font-semibold text-ink">Priority Issues</h2>
          <p className="mt-0.5 text-xs text-steel">What needs attention before the next brief.</p>
        </div>
        <div className="hidden grid-cols-[5rem_1fr_10rem_7rem] border-b border-line bg-night/70 px-3 py-2 text-xs text-steel md:grid">
          <span>Severity</span>
          <span>Issue</span>
          <span>Owner / status</span>
          <span className="text-right">Action</span>
        </div>
        {priorityIssues.map((issue) => (
          <div key={issue.issue} className="grid gap-2 border-b border-line px-3 py-2.5 last:border-b-0 hover:bg-field/45 md:grid-cols-[5rem_1fr_10rem_7rem] md:items-center">
            <span className={`inline-flex w-fit rounded-md border px-2 py-0.5 text-xs font-semibold ${severityClass[issue.severity as keyof typeof severityClass]}`}>
              {issue.severity}
            </span>
            <p className="text-sm text-ink">{issue.issue}</p>
            <p className="text-xs text-steel">{issue.owner} · {issue.status}</p>
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
            <span key={`${step.label}-${step.status}`} className="flex items-center gap-3">
              <Link
                href={step.href}
                className={`rounded-md border px-2 py-1 text-xs transition hover:bg-field hover:text-ink ${step.active ? "border-flare/25 bg-flare/10 text-flare" : "border-line bg-night text-steel"}`}
              >
                {step.label} <span className={step.active ? "text-flare" : "text-steel"}>{step.status}</span>
              </Link>
              {index < lifecycleSteps.length - 1 ? <span className="hidden h-px w-4 bg-line sm:inline-block" /> : null}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-panel p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-ink">Recent Outputs</h2>
            <StatusBriefExportButton />
          </div>
          <div className="mt-3 grid gap-2">
            {recentOutputs.map((item) => (
              <Link key={item.label} href={item.href} className="flex items-center justify-between rounded-md border border-line bg-night px-3 py-2 text-sm transition hover:bg-field">
                <span className="text-ink">{item.label}</span>
                <span className="text-xs text-steel">{item.status}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-line bg-panel p-4">
          <h2 className="text-sm font-semibold text-ink">Upcoming Actions</h2>
          <div className="mt-3 grid gap-2">
            {upcomingActions.map((item) => (
              <Link key={item.label} href={item.href} className="flex items-center justify-between gap-3 rounded-md border border-line bg-night px-3 py-2 text-sm transition hover:bg-field">
                <span className="text-ink">{item.label}</span>
                <span className="text-xs text-steel">{item.owner}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
