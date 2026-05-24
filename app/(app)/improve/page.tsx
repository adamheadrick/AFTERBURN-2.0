import { GatePanel, IssueTable, LifecycleChain, MetricStrip, PhaseHero, PhaseSectionTable } from "@/components/lifecycle-workspace";
import { getAppData } from "@/lib/data";

export default async function ImprovePage() {
  const { analysis, poamItems, capabilityGaps, trendInsights, lessonsRepositoryItems } = await getAppData();

  const openPoam = poamItems.filter((item) => item.status !== "complete").length;
  const unassignedPoam = poamItems.filter((item) => !item.responsible_office || item.status === "not_started").length;
  const leadershipFlags = poamItems.filter((item) => item.escalation_flag).length;
  const recurringGaps = capabilityGaps.filter((item) => item.recurrence_count >= 3).length;
  const doctrineUpdates = capabilityGaps.filter((item) => /sop|doctrine|checklist|procedure|minimum information/i.test(`${item.recommendation} ${item.best_practice}`)).length;
  const improveSteps = [
    { label: "POA&M Builder", href: "/poam", status: poamItems.length ? "Tracking" : "Needed" },
    { label: "Improvement Tracker", href: "/poam", status: openPoam ? "Tracking" : "Pending" },
    { label: "Capability Gaps", href: "/lessons", status: capabilityGaps.length ? "Tracking" : "Needed" },
    { label: "Doctrine / Training", href: "/lessons", status: doctrineUpdates ? "Candidates" : "Pending" },
    { label: "Re-test Planning", href: "/insights", status: trendInsights.length ? "Inputs" : "Pending" },
    { label: "Improve Gate", href: "/improve", status: unassignedPoam ? "Needs owner" : "Ready" }
  ];

  const sections = [
    {
      title: "POA&M Builder",
      description: "Convert validated findings into owned corrective actions with owner, supporting organization, due date, resources, status, and measure of success.",
      owner: "Improvement Cell",
      status: poamItems.length ? "Active" : "Needs items",
      evidence: `${poamItems.length} POA&M items; ${openPoam} open`,
      href: "/poam",
      action: "Convert to POA&M",
      tone: poamItems.length ? "ready" as const : "friction" as const
    },
    {
      title: "Improvement Tracker",
      description: "Track milestones, resource requirements, completion evidence, follow-up notes, next update dates, and leadership attention flags.",
      owner: "Responsible Offices",
      status: leadershipFlags ? "Needs attention" : "Tracking",
      evidence: `${leadershipFlags} leadership flags; ${unassignedPoam} not started or missing owners`,
      href: "/poam",
      action: "Assign owner",
      tone: leadershipFlags ? "risk" as const : "friction" as const
    },
    {
      title: "Capability Gap Tracker",
      description: "Categorize operational impact, mission area, current limitation, proposed solution, and training/policy/equipment/personnel/doctrine issue type.",
      owner: "Capability Lead",
      status: recurringGaps ? "Recurring risk" : "Monitoring",
      evidence: `${capabilityGaps.length} capability gaps; ${recurringGaps} recurring across exercises`,
      href: "/lessons",
      action: "Close gap",
      tone: recurringGaps ? "risk" as const : "friction" as const
    },
    {
      title: "Doctrine / SOP / Training Updates",
      description: "Turn findings into SOP updates, observer guides, training requirements, communications cards, UAS request flows, and ICS coordination checklists.",
      owner: "Training / Doctrine",
      status: doctrineUpdates ? "Candidates" : "Needs review",
      evidence: `${doctrineUpdates} doctrine, SOP, or checklist candidates detected`,
      href: "/lessons",
      action: "Route to Library",
      tone: doctrineUpdates ? "friction" as const : "open" as const
    },
    {
      title: "Re-test Planning",
      description: "Link unresolved corrective actions and recurring gaps to future exercise objectives, MSEL injects, and readiness gates.",
      owner: "Exercise Design",
      status: trendInsights.length ? "Inputs ready" : "Needs signals",
      evidence: `${trendInsights.length} trend signals available for future exercise design`,
      href: "/insights",
      action: "Generate draft",
      tone: trendInsights.length ? "ready" as const : "friction" as const
    },
    {
      title: "Improve Gate",
      description: "Confirm priority findings have accountable owners, due dates, resources, milestones, risk if not completed, and future exercise linkage.",
      owner: "Senior Sponsor",
      status: unassignedPoam ? "Ready with friction" : "Accountable",
      evidence: `${unassignedPoam} ownership or start-state issues; ${lessonsRepositoryItems.length} lessons preserved`,
      href: "/improve",
      action: "Assign owner",
      tone: unassignedPoam ? "friction" as const : "ready" as const
    }
  ];

  const issues = [
    {
      severity: "High",
      issue: "Priority corrective actions require accountable owners",
      owner: "Improvement Cell",
      status: `${unassignedPoam} open`,
      recommendation: "Assign a responsible office, supporting agencies, suspense date, resources, and success measure to each priority action.",
      href: "/poam",
      action: "Assign owner",
      tone: unassignedPoam ? "risk" as const : "ready" as const
    },
    {
      severity: "High",
      issue: "Recurring communications/COP gaps should become organizational risk items",
      owner: "Capability Lead",
      status: `${recurringGaps} recurring`,
      recommendation: "Track recurrence, affected entities, operational impact, resource requirement, and re-test plan.",
      href: "/lessons",
      action: "Close gap",
      tone: recurringGaps ? "risk" as const : "friction" as const
    },
    {
      severity: "Medium",
      issue: "UAS / airspace coordination needs a re-test package",
      owner: "Air Operations",
      status: "Draft",
      recommendation: "Build a future exercise input with request flow, legal review, airspace deconfliction, product delivery, and ICP-level briefing material.",
      href: "/sync-matrix",
      action: "Generate draft",
      tone: "friction" as const
    },
    {
      severity: "Medium",
      issue: "Validated lessons need repository disposition",
      owner: "Library Manager",
      status: `${lessonsRepositoryItems.length} items`,
      recommendation: "Approve, tag, and preserve lessons as planning considerations, best practices, or future injects.",
      href: "/library",
      action: "Route to Library",
      tone: "open" as const
    }
  ];

  return (
    <div className="grid gap-4">
      <PhaseHero
        eyebrow="Improve"
        title="Convert Findings Into Accountable Action"
        question="Who owns the fix and how will we track it?"
        description="Use Improve as the accountability layer: convert validated findings into owned corrective actions, milestones, evidence of completion, re-test inputs, and Library-ready lessons."
        primaryHref="/poam"
        primaryAction="Convert to POA&M"
        steps={improveSteps}
      />
      <GatePanel
        label="Improve Gate"
        status={unassignedPoam ? "Needs ownership" : "Actions assigned"}
        statusTone={unassignedPoam ? "friction" : "ready"}
        risk="The AAR loses value if recommendations are not assigned, resourced, tracked, re-tested, and preserved for future planners."
        nextAction="Assign owners and due dates to open corrective actions, then route validated lessons into Library."
        actionHref="/poam"
        actionLabel="Assign owner"
      />
      <IssueTable title="Improvement Issues" description="This is the accountable action layer: owner, due date, resources, risk, evidence, and re-test plan." issues={issues} />
      <MetricStrip metrics={[
        { label: "POA&M items", value: poamItems.length, note: "corrective actions" },
        { label: "Open actions", value: openPoam, note: "not complete" },
        { label: "Capability gaps", value: capabilityGaps.length, note: "tracked risks" },
        { label: "Trend signals", value: trendInsights.length, note: "future inputs" }
      ]} />
      <PhaseSectionTable title="Improvement Workstreams" description="Detailed improvement tools remain available here after ownership and POA&M issues." sections={sections} />
      <LifecycleChain items={[
        { label: "Objectives", value: "source", href: "/objectives" },
        { label: "Observations", value: "validated", href: "/feedback" },
        { label: "Findings", value: analysis.gaps.length, href: "/analysis" },
        { label: "Recommendations", value: analysis.recommendations.length, href: "/analysis" },
        { label: "POA&M", value: poamItems.length, href: "/poam" },
        { label: "Lessons", value: lessonsRepositoryItems.length, href: "/lessons" }
      ]} />
    </div>
  );
}
