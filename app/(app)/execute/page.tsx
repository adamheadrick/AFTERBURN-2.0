import { GatePanel, IssueTable, LifecycleChain, MetricStrip, PhaseHero, PhaseSectionTable } from "@/components/lifecycle-workspace";
import { getAppData } from "@/lib/data";

export default async function ExecutePage() {
  const { injects, syncMatrixEntries, evaluatorAssignments, decisionPoints, feedbackEntries, dropoffSubmissions } = await getAppData();

  const activeRows = syncMatrixEntries.filter((row) => row.status === "active").length;
  const syncGaps = syncMatrixEntries.filter((row) => row.status === "gap" || row.status === "unassigned" || !row.organization).length;
  const highPriorityFeedback = feedbackEntries.filter((item) => item.priority === "high" || item.priority === "critical").length;
  const recentDropoffs = dropoffSubmissions.slice(0, 3);
  const latestInject = injects[0];
  const latestObservation = feedbackEntries[0];
  const executionSteps = [
    { label: "Live Dashboard", href: "/execute", status: activeRows ? "Active" : "Ready" },
    { label: "Lane / Event Tracking", href: "/sync-matrix", status: syncMatrixEntries.length ? "Tracking" : "Needed" },
    { label: "Evaluator Input", href: "/feedback", status: evaluatorAssignments.length ? "Covered" : "Needed" },
    { label: "Issue Capture", href: "/feedback", status: highPriorityFeedback ? "Active" : "Ready" },
    { label: "Dropoff Intake", href: "/admin/dropoff", status: dropoffSubmissions.length ? "Screening" : "Ready" },
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
      action: "Generate draft",
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
      title: "Dropoff Intake",
      description: "Secure intake for observations, documents, screenshots, doctrine references, lessons, and recommended improvements.",
      owner: "All Participants",
      status: recentDropoffs.length ? "Receiving" : "Ready",
      evidence: `${dropoffSubmissions.length} dropoff submissions; AI screening lifecycle retained`,
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
      issue: "Dropoff items require screening before reuse",
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
        description="Use Execute as a live issue board: track lanes, injects, observers, friction, hotwash/dropoff intake, and evidence tied to objective, agency, severity, and follow-up."
        primaryHref="/feedback"
        primaryAction="Capture evidence"
        steps={executionSteps}
      />
      <GatePanel
        label="Execution Gate"
        status={feedbackEntries.length ? "Evidence flowing" : "Needs signal"}
        statusTone={feedbackEntries.length ? "ready" : "friction"}
        risk="Observations lose AAR value if they are not tied to objective, lane, agency, severity, and evidence."
        nextAction="Capture objective-linked observations and close active sync-matrix ownership gaps."
        actionHref="/feedback"
        actionLabel="Convert to finding"
      />
      <IssueTable title="Execution Issues" description="Friction capture should behave like an operational issue list: owner, status, recommendation, and direct action." issues={issues} />
      <MetricStrip metrics={[
        { label: "Active lanes", value: activeRows || "Ready", note: "sync matrix status" },
        { label: "Injects", value: injects.length, note: "MSEL events" },
        { label: "Observations", value: feedbackEntries.length, note: "captured inputs" },
        { label: "Urgent flags", value: highPriorityFeedback, note: "high/critical entries" }
      ]} />
      <PhaseSectionTable title="Execution Workstreams" description="Detailed execution tools remain available here after the live issue board." sections={sections} />
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
