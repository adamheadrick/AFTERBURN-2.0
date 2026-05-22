import { AlertTriangle, CheckCircle2, CircleDashed } from "lucide-react";
import type {
  AiAnalysis,
  Exercise,
  Exsum,
  FeedbackEntry,
  Inject,
  MissionAssignment,
  Objective,
  PoamItem,
  Scenario,
  SyncMatrixEntry
} from "@/lib/types/database";

function present(value: unknown) {
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}

function phaseStatus(done: number, total: number) {
  if (done === total) {
    return { label: "Ready", icon: CheckCircle2, color: "text-signal" };
  }

  if (done === 0) {
    return { label: "Needs input", icon: CircleDashed, color: "text-steel" };
  }

  return { label: "In progress", icon: AlertTriangle, color: "text-flare" };
}

export function PhaseReadiness({
  exercise,
  scenario,
  missionAssignment,
  objectives,
  injects,
  syncMatrixEntries,
  feedbackEntries,
  analysis,
  exsum,
  poamItems
}: {
  exercise: Exercise;
  scenario: Scenario;
  missionAssignment: MissionAssignment;
  objectives: Objective[];
  injects: Inject[];
  syncMatrixEntries: SyncMatrixEntry[];
  feedbackEntries: FeedbackEntry[];
  analysis: AiAnalysis;
  exsum: Exsum;
  poamItems: PoamItem[];
}) {
  const phases: Array<{
    label: string;
    href: string;
    checks: Array<[string, boolean]>;
  }> = [
    {
      label: "Concept",
      href: "/exercises/new",
      checks: [
        ["Exercise name", present(exercise.name)],
        ["Date and location", present(exercise.date) && present(exercise.location)],
        ["Lead organization", present(exercise.lead_org)],
        ["Participating organizations", exercise.supporting_orgs.length > 0]
      ]
    },
    {
      label: "Plan",
      href: "/scenario-builder",
      checks: [
        ["Scenario inputs", present(scenario.situation) && present(scenario.operational_problem)],
        ["Scenario narrative", present(scenario.generated_narrative)],
        ["Tasking / mission assignment", present(missionAssignment.mission_statement)],
        ["Objectives", objectives.length > 0]
      ]
    },
    {
      label: "Execute",
      href: "/sync-matrix",
      checks: [
        ["Inject list", injects.length > 0],
        ["Rehearsal timeline rows", syncMatrixEntries.length > 0],
        ["Organization task rows", syncMatrixEntries.some((entry) => present(entry.organization))],
        ["Feedback intake", feedbackEntries.length > 0]
      ]
    },
    {
      label: "Assess",
      href: "/analysis",
      checks: [
        ["Feedback analyzed", analysis.themes.length > 0],
        ["Sustains/improves", analysis.sustains.length + analysis.improves.length > 0],
        ["Executive summary drafted", present(exsum.content)],
        ["Organization/category review data", feedbackEntries.length > 0]
      ]
    },
    {
      label: "Improve",
      href: "/poam",
      checks: [
        ["Improvement plan items", poamItems.length > 0],
        ["Responsible offices", poamItems.some((item) => present(item.responsible_office))],
        ["Due dates", poamItems.some((item) => present(item.due_date))],
        ["Measures of success", poamItems.some((item) => present(item.measure_of_success))]
      ]
    }
  ];

  return (
    <section className="grid gap-3 lg:grid-cols-5">
      {phases.map((phase) => {
        const done = phase.checks.filter(([, isDone]) => isDone).length;
        const status = phaseStatus(done, phase.checks.length);
        const percent = Math.round((done / phase.checks.length) * 100);

        return (
          <a key={phase.label} href={phase.href} className="rounded-md border border-line bg-night p-4 hover:border-flare/60 hover:bg-field">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-flare">{phase.label}</p>
              <status.icon className={status.color} size={18} />
            </div>
            <p className="mt-3 text-2xl font-black text-ink">{percent}%</p>
            <p className="mt-1 text-sm font-black text-steel">{status.label}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-panel">
              <span className="block h-full rounded-full bg-flare" style={{ width: `${percent}%` }} />
            </div>
            <ul className="mt-3 grid gap-1 text-xs font-semibold leading-5 text-steel">
              {phase.checks
                .filter(([, isDone]) => !isDone)
                .slice(0, 2)
                .map(([label]) => (
                  <li key={label}>Needs: {label}</li>
                ))}
            </ul>
          </a>
        );
      })}
    </section>
  );
}
