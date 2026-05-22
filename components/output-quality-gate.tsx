import { AlertTriangle, CheckCircle2, CircleDashed } from "lucide-react";
import Link from "next/link";
import type {
  DecisionPoint,
  EvidenceItem,
  EvaluatorAssignment,
  FeedbackEntry,
  Objective,
  PoamItem,
  SyncMatrixEntry
} from "@/lib/types/database";

function hasText(value: string | undefined) {
  return Boolean(value?.trim());
}

function gateStatus(isDone: boolean, hasSomeInput: boolean) {
  if (isDone) {
    return { label: "Strong", icon: CheckCircle2, color: "text-signal" };
  }

  if (hasSomeInput) {
    return { label: "Needs work", icon: AlertTriangle, color: "text-flare" };
  }

  return { label: "Missing", icon: CircleDashed, color: "text-steel" };
}

export function OutputQualityGate({
  objectives,
  evaluatorAssignments,
  syncMatrixEntries,
  feedbackEntries,
  decisionPoints,
  evidenceItems,
  poamItems
}: {
  objectives: Objective[];
  evaluatorAssignments: EvaluatorAssignment[];
  syncMatrixEntries: SyncMatrixEntry[];
  feedbackEntries: FeedbackEntry[];
  decisionPoints: DecisionPoint[];
  evidenceItems: EvidenceItem[];
  poamItems: PoamItem[];
}) {
  const coveredObjectives = new Set(evaluatorAssignments.map((assignment) => assignment.objective_focus));
  const findingsWithEvidence = new Set(evidenceItems.map((item) => item.finding_id));

  const checks = [
    {
      label: "Objectives can be evaluated",
      why: "A strong AAR starts with objectives that have criteria and success indicators.",
      href: "/objectives",
      isDone: objectives.length > 0 && objectives.every((item) => hasText(item.evaluation_criteria) && hasText(item.success_indicators)),
      hasSomeInput: objectives.length > 0
    },
    {
      label: "Every major objective has evaluator coverage",
      why: "Unobserved objectives become weak findings later.",
      href: "/evaluators",
      isDone: objectives.length > 0 && objectives.every((item) => coveredObjectives.has(item.title)),
      hasSomeInput: evaluatorAssignments.length > 0
    },
    {
      label: "Organizations have task / purpose scripts",
      why: "The rehearsal timeline should show who is doing what, why, where, and when.",
      href: "/sync-matrix",
      isDone: syncMatrixEntries.length > 0 && syncMatrixEntries.every((item) => hasText(item.organization) && hasText(item.task) && hasText(item.purpose)),
      hasSomeInput: syncMatrixEntries.length > 0
    },
    {
      label: "Feedback is specific enough to analyze",
      why: "Good feedback names what happened, who reported it, who was affected, and what should change.",
      href: "/feedback",
      isDone: feedbackEntries.length > 0 && feedbackEntries.every((item) => hasText(item.organization) && hasText(item.what_happened) && hasText(item.recommended_corrective_action)),
      hasSomeInput: feedbackEntries.length > 0
    },
    {
      label: "Decision points are captured",
      why: "Leader-focused findings need decision authority, information available, outcome, and AAR relevance.",
      href: "/decision-points",
      isDone: decisionPoints.length > 0 && decisionPoints.every((item) => hasText(item.decision_authority) && hasText(item.outcome) && hasText(item.aar_relevance)),
      hasSomeInput: decisionPoints.length > 0
    },
    {
      label: "Findings have supporting evidence",
      why: "A defensible AAR links findings back to notes, timeline rows, decisions, hotwash comments, or records.",
      href: "/evidence",
      isDone: poamItems.length > 0 && poamItems.every((item) => findingsWithEvidence.has(item.finding_id)),
      hasSomeInput: evidenceItems.length > 0
    },
    {
      label: "Improvements are assignable",
      why: "The final product should produce owned actions with due dates and measures of success.",
      href: "/poam",
      isDone: poamItems.length > 0 && poamItems.every((item) => hasText(item.responsible_office) && hasText(item.due_date) && hasText(item.measure_of_success)),
      hasSomeInput: poamItems.length > 0
    }
  ];

  const complete = checks.filter((check) => check.isDone).length;
  const score = Math.round((complete / checks.length) * 100);
  const qualityLabel = score >= 85 ? "AAR-ready" : score >= 60 ? "Useful with gaps" : "Needs stronger inputs";

  return (
    <section className="surface-soft rounded-md border border-line p-5 shadow-panel">
      <div className="grid gap-5 xl:grid-cols-[300px_1fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-flare">Output quality gate</p>
          <h2 className="mt-2 text-2xl font-black text-ink">Will this produce a strong AAR?</h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-ink">
            This gate checks whether the exercise record has enough objective, timeline, feedback, decision, evidence,
            and ownership detail to support a credible final summary and improvement plan.
          </p>
          <div className="mt-5 rounded-md border border-flare/50 bg-flare/10 p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">Output score</p>
            <p className="mt-2 text-5xl font-black text-ink">{score}%</p>
            <p className="mt-1 text-sm font-black text-flare">{qualityLabel}</p>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {checks.map((check) => {
            const status = gateStatus(check.isDone, check.hasSomeInput);

            return (
              <Link key={check.label} href={check.href} className="rounded-md border border-line bg-night p-4 transition hover:border-flare/60 hover:bg-field">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-ink">{check.label}</p>
                    <p className="mt-2 text-xs font-semibold leading-5 text-steel">{check.why}</p>
                  </div>
                  <status.icon className={status.color} size={20} />
                </div>
                <p className={`mt-3 text-xs font-black uppercase tracking-[0.14em] ${status.color}`}>{status.label}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
