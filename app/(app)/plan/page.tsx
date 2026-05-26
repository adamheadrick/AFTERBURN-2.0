import Link from "next/link";
import { GatePanel, IssueTable, LifecycleChain, MetricStrip, PhaseHero, PhaseSectionTable } from "@/components/lifecycle-workspace";
import { getAppData } from "@/lib/data";

function uniqueCount(values: Array<string | null | undefined>) {
  return new Set(values.map((value) => value?.trim()).filter(Boolean)).size;
}

export default async function PlanPage() {
  const { exercise, scenario, missionAssignment, objectives, injects, syncMatrixEntries, evaluatorAssignments, readinessScore } = await getAppData();

  const hasActiveExercise = exercise.id !== "instructional-exercise";
  const agencyCount = hasActiveExercise ? Math.max(exercise.supporting_orgs.length + 1, uniqueCount([exercise.lead_org, ...exercise.supporting_orgs, ...syncMatrixEntries.map((item) => item.organization)])) : 0;
  const syncGaps = syncMatrixEntries.filter((item) => item.status === "gap" || item.status === "unassigned" || !item.organization || !item.task || !item.purpose).length;
  const evaluatorCoverage = uniqueCount(evaluatorAssignments.map((item) => item.objective_focus));
  const evaluatorGaps = Math.max(0, objectives.length - evaluatorCoverage);
  const uasRows = syncMatrixEntries.filter((item) => /uas|airspace|drone/i.test(`${item.task} ${item.equipment_assets} ${item.notes}`)).length;
  const commsReady = /radio|webEOC|communications|COP|TAK|reporting/i.test(`${missionAssignment.communications_requirements} ${scenario.communications_environment}`);
  const planningSteps = [
    { label: "Exercise Overview", href: "/exercises/new", status: hasActiveExercise ? "Open" : "Start" },
    { label: "Objectives", href: "/objectives", status: objectives.length ? "Ready" : "Needed" },
    { label: "Scenario / MSEL", href: "/scenario-builder", status: scenario.generated_narrative || injects.length ? "Draft" : "Needed" },
    { label: "Participants", href: "/sync-matrix", status: agencyCount ? "Open" : "Needed" },
    { label: "Rehearsal Timeline", href: "/sync-matrix", status: syncMatrixEntries.length ? "Draft" : "Needed" },
    { label: "Comms / COP", href: "/mission-assignment", status: commsReady ? "Draft" : "Needed" },
    { label: "UAS / Airspace", href: "/sync-matrix", status: uasRows ? "Draft" : "Needed" },
    { label: "Safety / Legal", href: "/red-team", status: scenario.legal_policy_constraints ? "Draft" : "Needed" },
    { label: "Readiness Gate", href: "/readiness", status: readinessScore.label }
  ];

  const sections = [
    {
      title: "Exercise Overview",
      description: "Name, dates, location, lead organization, and participating agencies.",
      owner: exercise.lead_org,
      status: exercise.name && exercise.date && exercise.location ? "Ready" : "Missing input",
      evidence: `${exercise.location}; ${agencyCount} agencies identified`,
      href: "/exercises/new",
      action: "Edit",
      tone: "ready" as const
    },
    {
      title: "Objectives & Evaluation Criteria",
      description: "Objective statements tied to criteria, success conditions, and required evidence.",
      owner: "Exercise Cell",
      status: objectives.length ? "Ready" : "Not ready",
      evidence: `${objectives.length} objectives; ${evaluatorCoverage}/${objectives.length} covered by evaluators`,
      href: "/objectives",
      action: "Assign owner",
      tone: evaluatorGaps ? "friction" as const : "ready" as const
    },
    {
      title: "Scenario / MSEL / Injects",
      description: "Scenario narrative, incident conditions, MSEL injects, and expected actions.",
      owner: "Scenario Cell",
      status: scenario.generated_narrative && injects.length ? "Ready" : "Needs build",
      evidence: `${injects.length} injects; scenario narrative ${scenario.generated_narrative ? "available" : "missing"}`,
      href: "/injects",
      action: "Generate draft",
      tone: scenario.generated_narrative && injects.length ? "ready" as const : "friction" as const
    },
    {
      title: "Participants / Agencies / Roles",
      description: "Agency roles, lead representatives, supported/supporting relationships, and task ownership.",
      owner: "Planning Cell",
      status: syncGaps ? "Ready with friction" : "Ready",
      evidence: `${agencyCount} agencies; ${syncGaps} missing lead/task/purpose items`,
      href: "/sync-matrix",
      action: "Close gap",
      tone: syncGaps ? "friction" as const : "ready" as const
    },
    {
      title: "Rehearsal Timeline / Execution Script",
      description: "Phase-by-phase sync matrix showing who is doing what, where, when, with what assets, for what purpose, reporting to whom, and what output is expected.",
      owner: "Planning Cell",
      status: syncMatrixEntries.length ? "Ready with friction" : "Not ready",
      evidence: `${syncMatrixEntries.length} sync rows; ${syncGaps} unresolved rows`,
      href: "/sync-matrix",
      action: "Close gap",
      tone: syncGaps ? "friction" as const : "ready" as const
    },
    {
      title: "Communications / Common Operating Picture",
      description: "Primary/alternate communications, reporting paths, COP/TAK integration, and data flow.",
      owner: "Comms Lead",
      status: commsReady ? "Ready with friction" : "Incomplete",
      evidence: missionAssignment.communications_requirements || "Communications requirements need definition",
      href: "/mission-assignment",
      action: "Close gap",
      tone: commsReady ? "friction" as const : "risk" as const
    },
    {
      title: "UAS / Airspace / Technical Integration",
      description: "UAS assets, flight windows, launch/recovery, airspace coordination, and product flow into decisions.",
      owner: "UAS / Airspace Cell",
      status: uasRows ? "Ready with friction" : "Needs coordination",
      evidence: `${uasRows} UAS/airspace sync rows detected`,
      href: "/sync-matrix",
      action: "Assign owner",
      tone: uasRows ? "friction" as const : "risk" as const
    },
    {
      title: "Safety / Risk / Legal Authorities",
      description: "Weather, medical, sensitive information, safety controls, privacy, and civil authority constraints.",
      owner: "Safety / Legal",
      status: scenario.legal_policy_constraints ? "Ready with friction" : "Needs review",
      evidence: scenario.legal_policy_constraints || "Legal / policy constraints not captured",
      href: "/red-team",
      action: "Generate draft",
      tone: "friction" as const
    },
    {
      title: "Planning Readiness Gate",
      description: "Detects missing leads, incomplete task/purpose, unconfirmed agencies, comms gaps, observer gaps, and unresolved airspace coordination.",
      owner: "Exercise Director",
      status: readinessScore.label,
      evidence: readinessScore.summary,
      href: "/readiness",
      action: "Close gap",
      tone: readinessScore.score >= 85 ? "ready" as const : "friction" as const
    }
  ];

  const issues = [
    {
      severity: "High",
      issue: "Communications / COP plan needs final validation",
      owner: "Comms Lead",
      status: commsReady ? "Drafted" : "Incomplete",
      recommendation: "Confirm primary/alternate nets, reporting paths, COP/TAK data flow, and update rhythm.",
      href: "/mission-assignment",
      action: "Close gap",
      tone: "risk" as const
    },
    {
      severity: "Medium",
      issue: "Observer coverage not aligned to all objectives",
      owner: "Exercise Cell",
      status: `${evaluatorGaps} gaps`,
      recommendation: "Assign observer/evaluator coverage to every major objective and lane.",
      href: "/evaluators",
      action: "Assign owner",
      tone: evaluatorGaps ? "friction" as const : "ready" as const
    },
    {
      severity: "Medium",
      issue: "Rehearsal timeline rows missing lead, task, or purpose",
      owner: "Planning Cell",
      status: `${syncGaps} rows`,
      recommendation: "Close each sync row with lead entity, task, purpose, location, personnel, and reporting requirement.",
      href: "/sync-matrix",
      action: "Close gap",
      tone: syncGaps ? "friction" as const : "ready" as const
    },
    {
      severity: "Medium",
      issue: "UAS / airspace coordination requires explicit owner",
      owner: "UAS / Airspace Cell",
      status: uasRows ? "In plan" : "Unassigned",
      recommendation: "Confirm flight windows, launch/recovery, deconfliction, collection limits, and data delivery.",
      href: "/sync-matrix",
      action: "Assign owner",
      tone: uasRows ? "friction" as const : "risk" as const
    }
  ];

  const goNoGoChecklist = [
    { label: "Scenario defined", ready: Boolean(scenario.generated_narrative), status: scenario.generated_narrative ? "Ready" : "Needed", owner: "Scenario Cell", action: "Build scenario", href: "/scenario-builder" },
    { label: "Objectives set", ready: objectives.length > 0, status: `${objectives.length} objectives`, owner: "Exercise Cell", action: "Open objectives", href: "/objectives" },
    { label: "Agencies / partners identified", ready: agencyCount > 1, status: `${agencyCount} agencies`, owner: "Planning Cell", action: "Assign roles", href: "/sync-matrix" },
    { label: "Roles / lanes assigned", ready: syncGaps === 0 && syncMatrixEntries.length > 0, status: syncGaps ? `${syncGaps} gaps` : "Ready", owner: "Lane Leads", action: "Close gaps", href: "/sync-matrix" },
    { label: "Communications / COP plan drafted", ready: commsReady, status: commsReady ? "Drafted" : "Needs owner", owner: "Comms Lead", action: "Close gap", href: "/mission-assignment" },
    { label: "Safety / legal / authority issues reviewed", ready: Boolean(scenario.legal_policy_constraints), status: scenario.legal_policy_constraints ? "Reviewed" : "Needs review", owner: "Safety / Legal", action: "Review", href: "/red-team" },
    { label: "Observers / evaluators assigned", ready: evaluatorGaps === 0 && objectives.length > 0, status: evaluatorGaps ? `${evaluatorGaps} gaps` : "Covered", owner: "Evaluator Lead", action: "Assign", href: "/evaluators" },
    { label: "Readiness decision", ready: readinessScore.score >= 85, status: readinessScore.label, owner: "Exercise Director", action: "Assess", href: "/readiness" }
  ];

  return (
    <div className="grid gap-4">
      <PhaseHero
        eyebrow="Plan"
        title="Build and Validate the Exercise"
        question="Are we ready to execute?"
        description="Use Plan as a readiness decision tool: confirm purpose, objectives, scenario/MSEL, partners, rehearsal timeline, communications/COP, UAS/airspace, evaluator coverage, and safety/legal constraints."
        primaryHref="/readiness"
        primaryAction="Assess readiness"
        steps={planningSteps}
      />
      <section className="border-t border-line pt-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-ink">Readiness Checklist</h2>
            <p className="mt-1 text-sm leading-6 text-steel">What is missing, who owns it, and what to do next.</p>
          </div>
          <span className="border border-line px-2 py-1 text-xs font-semibold text-steel">
            {goNoGoChecklist.filter((item) => item.ready).length}/{goNoGoChecklist.length} ready
          </span>
        </div>
        <div className="mt-3 border-t border-line">
          {goNoGoChecklist.map((item) => (
            <div key={item.label} className="grid gap-2 border-b border-line py-2 md:grid-cols-[1fr_7rem_9rem_7rem] md:items-center">
              <div className="flex items-center gap-2">
                <span className={`size-2 ${item.ready ? "bg-signal" : "bg-flare"}`} />
                <span className="text-sm font-semibold text-ink">{item.label}</span>
              </div>
              <span className="text-xs text-steel">{item.status}</span>
              <span className="text-xs text-steel">{item.owner}</span>
              <Link href={item.href} className="text-sm font-semibold text-steel transition hover:text-ink md:text-right">{item.action}</Link>
            </div>
          ))}
        </div>
      </section>
      <GatePanel
        label="Planning Gate"
        status={`${readinessScore.score}% ${readinessScore.label}`}
        statusTone={readinessScore.score >= 85 ? "ready" : "friction"}
        risk="Communications, evaluator coverage, timeline ownership, and UAS/airspace integration need final confirmation."
        nextAction="Assign owners to unresolved planning gaps before final rehearsal."
        actionHref="/readiness"
        actionLabel="Close gap"
      />
      <IssueTable title="Planning Issues" description="Issue/action view for what must be fixed before execution." issues={issues} />
      <MetricStrip metrics={[
        { label: "Objectives", value: objectives.length, note: "evaluation targets" },
        { label: "Injects", value: injects.length, note: "MSEL events" },
        { label: "Agencies", value: agencyCount, note: "participating organizations" },
        { label: "Planning gaps", value: syncGaps + evaluatorGaps, note: "coverage and sync issues" }
      ]} />
      <PhaseSectionTable title="Planning details" description="Exercise overview, objectives, MSEL, participants, rehearsal timeline, comms/COP, UAS/airspace, and safety/legal details remain available here." sections={sections} />
      <LifecycleChain items={[
        { label: "Objectives", value: objectives.length, href: "/objectives" },
        { label: "Observations", value: 0, href: "/feedback" },
        { label: "Findings", value: "pending", href: "/analysis" },
        { label: "Recommendations", value: readinessScore.recommendations.length, href: "/readiness" },
        { label: "POA&M", value: "next phase", href: "/poam" },
        { label: "Lessons", value: "Library-ready", href: "/lessons" }
      ]} />
    </div>
  );
}
