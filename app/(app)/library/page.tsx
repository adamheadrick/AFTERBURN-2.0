import Link from "next/link";
import { GatePanel, IssueTable, LifecycleChain, MetricStrip, PhaseHero, PhaseSectionTable } from "@/components/lifecycle-workspace";
import { getAppData } from "@/lib/data";

export default async function LibraryPage() {
  const { exercises, analysis, poamItems, capabilityGaps, lessonsRepositoryItems, dropoffSubmissions } = await getAppData();

  const approvedLessons = lessonsRepositoryItems.filter((item) => item.status === "Adopted" || item.status === "Closed" || item.status === "In Progress").length;
  const openPoamHistory = poamItems.filter((item) => item.status !== "complete").length;
  const reusableExercises = exercises.filter((item) => item.status === "complete" || item.status === "exsum").length;
  const repositoryCandidates = dropoffSubmissions.filter((item) => item.status === "Cleared for Review" || item.status === "Approved for Repository" || item.status === "Added to Repository").length;
  const librarySteps = [
    { label: "Lessons Repository", href: "/lessons", status: lessonsRepositoryItems.length ? "Curating" : "Needed" },
    { label: "Exercise Archive", href: "/exercises", status: exercises.length ? "Available" : "Empty" },
    { label: "Templates", href: "/advanced", status: "Ready" },
    { label: "Gap Knowledge Base", href: "/lessons", status: capabilityGaps.length ? "Tracking" : "Needed" },
    { label: "Search / Ask", href: "/ask-exercise", status: repositoryCandidates ? "Screening" : "Ready" }
  ];

  const sections = [
    {
      title: "Lessons Learned Repository",
      description: "Preserve lessons with source exercise, category, evidence, mission area, agencies involved, applicability, reuse guidance, confidence, and approval status.",
      owner: "Library Manager",
      status: lessonsRepositoryItems.length ? "Active" : "Needs entries",
      evidence: `${lessonsRepositoryItems.length} lesson records; ${approvedLessons} adopted or in progress`,
      href: "/lessons",
      action: "Route to Library",
      tone: lessonsRepositoryItems.length ? "ready" as const : "friction" as const
    },
    {
      title: "Exercise Archive",
      description: "Search prior exercises by objectives, scenarios, AARs, EXSUMs, POA&Ms, findings, agencies, and improvement status.",
      owner: "Exercise Staff",
      status: exercises.length ? "Available" : "Empty",
      evidence: `${exercises.length} exercises; ${reusableExercises} reusable completed packages`,
      href: "/exercises",
      action: "Route to Library",
      tone: exercises.length ? "ready" as const : "open" as const
    },
    {
      title: "Templates & Playbooks",
      description: "Reuse planning checklists, observer guides, hotwash forms, AAR/EXSUM formats, MSEL templates, communications plans, UAS checklists, ICS checklists, invite templates, and POA&M formats.",
      owner: "Planning Cell",
      status: "Starters ready",
      evidence: "Planning checklist, observer guide, MSEL, sync matrix, communications, UAS, ICS, interagency invite, and POA&M templates",
      href: "/advanced",
      action: "Generate draft",
      tone: "ready" as const
    },
    {
      title: "Capability / Gap Knowledge Base",
      description: "Track recurring communications, COP, UAS, airspace, ICS, legal, resource, staffing, training, and doctrine gaps across exercises.",
      owner: "Capability Lead",
      status: capabilityGaps.length ? "Tracking" : "Needs gaps",
      evidence: `${capabilityGaps.length} capability gaps; ${analysis.gaps.length} current exercise gaps`,
      href: "/lessons",
      action: "Close gap",
      tone: capabilityGaps.length ? "friction" as const : "open" as const
    },
    {
      title: "Search / Ask Library",
      description: "Ask across exercises, lessons, POA&M history, templates, findings, evidence, and recurring friction patterns.",
      owner: "All Planners",
      status: repositoryCandidates ? "Review inputs" : "Ready",
      evidence: `${repositoryCandidates} screened repository candidates; ${openPoamHistory} open POA&M items available to carry forward`,
      href: "/ask-exercise",
      action: "Ask",
      tone: repositoryCandidates ? "friction" as const : "ready" as const
    }
  ];

  const issues = [
    {
      severity: "High",
      issue: "Validated lessons need approval and export eligibility",
      owner: "Library Manager",
      status: `${lessonsRepositoryItems.length} records`,
      recommendation: "Approve, sanitize, tag, and mark each lesson as internal, interagency-shareable, or public/unclassified export eligible.",
      href: "/lessons",
      action: "Route to Library",
      tone: "friction" as const
    },
    {
      severity: "Medium",
      issue: "Open POA&M items should carry into future planning",
      owner: "Improvement Cell",
      status: `${openPoamHistory} open`,
      recommendation: "Pull unresolved corrective actions into future readiness gates, objectives, MSEL injects, and re-test plans.",
      href: "/poam",
      action: "Convert to POA&M",
      tone: openPoamHistory ? "friction" as const : "ready" as const
    },
    {
      severity: "Medium",
      issue: "Recurring capability gaps need common taxonomy",
      owner: "Capability Lead",
      status: `${capabilityGaps.length} gaps`,
      recommendation: "Tag gaps by civilian function, capability area, affected agencies, mission area, and recurrence count.",
      href: "/lessons",
      action: "Close gap",
      tone: capabilityGaps.length ? "friction" as const : "open" as const
    },
    {
      severity: "Low",
      issue: "Screened participant intake needs repository disposition",
      owner: "Review Queue",
      status: `${repositoryCandidates} candidates`,
      recommendation: "Convert cleared submissions into lessons, best practices, capability gaps, POA&M items, future injects, or planning considerations.",
      href: "/admin/dropoff",
      action: "Route to Library",
      tone: repositoryCandidates ? "open" as const : "ready" as const
    }
  ];

  const prompts = [
    "Show prior communications gaps from UAS exercises.",
    "Find all lessons related to TAK integration.",
    "What recurring issues affected observer coverage?",
    "Generate a planning checklist based on prior exercise findings.",
    "Find POA&M items still open from previous exercises."
  ];

  return (
    <div className="grid gap-4">
      <PhaseHero
        eyebrow="Library"
        title="Preserve and Reuse Institutional Knowledge"
        question="What should we preserve and reuse?"
        description="Use Library as institutional memory: store lessons, EXSUM/AAR outputs, templates, findings, POA&M history, capability gaps, and future exercise inputs."
        primaryHref="/ask-exercise"
        primaryAction="Search knowledge"
        steps={librarySteps}
      />
      <section className="border-t border-line pt-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-ink">Knowledge Surface</h2>
            <p className="mt-1 text-sm leading-6 text-steel">Find reusable lessons, templates, prior outputs, and carry-forward actions.</p>
          </div>
          <Link href="/ask-exercise" className="text-sm font-semibold text-steel transition hover:text-ink">Ask Library</Link>
        </div>
        <div className="mt-3 border-t border-line">
          {[
            { label: "Search / Ask Library", status: repositoryCandidates ? `${repositoryCandidates} candidates` : "Ready", href: "/ask-exercise" },
            { label: "Recent lessons", status: `${lessonsRepositoryItems.length} records`, href: "/lessons" },
            { label: "Reusable templates", status: "Planning starters", href: "/advanced" },
            { label: "Carry-forward actions", status: `${openPoamHistory} open`, href: "/poam" }
          ].map((item) => (
            <Link key={item.label} href={item.href} className="grid gap-2 border-b border-line py-2 transition hover:text-ink sm:grid-cols-[1fr_auto]">
              <span className="text-sm font-semibold text-ink">{item.label}</span>
              <span className="text-xs text-steel">{item.status}</span>
            </Link>
          ))}
        </div>
      </section>
      <GatePanel
        label="Library Gate"
        status={`${lessonsRepositoryItems.length} repository items`}
        statusTone={lessonsRepositoryItems.length ? "ready" : "friction"}
        risk="Knowledge gets lost when findings, evidence, POA&M outcomes, and screened submissions are not approved, tagged, and made reusable."
        nextAction="Route validated lessons and unresolved POA&M items into searchable planning material for the next exercise."
        actionHref="/lessons"
        actionLabel="Route to Library"
      />
      <IssueTable title="Library Issues" description="Keep the repository clean, screened, searchable, and useful to planners who did not attend the original exercise." issues={issues} />
      <MetricStrip metrics={[
        { label: "Exercises", value: exercises.length, note: "archive records" },
        { label: "Lesson records", value: lessonsRepositoryItems.length, note: "repository items" },
        { label: "Capability gaps", value: capabilityGaps.length, note: "tracked risks" },
        { label: "Open POA&M", value: openPoamHistory, note: "carry-forward actions" }
      ]} />
      <PhaseSectionTable title="Library Workstreams" description="Detailed repository tools stay available here without turning Library into a file dump." sections={sections} />
      <details className="border-t border-line">
        <summary className="cursor-pointer py-2 text-sm text-steel transition hover:text-ink">Example Library prompts</summary>
        <div className="grid gap-2 border-t border-line py-3 md:grid-cols-2">
          {prompts.map((prompt) => (
            <Link key={prompt} href="/ask-exercise" className="border-t border-line px-3 py-2 text-sm font-semibold text-ink transition hover:bg-field">
              {prompt}
            </Link>
          ))}
        </div>
      </details>
      <LifecycleChain items={[
        { label: "Objectives", value: "templates", href: "/objectives" },
        { label: "Observations", value: "archive", href: "/feedback" },
        { label: "Findings", value: capabilityGaps.length, href: "/lessons" },
        { label: "Recommendations", value: analysis.recommendations.length, href: "/analysis" },
        { label: "POA&M", value: poamItems.length, href: "/poam" },
        { label: "Lessons", value: lessonsRepositoryItems.length, href: "/lessons" }
      ]} />
    </div>
  );
}
