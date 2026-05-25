import { GatePanel, IssueTable, LifecycleChain, MetricStrip, PhaseHero, PhaseSectionTable } from "@/components/lifecycle-workspace";
import { ButtonLink } from "@/components/button";
import { getAppData } from "@/lib/data";

export default async function ExecutePage() {
  const { injects, syncMatrixEntries, evaluatorAssignments, decisionPoints, feedbackEntries, dropoffSubmissions } = await getAppData();

  const activeRows = syncMatrixEntries.filter((row) => row.status === "active").length;
  const syncGaps = syncMatrixEntries.filter((row) => row.status === "gap" || row.status === "unassigned" || !row.organization).length;
  const highPriorityFeedback = feedbackEntries.filter((item) => item.priority === "high" || item.priority === "critical").length;
  const recentDropoffs = dropoffSubmissions.slice(0, 3);
  const latestInject = injects[0];
  const nextInject = injects[1];
  const latestObservation = feedbackEntries[0];
  const executionSteps = [
    { label: "Live Dashboard", href: "/execute", status: activeRows ? "Active" : "Ready" },
    { label: "Lane / Event Tracking", href: "/sync-matrix", status: syncMatrixEntries.length ? "Tracking" : "Needed" },
    { label: "Evaluator Input", href: "/feedback", status: evaluatorAssignments.length ? "Covered" : "Needed" },
    { label: "Issue Capture", href: "/feedback", status: highPriorityFeedback ? "Active" : "Ready" },
    { label: "Participant Intake", href: "/admin/dropoff", status: dropoffSubmissions.length ? "Screening" : "Ready" },
    { label: "Hotwash", href: "/feedback", status: feedbackEntries.length ? "Capturing" : "Ready" },
    { label: "Execution Gate", href: "/execute", status: feedbackEntries.length ? "Evidence" : "Pending" }
  ];

  const sections = [
    {
      title: "Live Exercise Dashboard",
      description: "Current phase, active inject, open issues, urgent flags, latest observations, and event tempo.",
      owner: "Exercise Control",
      status: activeRows ? "Active" : "Ready",
      evidence: latestInject ? `${latestInject.inject_time} ${latestInject.inject_type}: ${latestInject.description}` : "No active inject selected",
      href: "/white-cell",
      action: "Build inject",
      tone: "ready" as const
    },
    {
      title: "Lane / Event Tracking",
      description: "Lane status, sync matrix rows, entity task/purpose, personnel, location, and timeline friction.",
      owner: "Planning Cell",
      status: syncGaps ? "Friction" : "Ready",
      evidence: `${syncMatrixEntries.length} sync rows; ${syncGaps} gaps/unassigned rows`,
      href: "/sync-matrix",
      action: "Close gap",
      tone: syncGaps ? "friction" as const : "ready" as const
    },
    {
      title: "Observer / Evaluator Input",
      description: "Lane, objective observed, time, agency/unit, sustain, improve, gap, friction, severity, and evidence.",
      owner: "Evaluation Cell",
      status: evaluatorAssignments.length ? "Covered" : "Needs coverage",
      evidence: `${evaluatorAssignments.length} observer/evaluator assignments`,
      href: "/feedback",
      action: "Assign owner",
      tone: evaluatorAssignments.length ? "ready" as const : "risk" as const
    },
    {
      title: "Issue / Friction Capture",
      description: "Linear-style issue creation for title, description, severity, lane, objective, owner, status, evidence, and recommended action.",
      owner: "Exercise Cell",
      status: highPriorityFeedback ? "Active issues" : "Monitoring",
      evidence: `${highPriorityFeedback} high/critical feedback entries`,
      href: "/feedback",
      action: "Convert to finding",
      tone: highPriorityFeedback ? "friction" as const : "ready" as const
    },
    {
      title: "Participant Intake",
      description: "Secure intake for participant observations, documents, screenshots, hotwash comments, lessons, and recommended improvements.",
      owner: "All Participants",
      status: recentDropoffs.length ? "Receiving" : "Ready",
      evidence: `${dropoffSubmissions.length} intake submissions; screening lifecycle retained`,
      href: "/admin/dropoff",
      action: "Route to Library",
      tone: "open" as const
    },
    {
      title: "Hotwash Capture",
      description: "Near-real-time participant comments, immediate sustains/improves, biggest friction, and recommended changes.",
      owner: "Facilitation Team",
      status: feedbackEntries.length ? "Capturing" : "Ready",
      evidence: latestObservation ? latestObservation.friction || latestObservation.what_happened : "Awaiting first observation",
      href: "/feedback",
      action: "Convert to finding",
      tone: feedbackEntries.length ? "ready" as const : "friction" as const
    },
    {
      title: "Execution Gate",
      description: "Confirms the event is producing useful evidence for AAR development, not just activity tracking.",
      owner: "Exercise Director",
      status: feedbackEntries.length && evaluatorAssignments.length ? "Evidence flowing" : "Needs signal",
      evidence: `${feedbackEntries.length} observations; ${decisionPoints.length} decision points`,
      href: "/execute",
      action: "Map evidence",
      tone: feedbackEntries.length ? "ready" as const : "friction" as const
    }
  ];

  const issues = [
    {
      severity: "High",
      issue: "Timeline rows missing assigned leads during execution",
      owner: "Planning Cell",
      status: `${syncGaps} rows`,
      recommendation: "Assign lead entity, task/purpose, personnel, location, and reporting requirement before the next time block.",
      href: "/sync-matrix",
      action: "Close gap",
      tone: syncGaps ? "risk" as const : "ready" as const
    },
    {
      severity: "Medium",
      issue: "Observer/evaluator signal must stay tied to objectives",
      owner: "Evaluation Cell",
      status: `${feedbackEntries.length} observations`,
      recommendation: "Ensure every note references lane, objective, agency, evidence, severity, and follow-up.",
      href: "/feedback",
      action: "Convert to finding",
      tone: feedbackEntries.length ? "friction" as const : "risk" as const
    },
    {
      severity: "Medium",
      issue: "Decision points need outcome and AAR relevance",
      owner: "Command Group",
      status: `${decisionPoints.length} tracked`,
      recommendation: "Record authority, information available, actual decision, outcome, and evidence link.",
      href: "/decision-points",
      action: "Map evidence",
      tone: "friction" as const
    },
    {
      severity: "Low",
      issue: "Participant intake items require screening before reuse",
      owner: "Review Team",
      status: `${dropoffSubmissions.length} submissions`,
      recommendation: "Screen, sanitize, and route submissions to AAR, POA&M, or Library as appropriate.",
      href: "/admin/dropoff",
      action: "Route to Library",
      tone: "open" as const
    }
  ];

  return (
    <div className="grid gap-4">
      <PhaseHero
        eyebrow="Execute"
        title="Run the Exercise and Capture Reality"
        question="What is happening and what evidence are we capturing?"
        description="Use Execute as the live facilitation board: track the active inject, expected action, owner, objective, observations, friction, decisions, hotwash input, and participant intake."
        primaryHref="/feedback"
        primaryAction="Capture observation"
        steps={executionSteps}
      />
      <section className="rounded-md border border-line bg-panel p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-steel">Active Inject</p>
            <h2 className="mt-1 text-lg font-semibold text-ink">
              {latestInject ? `${latestInject.inject_number} · ${latestInject.inject_type}` : "No active inject selected"}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-steel">
              {latestInject?.description ?? "Select or build the active inject before starting exercise play."}
            </p>
          </div>
          <ButtonLink href="/feedback" variant="flame">Capture Observation</ButtonLink>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="border-t border-line pt-3">
            <p className="text-xs font-semibold text-steel">Expected action</p>
            <p className="mt-1 text-sm leading-6 text-ink">{latestInject?.expected_action ?? "Define expected participant action."}</p>
          </div>
          <div className="border-t border-line pt-3">
            <p className="text-xs font-semibold text-steel">Related objective</p>
            <p className="mt-1 text-sm leading-6 text-ink">{latestInject?.related_objective ?? "Not linked"}</p>
          </div>
          <div className="border-t border-line pt-3">
            <p className="text-xs font-semibold text-steel">Delivery / audience</p>
            <p className="mt-1 text-sm leading-6 text-ink">{latestInject?.delivered_to ?? "Exercise control"}</p>
          </div>
          <div className="border-t border-line pt-3">
            <p className="text-xs font-semibold text-steel">Next inject</p>
            <p className="mt-1 text-sm leading-6 text-ink">{nextInject ? `${nextInject.inject_time} · ${nextInject.inject_type}` : "None queued"}</p>
          </div>
        </div>
      </section>
      <GatePanel
        label="Execution Gate"
        status={feedbackEntries.length ? "Evidence flowing" : "Needs signal"}
        statusTone={feedbackEntries.length ? "ready" : "friction"}
        risk="Observations lose AAR value if they are not tied to objective, lane, agency, severity, and evidence."
        nextAction="Capture objective-linked observations and close active sync-matrix ownership gaps."
        actionHref="/feedback"
        actionLabel="Log friction"
      />
      <IssueTable title="Execution Issues" description="Friction capture should behave like an operational issue list: owner, status, recommendation, and direct action." issues={issues} />
      <MetricStrip metrics={[
        { label: "Active lanes", value: activeRows || "Ready", note: "sync matrix status" },
        { label: "Injects", value: injects.length, note: "MSEL events" },
        { label: "Observations", value: feedbackEntries.length, note: "captured inputs" },
        { label: "Urgent flags", value: highPriorityFeedback, note: "high/critical entries" }
      ]} />
      <PhaseSectionTable title="More execution tools" description="Lane tracking, evaluator coverage, decisions, participant intake, hotwash, and execution gate details stay available here." sections={sections} />
      <LifecycleChain items={[
        { label: "Objectives", value: evaluatorAssignments.length, href: "/evaluators" },
        { label: "Observations", value: feedbackEntries.length, href: "/feedback" },
        { label: "Findings", value: "build next", href: "/analysis" },
        { label: "Recommendations", value: highPriorityFeedback, href: "/analysis" },
        { label: "POA&M", value: "convert", href: "/poam" },
        { label: "Lessons", value: dropoffSubmissions.length, href: "/lessons" }
      ]} />
    </div>
  );
}
