import { ShieldAlert } from "lucide-react";
import { AiGenerator } from "@/components/ai-generator";
import { PageTitle } from "@/components/page-title";
import { Panel, PanelHeader } from "@/components/panel";
import { getAppData } from "@/lib/data";

export default async function RedTeamPage() {
  const data = await getAppData();
  const { exercise, scenario, missionAssignment, objectives, injects, syncMatrixEntries, evaluatorAssignments, decisionPoints } = data;

  return (
    <div className="grid gap-6">
      <PageTitle
        eyebrow="Exercise design challenge"
        title="AI Exercise Check"
        description="Use AI to challenge assumptions, identify missing realism, expose safety or evaluation blind spots, and strengthen the package before execution."
      />

      <Panel>
        <PanelHeader title="Exercise Check" eyebrow={exercise.name} action={<ShieldAlert className="text-flare" size={20} />} />
        <div className="p-5">
          <AiGenerator
            endpoint="/api/red-team-exercise"
            buttonLabel="Check This Exercise"
            payload={{ exercise, scenario, missionAssignment, objectives, injects, syncMatrixEntries, evaluatorAssignments, decisionPoints }}
            initialOutput="Run an exercise check to identify unrealistic assumptions, missing organizations, weak injects, underdeveloped decision points, safety gaps, communications vulnerabilities, authority issues, evaluation blind spots, and places where the exercise may not test the stated objectives."
            outputLabel="Exercise Check Findings"
            large
          />
        </div>
      </Panel>
    </div>
  );
}
