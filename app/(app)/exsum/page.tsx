import { Download, FileText, Pencil } from "lucide-react";
import { AiGenerator } from "@/components/ai-generator";
import { AarBreakdown } from "@/components/aar-breakdown";
import { ButtonLink, Button } from "@/components/button";
import { PageTitle } from "@/components/page-title";
import { Panel, PanelHeader } from "@/components/panel";
import { getAppData } from "@/lib/data";

export default async function ExsumPage() {
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
    analysis,
    exsum,
    poamItems,
    evidenceItems
  } = data;

  return (
    <div>
      <PageTitle
        eyebrow="Step 9"
        title="Executive Summary / AAR Generator"
        description="Generate an all-participant executive summary, then break findings down by category, function, and organization for partner-specific AAR reviews."
      />
      <div className="mb-6">
        <Panel>
          <PanelHeader title="AAR Review Breakouts" eyebrow="All participants, categories, and organizations" />
          <div className="p-5">
            <AarBreakdown feedbackEntries={feedbackEntries} syncMatrixEntries={syncMatrixEntries} />
          </div>
        </Panel>
      </div>
      <Panel>
        <PanelHeader
          title="AFTERBURN Executive Summary"
          eyebrow={exercise.name}
          action={
            <div className="flex flex-wrap gap-2">
              <Button variant="subtle" type="button"><Pencil size={16} /> Edit</Button>
              <Button variant="ghost" type="button"><Download size={16} /> Export to Word</Button>
              <Button variant="ghost" type="button"><FileText size={16} /> Export to PDF</Button>
              <ButtonLink href="/poam" variant="ghost">Next: Improvement Plan</ButtonLink>
            </div>
          }
        />
        <div className="p-5">
          <AiGenerator
              endpoint="/api/generate-exsum"
              buttonLabel="Generate Executive Summary"
              payload={{ exercise, scenario, missionAssignment, objectives, injects, syncMatrixEntries, readinessScore, evaluatorAssignments, decisionPoints, feedbackEntries, analysis, poamItems, evidenceItems }}
              initialOutput={exsum.content}
            outputLabel="Executive Summary / AAR Content"
            large
          />
          <p className="mt-3 text-xs text-steel">Export controls are visible for workflow review. Word/PDF generation can be connected after the AAR content model is finalized.</p>
        </div>
      </Panel>
    </div>
  );
}
