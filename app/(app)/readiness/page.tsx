import { AlertTriangle, CheckCircle2, Gauge, ShieldAlert } from "lucide-react";
import { AiGenerator } from "@/components/ai-generator";
import { ButtonLink } from "@/components/button";
import { OutputQualityGate } from "@/components/output-quality-gate";
import { PageTitle } from "@/components/page-title";
import { Panel, PanelHeader } from "@/components/panel";
import { getAppData } from "@/lib/data";

export default async function ReadinessPage() {
  const data = await getAppData();
  const {
    exercise,
    scenario,
    missionAssignment,
    objectives,
    injects,
    syncMatrixEntries,
    readinessScore,
    evaluatorAssignments,
    decisionPoints,
    feedbackEntries,
    evidenceItems,
    poamItems
  } = data;

  const dimensions = [
    ["Scenario clarity", scenario.generated_narrative ? "Strong" : "Needs input"],
    ["Objectives", `${objectives.length} defined`],
    ["Tasking / mission assignment", missionAssignment.mission_number],
    ["Rehearsal timeline", `${syncMatrixEntries.length} rows`],
    ["Evaluator coverage", `${evaluatorAssignments.length} assignments`],
    ["Decision points", `${decisionPoints.length} tracked`]
  ];

  const readinessText = `Readiness Score: ${readinessScore.score}% - ${readinessScore.label}

${readinessScore.summary}

Strengths:
- ${readinessScore.strengths.join("\n- ")}

Friction Points:
- ${readinessScore.friction_points.join("\n- ")}

Missing Inputs:
- ${readinessScore.missing_inputs.join("\n- ")}

Recommendations:
- ${readinessScore.recommendations.join("\n- ")}`;

  return (
    <div className="grid gap-6">
      <PageTitle
        eyebrow="Pre-event gate"
        title="Readiness and Output Quality"
        description="Assess whether the exercise is ready to run and whether the record is strong enough to produce a useful AAR and improvement plan."
      />

      <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Panel>
          <PanelHeader title="Current Readiness" eyebrow={exercise.name} action={<Gauge className="text-flare" size={22} />} />
          <div className="p-5">
            <div className="rounded-md border border-flare/50 bg-flare/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-flare">AI readiness score</p>
              <p className="mt-3 text-6xl font-black text-ink">{readinessScore.score}%</p>
              <p className="mt-2 text-xl font-black text-flare">{readinessScore.label}</p>
              <p className="mt-4 text-sm font-semibold leading-6 text-ink">{readinessScore.summary}</p>
            </div>
            <div className="mt-4 grid gap-2">
              {dimensions.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3 rounded-md border border-line bg-panel p-3 text-sm">
                  <span className="font-bold text-ink">{label}</span>
                  <span className="font-black text-flare">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel>
        <PanelHeader title="Readiness Detail" eyebrow="Execution risk" action={<ButtonLink href="/red-team" variant="ghost">AI Exercise Check</ButtonLink>} />
          <div className="grid gap-4 p-5 lg:grid-cols-3">
            <div className="rounded-md border border-line bg-night p-4">
              <CheckCircle2 className="text-signal" size={20} />
              <h2 className="mt-3 text-lg font-black text-ink">Strengths</h2>
              <ul className="mt-3 grid gap-2 text-sm leading-6 text-steel">
                {readinessScore.strengths.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div className="rounded-md border border-line bg-night p-4">
              <AlertTriangle className="text-ember" size={20} />
              <h2 className="mt-3 text-lg font-black text-ink">Friction</h2>
              <ul className="mt-3 grid gap-2 text-sm leading-6 text-steel">
                {readinessScore.friction_points.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div className="rounded-md border border-line bg-night p-4">
              <ShieldAlert className="text-flare" size={20} />
              <h2 className="mt-3 text-lg font-black text-ink">Missing Inputs</h2>
              <ul className="mt-3 grid gap-2 text-sm leading-6 text-steel">
                {readinessScore.missing_inputs.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        </Panel>
      </section>

      <OutputQualityGate
        objectives={objectives}
        evaluatorAssignments={evaluatorAssignments}
        syncMatrixEntries={syncMatrixEntries}
        feedbackEntries={feedbackEntries}
        decisionPoints={decisionPoints}
        evidenceItems={evidenceItems}
        poamItems={poamItems}
      />

      <Panel>
        <PanelHeader title="AI Readiness Assessment" eyebrow="Generate / regenerate" />
        <div className="p-5">
          <AiGenerator
            endpoint="/api/generate-readiness-score"
            buttonLabel="Generate Readiness Score"
            payload={{ exercise, scenario, missionAssignment, objectives, injects, syncMatrixEntries, evaluatorAssignments, decisionPoints }}
            initialOutput={readinessText}
            outputLabel="Readiness Assessment"
            large
          />
        </div>
      </Panel>
    </div>
  );
}
