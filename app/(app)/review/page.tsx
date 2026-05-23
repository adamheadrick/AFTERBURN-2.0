import { GatePanel, IssueTable, LifecycleChain, MetricStrip, PhaseHero, PhaseSectionTable } from "@/components/lifecycle-workspace";
import { getAppData } from "@/lib/data";

function uniqueCount(values: Array<string | null | undefined>) {
  return new Set(values.map((value) => value?.trim()).filter(Boolean)).size;
}

export default async function ReviewPage() {
  const { feedbackEntries, analysis, exsum, evidenceItems, decisionPoints, dropoffSubmissions, poamItems } = await getAppData();

  const impactedAgencies = uniqueCount(feedbackEntries.map((entry) => entry.organization));
  const priorityFindings = feedbackEntries.filter((entry) => entry.priority === "high" || entry.priority === "critical").length;
  const evidenceLinkedFindings = uniqueCount(evidenceItems.map((item) => item.finding_id));
  const validatedFindingCount = Math.max(evidenceLinkedFindings, analysis.themes.length);
  const decisionEvidence = decisionPoints.filter((point) => point.status === "decided").length;
  const screenedDropoffs = dropoffSubmissions.filter((item) => item.status === "Cleared for Review" || item.status === "Approved for Repository" || item.status === "Added to Repository").length;
  const reviewSteps = [
    { label: "Evidence Review", href: "/evidence", status: evidenceItems.length ? "Linked" : "Needed" },
    { label: "Findings Builder", href: "/analysis", status: validatedFindingCount ? "Draft" : "Needed" },
    { label: "Theme Development", href: "/analysis", status: analysis.themes.length ? "Draft" : "Pending" },
    { label: "EXSUM / AAR Workspace", href: "/exsum", status: exsum.content ? "Draft" : "Needed" },
    { label: "Summary Generator", href: "/ask-exercise", status: analysis.recommendations.length ? "Ready" : "Pending" },
    { label: "Review Gate", href: "/review", status: evidenceLinkedFindings ? "Validate" : "Pending" }
  ];

  const sections = [
    {
      title: "Evidence Review",
      description: "Review observer notes, hotwash comments, dropoff items, screenshots, documents, maps, logs, and exercise products.",
      owner: "Review Cell",
      status: evidenceItems.length ? "Evidence linked" : "Needs evidence",
      evidence: `${evidenceItems.length} evidence items; ${screenedDropoffs}/${dropoffSubmissions.length} dropoff items cleared for review`,
      href: "/evidence",
      action: "Map evidence",
      tone: evidenceItems.length ? "ready" as const : "friction" as const
    },
    {
      title: "Findings Builder",
      description: "Convert raw observations into findings with category, objective, lane, affected agencies, severity, impact, and confidence.",
      owner: "AAR Lead",
      status: validatedFindingCount ? "In build" : "Not started",
      evidence: `${validatedFindingCount} finding candidates; ${priorityFindings} high/critical observations`,
      href: "/analysis",
      action: "Convert to finding",
      tone: validatedFindingCount ? "friction" as const : "risk" as const
    },
    {
      title: "Theme Development",
      description: "Cluster findings into operational themes: communications, ICS integration, UAS data flow, airspace, role clarity, TAK/COP, legal, and resources.",
      owner: "Analysis Cell",
      status: analysis.themes.length ? "Themes drafted" : "Needs analysis",
      evidence: `${analysis.themes.length} themes; ${analysis.gaps.length} gaps; ${analysis.sustains.length} sustains`,
      href: "/analysis",
      action: "Generate draft",
      tone: analysis.themes.length ? "ready" as const : "friction" as const
    },
    {
      title: "EXSUM / AAR Workspace",
      description: "Generate the overall EXSUM, full AAR sections, lane reviews, functional reviews, entity summaries, and leadership summary.",
      owner: "AAR Lead",
      status: exsum.content ? "Draft ready" : "Needs draft",
      evidence: exsum.content ? `${exsum.title} available for review` : "EXSUM/AAR content not generated",
      href: "/exsum",
      action: "Generate EXSUM draft",
      tone: exsum.content ? "ready" as const : "friction" as const
    },
    {
      title: "Summary Generator",
      description: "Generate commander updates, hotwash summaries, issue summaries, POA&M drafts, and lessons learned submissions.",
      owner: "AI Review Assistant",
      status: analysis.recommendations.length ? "Ready" : "Needs input",
      evidence: `${analysis.recommendations.length} recommendations; ${analysis.poam_recommendations.length} POA&M draft items`,
      href: "/ask-exercise",
      action: "Generate draft",
      tone: analysis.recommendations.length ? "ready" as const : "friction" as const
    },
    {
      title: "Review Gate",
      description: "Validate that findings are evidence-backed, tied to objectives, categorized, human-reviewed, and ready for corrective action.",
      owner: "Exercise Director",
      status: evidenceLinkedFindings >= Math.min(analysis.gaps.length, evidenceItems.length) ? "Reviewable" : "Needs validation",
      evidence: `${evidenceLinkedFindings} findings have linked evidence; ${decisionEvidence} decisions captured as evidence`,
      href: "/review",
      action: "Map evidence",
      tone: evidenceLinkedFindings ? "friction" as const : "risk" as const
    }
  ];

  const issues = [
    {
      severity: "High",
      issue: "Priority findings need explicit evidence links",
      owner: "AAR Lead",
      status: `${evidenceLinkedFindings} linked`,
      recommendation: "Tie each high-impact finding to observer notes, sync rows, decision points, hotwash input, or screened dropoff records.",
      href: "/evidence",
      action: "Map evidence",
      tone: evidenceLinkedFindings ? "friction" as const : "risk" as const
    },
    {
      severity: "High",
      issue: "Communications and COP themes require operational impact statements",
      owner: "Analysis Cell",
      status: `${analysis.gaps.length} gaps`,
      recommendation: "Describe how comms/COP friction affected field-to-EOC coordination, decision quality, and reporting tempo.",
      href: "/analysis",
      action: "Generate draft",
      tone: "risk" as const
    },
    {
      severity: "Medium",
      issue: "Entity-specific AAR breakouts need affected agency tags",
      owner: "Review Cell",
      status: `${impactedAgencies} agencies`,
      recommendation: "Tag findings by agency, lane, function, and objective so the final AAR can break out feedback at echelon.",
      href: "/feedback",
      action: "Convert to finding",
      tone: "friction" as const
    },
    {
      severity: "Medium",
      issue: "Recommendations should be POA&M-ready",
      owner: "Improvement Cell",
      status: `${poamItems.length} POA&M`,
      recommendation: "Ensure each priority recommendation has an owner, due date, resource need, and measure of success before handoff.",
      href: "/poam",
      action: "Convert to POA&M",
      tone: poamItems.length ? "friction" as const : "risk" as const
    }
  ];

  return (
    <div className="grid gap-4">
      <PhaseHero
        eyebrow="Review"
        title="Validate Findings and Build the AAR"
        question="What did we learn and what is validated?"
        description="Use Review to move raw inputs into validated findings, then themes, EXSUM/AAR language, and POA&M-ready recommendations."
        primaryHref="/analysis"
        primaryAction="Build findings"
        steps={reviewSteps}
      />
      <GatePanel
        label="Review Gate"
        status={exsum.content ? "AAR draft ready" : "Findings in development"}
        statusTone={exsum.content ? "ready" : "friction"}
        risk="AAR quality depends on findings that are tied to objectives, evidence, agency impact, confidence, and human validation."
        nextAction="Link priority findings to evidence and convert validated recommendations into POA&M drafts."
        actionHref="/evidence"
        actionLabel="Map evidence"
      />
      <IssueTable title="Review Issues" description="The review workspace should make every finding traceable, actionable, and ready for improvement planning." issues={issues} />
      <section className="rounded-md border border-line bg-night/80 px-3 py-2.5">
        <p className="text-xs font-semibold text-steel">EXSUM / AAR path</p>
        <p className="mt-1 text-sm leading-6 text-ink">Observations → Findings → Themes → EXSUM/AAR Draft → POA&M</p>
      </section>
      <MetricStrip metrics={[
        { label: "Observations", value: feedbackEntries.length, note: "raw inputs" },
        { label: "Evidence links", value: evidenceItems.length, note: "supporting records" },
        { label: "Themes", value: analysis.themes.length, note: "analysis clusters" },
        { label: "AAR status", value: exsum.content ? "Draft" : "Build", note: "executive product" }
      ]} />
      <PhaseSectionTable title="Review Workstreams" description="Detailed review tools remain available here after the evidence and EXSUM/AAR issue board." sections={sections} />
      <LifecycleChain items={[
        { label: "Objectives", value: uniqueCount(feedbackEntries.map((entry) => entry.related_objective)), href: "/objectives" },
        { label: "Observations", value: feedbackEntries.length, href: "/feedback" },
        { label: "Findings", value: validatedFindingCount, href: "/analysis" },
        { label: "Recommendations", value: analysis.recommendations.length, href: "/analysis" },
        { label: "POA&M", value: poamItems.length, href: "/poam" },
        { label: "Lessons", value: "candidate", href: "/lessons" }
      ]} />
    </div>
  );
}
