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
    issue: "Communications / COP ownership unclear",
    owner: "Comms lead",
    status: "Unassigned",
    action: "Assign Owner",
    href: "/plan"
  },
  {
    severity: "Medium",
    issue: "Observer coverage gap by lane",
    owner: "Evaluator lead",
    status: "Needs coverage",
    action: "Open Execute",
    href: "/execute"
  },
  {
    severity: "Medium",
    issue: "UAS / airspace coordination rehearsal incomplete",
    owner: "Air operations",
    status: "Rehearsal check",
    action: "Close Gap",
    href: "/plan"
  },
  {
    severity: "Medium",
    issue: "Hotwash inputs pending validation",
    owner: "Review team",
    status: "Pending",
    action: "Open Review",
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

const captureActions = [
  { label: "Capture observation", href: "/feedback" },
  { label: "Log friction", href: "/feedback" },
  { label: "Record decision", href: "/decision-points" },
  { label: "Participant Intake", href: "/admin/dropoff" }
];

const recentOutputs = [
  { label: "Commander Summary", status: "Draft ready", href: "/exsum" },
  { label: "Evidence Map", status: "Needs review", href: "/evidence" },
  { label: "Status Brief", status: "Exportable", href: "/command-center" }
];

const severityClass = {
  High: "text-red-100",
  Medium: "text-flare",
  Low: "text-steel"
};

export default async function CommandCenterPage() {
  const data = await getAppData();
  const { exercise, readinessScore } = data;
  const hasActiveExercise = data.exercises.length > 0 && exercise.id !== "instructional-exercise";

  if (!hasActiveExercise) {
    return (
      <div className="mx-auto grid max-w-3xl gap-5">
        <header>
          <h1 className="text-xl font-semibold text-ink">Command Center</h1>
          <p className="mt-1 text-sm leading-6 text-steel">Start or open an exercise to begin the facilitator workspace.</p>
        </header>
        <section className="border-t border-line pt-5">
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
    <div className="status-brief-print mx-auto grid max-w-5xl gap-6">
      <header className="print-hidden border-b border-line pb-4">
        <h1 className="text-xl font-semibold text-ink">Command Center</h1>
        <p className="mt-1 text-sm leading-6 text-steel">Active exercise status, top risk, and next action.</p>
      </header>

      <section className="grid gap-6 border-b border-line pb-6 lg:grid-cols-[1fr_0.82fr]">
        <div>
          <p className="text-xs text-steel">Current exercise</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-ink">{shortExerciseName(exercise.name)}</h2>
          <p className="mt-2 text-sm text-steel">
            Review Phase · {readinessScore.score}% Ready with Friction · Updated {formatDate(exercise.updated_at)}
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-ink">
            Review is active. The briefable risk is unresolved communications/COP ownership with observer coverage and UAS coordination still affecting AAR confidence.
          </p>
        </div>

        <div className="border-t border-line pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="text-xs text-steel">Next best action</p>
          <h3 className="mt-1 text-lg font-semibold text-ink">Validate top findings and assign communications ownership.</h3>
          <p className="mt-2 text-sm leading-6 text-steel">Do this before generating the next commander update.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <ButtonLink href="/review" variant="flame">Open Review</ButtonLink>
            <ButtonLink href="/plan" variant="subtle">Assign Owner</ButtonLink>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-ink">Priority Issues</h2>
            <p className="mt-1 text-sm text-steel">Visible by default: the three issues most likely to affect exercise quality.</p>
          </div>
          <Link href="/review" className="text-sm font-semibold text-steel transition hover:text-ink">View all</Link>
        </div>
        <div className="mt-3 border-t border-line">
          {priorityIssues.slice(0, 3).map((issue) => (
            <div key={issue.issue} className="grid gap-2 border-b border-line py-3 md:grid-cols-[6rem_1fr_11rem_8rem] md:items-center">
              <span className={`text-xs font-semibold ${severityClass[issue.severity as keyof typeof severityClass]}`}>{issue.severity}</span>
              <div>
                <p className="text-sm font-semibold text-ink">{issue.issue}</p>
                <p className="mt-0.5 text-xs text-steel">{issue.owner} · {issue.status}</p>
              </div>
              <p className="text-xs text-steel md:text-right">{issue.status}</p>
              <Link href={issue.href} className="text-sm font-semibold text-steel transition hover:text-ink md:text-right">
                {issue.action}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <details className="print-hidden border-t border-line">
        <summary className="cursor-pointer py-3 text-sm text-steel transition hover:text-ink">More console detail</summary>
        <div className="grid gap-6 border-t border-line py-4 lg:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-ink">Capture</h3>
            <div className="mt-3 grid gap-2">
              {captureActions.map((item) => (
                <Link key={item.label} href={item.href} className="border-t border-line pt-2 text-sm text-steel transition hover:text-ink">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink">Lifecycle</h3>
            <div className="mt-3 grid gap-2">
              {lifecycleSteps.map((step) => (
                <Link key={step.label} href={step.href} className="flex justify-between border-t border-line pt-2 text-sm transition hover:text-ink">
                  <span className={step.active ? "text-flare" : "text-ink"}>{step.label}</span>
                  <span className="text-steel">{step.status}</span>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-ink">Briefable Outputs</h3>
              <StatusBriefExportButton />
            </div>
            <div className="mt-3 grid gap-2">
              {recentOutputs.map((item) => (
                <Link key={item.label} href={item.href} className="flex justify-between border-t border-line pt-2 text-sm transition hover:text-ink">
                  <span className="text-ink">{item.label}</span>
                  <span className="text-steel">{item.status}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}
