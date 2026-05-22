import { AiGenerator } from "@/components/ai-generator";
import { ButtonLink } from "@/components/button";
import { FeedbackExplorer } from "@/components/feedback-explorer";
import { PageTitle } from "@/components/page-title";
import { Panel, PanelHeader } from "@/components/panel";
import { getAppData } from "@/lib/data";

function analysisToText(analysis: Awaited<ReturnType<typeof getAppData>>["analysis"]) {
  return `Top Themes:
${analysis.themes.map((item) => `- ${item}`).join("\n")}

Sustains:
${analysis.sustains.map((item) => `- ${item}`).join("\n")}

Improves:
${analysis.improves.map((item) => `- ${item}`).join("\n")}

Capability Gaps:
${analysis.gaps.map((item) => `- ${item}`).join("\n")}

Recommended Corrective Actions:
${analysis.recommendations.map((item) => `- ${item}`).join("\n")}

Draft Improvement Plan / POA&M Items:
${analysis.poam_recommendations.map((item) => `- ${item}`).join("\n")}`;
}

export default async function AnalysisPage() {
  const { exercise, scenario, missionAssignment, objectives, injects, feedbackEntries, analysis } = await getAppData();
  const sections = [
    ["Top themes", analysis.themes],
    ["Repeated friction points", feedbackEntries.map((entry) => entry.friction)],
    ["High-priority gaps", analysis.gaps],
    ["Sustains", analysis.sustains],
    ["Improves", analysis.improves],
    ["Interagency coordination gaps", feedbackEntries.map((entry) => entry.interagency_issue)],
    ["Communications gaps", feedbackEntries.map((entry) => entry.communication_issue)],
    ["Resource gaps", feedbackEntries.map((entry) => entry.resource_shortfall)],
    ["Command and control gaps", feedbackEntries.map((entry) => entry.command_control_issue)],
    ["Recommended corrective actions", analysis.recommendations],
    ["Draft improvement plan items", analysis.poam_recommendations]
  ];

  return (
    <div>
      <PageTitle
        eyebrow="Step 8"
        title="Feedback Analysis"
        description="Synthesize evaluator and participant feedback into themes, repeated friction points, capability gaps, strengths to keep, issues to improve, and recommended corrective actions."
      />
      <div className="mb-6">
        <Panel>
          <PanelHeader title="Filter Feedback Signal" eyebrow="Who reported it and who was affected" />
          <div className="p-5">
            <FeedbackExplorer entries={feedbackEntries} />
          </div>
        </Panel>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Panel>
          <PanelHeader title="Findings Dashboard" eyebrow={exercise.name} />
          <div className="grid gap-3 p-5">
            {sections.map(([title, items]) => (
              <details key={title as string} className="rounded-md border border-line bg-night p-4" open={title === "Top themes"}>
                <summary className="cursor-pointer text-sm font-black text-ink">{title as string}</summary>
                <ul className="mt-3 grid gap-2 text-sm leading-6 text-steel">
                  {(items as string[]).map((item) => <li key={item}>- {item}</li>)}
                </ul>
              </details>
            ))}
          </div>
        </Panel>
        <Panel>
          <PanelHeader title="Generated Analysis" eyebrow="AI synthesis" action={<ButtonLink href="/exsum" variant="ghost">Next: Executive Summary</ButtonLink>} />
          <div className="p-5">
            <AiGenerator
              endpoint="/api/analyze-feedback"
              buttonLabel="Analyze Feedback"
              payload={{ exercise, scenario, missionAssignment, objectives, injects, feedbackEntries }}
              initialOutput={analysisToText(analysis)}
              outputLabel="Feedback Analysis"
              large
            />
          </div>
        </Panel>
      </div>
    </div>
  );
}
