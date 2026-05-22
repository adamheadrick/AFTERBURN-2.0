import { AlertTriangle, Brain, ClipboardCheck, FileText, MapPinned, Plus, RadioTower, Route, ShieldAlert, Table2 } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/button";
import { Panel, PanelHeader } from "@/components/panel";
import { PhaseReadiness } from "@/components/phase-readiness";
import { ExerciseStatusBadge, PriorityBadge, PoamStatusBadge } from "@/components/status-badge";
import { getAppData } from "@/lib/data";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export default async function DashboardPage() {
  const data = await getAppData();
  const {
    exercises,
    exercise,
    scenario,
    missionAssignment,
    objectives,
    injects,
    feedbackEntries,
    syncMatrixEntries,
    readinessScore,
    evaluatorAssignments,
    decisionPoints,
    analysis,
    exsum,
    poamItems,
    error
  } = data;
  const draftScenarios = exercises.filter((item) => ["draft", "scenario"].includes(item.status)).length;
  const missionGenerated = exercises.filter((item) => ["mission", "feedback", "analysis", "exsum", "complete"].includes(item.status)).length;
  const openPoam = poamItems.filter((item) => item.status !== "complete").length;
  const syncGaps = syncMatrixEntries.filter((item) => item.status === "gap" || item.status === "unassigned" || !item.organization).length;
  const evaluatorGaps = Math.max(0, objectives.length - new Set(evaluatorAssignments.map((item) => item.objective_focus)).size);
  const pendingDecisions = decisionPoints.filter((item) => item.status !== "decided").length;
  const exsumStatus = exsum?.updated_at ? `Updated ${formatDate(exsum.updated_at)}` : "Not generated";

  const cards = [
    { label: "Readiness Score", value: `${readinessScore.score}%`, icon: ShieldAlert, note: readinessScore.label },
    { label: "Total Exercises", value: exercises.length, icon: ClipboardCheck, note: "Across planning portfolio" },
    { label: "Tasking Products", value: missionGenerated, icon: Route, note: missionAssignment.mission_number },
    { label: "Injects", value: injects.length, icon: RadioTower, note: `${draftScenarios} draft scenario` },
    { label: "Timeline Gaps", value: syncGaps, icon: Table2, note: "Timeline items needing attention" },
    { label: "Open Improvements", value: openPoam, icon: ShieldAlert, note: "Corrective actions" }
  ];

  const attentionQueue = [
    {
      label: "Sync gaps",
      value: syncGaps,
      text: syncGaps ? "Assign leads or resolve unassigned time blocks before rehearsal." : "Time blocks are aligned.",
      href: "/sync-matrix",
      icon: Table2
    },
    {
      label: "Evaluator gaps",
      value: evaluatorGaps,
      text: evaluatorGaps ? "Assign observer/controller coverage for uncovered objectives." : "Major objectives have evaluator coverage.",
      href: "/evaluators",
      icon: ClipboardCheck
    },
    {
      label: "Decision points",
      value: pendingDecisions,
      text: pendingDecisions ? "Clarify authorities, time windows, and expected evidence before play." : "Decision points are captured.",
      href: "/decision-points",
      icon: AlertTriangle
    }
  ];

  const workflow = [
    {
      phase: "Plan",
      title: "Build the exercise",
      text: "Frame the scenario, partner tasking, and objectives before exercise play.",
      href: "/plan",
      action: "Continue planning",
      icon: MapPinned
    },
    {
      phase: "Event",
      title: "Run the event",
      text: "Use injects and the rehearsal timeline to see hour-by-hour task, purpose, and resource alignment.",
      href: "/sync-matrix",
      action: "Open timeline",
      icon: Table2
    },
    {
      phase: "Review",
      title: "Generate the AAR",
      text: "Analyze feedback, produce the executive summary/AAR, and turn findings into improvement items.",
      href: "/review",
      action: "Review summary",
      icon: FileText
    }
  ];

  return (
    <div className="grid gap-6">
      <section className="surface-soft grid gap-5 rounded-md border border-line p-6 shadow-panel xl:grid-cols-[1fr_380px]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-flare">Operational dashboard</p>
          <h1 className="mt-3 text-3xl font-black text-ink sm:text-4xl">{exercise.name}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-steel">
            One clean path from concept to mission planning, execution synchronization, feedback collection, assessment,
            and corrective action.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-[auto_auto_1fr]">
            <ButtonLink href="/scenario-builder" variant="flame">
              <Brain size={18} />
              Continue Workflow
            </ButtonLink>
            <ButtonLink href="/exercises/new" variant="subtle">
              <Plus size={18} />
              Create Exercise
            </ButtonLink>
            <ButtonLink href="/readiness" variant="ghost">
              Readiness Score
            </ButtonLink>
            <div className="hidden min-w-0 items-center rounded-md border border-line bg-night px-4 py-2 text-sm text-steel lg:flex">
            <span className="truncate">Latest summary: <span className="font-black text-ink">{exsumStatus}</span></span>
            </div>
          </div>
        </div>
        <div className="grid gap-3 rounded-md border border-line bg-night p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-black text-ink">Current exercise</span>
            <ExerciseStatusBadge status={exercise.status} />
          </div>
          <div className="rounded-md border border-line bg-panel p-3">
            <p className="text-2xl font-black text-flare">{readinessScore.score}% | {readinessScore.label}</p>
            <p className="mt-2 text-sm leading-6 text-steel">{readinessScore.summary}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md border border-line bg-panel p-3">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-steel">Date</p>
              <p className="mt-1 text-sm font-black text-ink">{formatDate(exercise.date)}</p>
            </div>
            <div className="rounded-md border border-line bg-panel p-3">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-steel">Lead</p>
              <p className="mt-1 truncate text-sm font-black text-ink">{exercise.lead_org}</p>
            </div>
          </div>
        </div>
      </section>

      {error ? <div className="rounded-md border border-flare/30 bg-flare/10 p-4 text-sm font-semibold text-ink">{error}</div> : null}

      <PhaseReadiness
        exercise={exercise}
        scenario={scenario}
        missionAssignment={missionAssignment}
        objectives={objectives}
        injects={injects}
        syncMatrixEntries={syncMatrixEntries}
        feedbackEntries={feedbackEntries}
        analysis={analysis}
        exsum={exsum}
        poamItems={poamItems}
      />

      <section className="grid gap-3 lg:grid-cols-3">
        {attentionQueue.map((item) => (
          <Link key={item.label} href={item.href} className="rounded-md border border-line bg-night p-4 hover:border-flare/60 hover:bg-field">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">{item.label}</p>
                <p className="mt-2 text-3xl font-black text-ink">{item.value}</p>
              </div>
              <item.icon className="text-ember" size={19} />
            </div>
            <p className="mt-3 text-sm leading-6 text-steel">{item.text}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {workflow.map((item) => (
          <Link key={item.phase} href={item.href} className="surface-soft rounded-md border border-line p-4 hover:border-flare/70 hover:bg-field">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-flare">{item.phase}</p>
              <item.icon className="text-ember" size={19} />
            </div>
            <h2 className="mt-3 text-lg font-black text-ink">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-steel">{item.text}</p>
            <p className="mt-4 text-sm font-black text-flare">{item.action}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {cards.map((card) => (
          <div key={card.label} className="rounded-md border border-line bg-night p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-[0.1em] text-steel">{card.label}</p>
              <card.icon className="text-ember" size={17} />
            </div>
            <p className="mt-3 text-3xl font-black text-ink">{card.value}</p>
            <p className="mt-2 text-xs leading-5 text-steel">{card.note}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_390px]">
        <Panel>
          <PanelHeader title="Recent Exercises" eyebrow="Planning portfolio" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-line text-xs uppercase tracking-[0.14em] text-steel">
                <tr>
                  <th className="px-5 py-3">Exercise Name</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Scenario Type</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Lead Agency</th>
                  <th className="px-5 py-3">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {exercises.map((item) => (
                  <tr key={item.id} className="hover:bg-field">
                    <td className="px-5 py-4 font-bold text-ink">
                      <Link href={`/exercises/${item.id}`}>{item.name}</Link>
                    </td>
                    <td className="px-5 py-4 text-steel">{formatDate(item.date)}</td>
                    <td className="px-5 py-4 text-steel">{item.scenario_category}</td>
                    <td className="px-5 py-4"><ExerciseStatusBadge status={item.status} /></td>
                    <td className="px-5 py-4 text-steel">{item.lead_org}</td>
                    <td className="px-5 py-4 text-steel">{formatDate(item.updated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <aside className="grid h-fit gap-6">
          <Panel>
            <PanelHeader title="High Priority Feedback" eyebrow="Controller signal" action={<AlertTriangle className="text-ember" size={20} />} />
            <div className="divide-y divide-line">
              {feedbackEntries.slice(0, 3).map((entry) => (
                <div key={entry.id} className="grid gap-3 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <PriorityBadge priority={entry.priority} />
                    <span className="text-xs font-bold text-steel">{entry.operational_lane}</span>
                  </div>
                  <p className="text-sm font-semibold leading-6 text-ink">{entry.capability_gap}</p>
                  <p className="text-sm leading-6 text-steel">{entry.recommended_corrective_action}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
          <PanelHeader title="Open Improvements" eyebrow="Corrective action tracker" />
            <div className="divide-y divide-line">
              {poamItems.slice(0, 3).map((item) => (
                <Link key={item.id} href="/poam" className="block p-5 hover:bg-field">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-black text-ink">{item.finding_id}</span>
                    <PoamStatusBadge status={item.status} />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-steel">{item.corrective_action}</p>
                </Link>
              ))}
            </div>
          </Panel>
        </aside>
      </section>
    </div>
  );
}
