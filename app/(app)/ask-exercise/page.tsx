import { MessageCircleQuestion } from "lucide-react";
import { AskExerciseClient } from "@/components/ask-exercise-client";
import { PageTitle } from "@/components/page-title";
import { Panel, PanelHeader } from "@/components/panel";
import { getAppData } from "@/lib/data";

export default async function AskExercisePage() {
  const data = await getAppData();
  const {
    exercise,
    scenario,
    missionAssignment,
    objectives,
    injects,
    syncMatrixEntries,
    evaluatorAssignments,
    decisionPoints,
    feedbackEntries,
    analysis,
    exsum,
    poamItems,
    capabilityGaps,
    evidenceItems
  } = data;

  return (
    <div className="grid gap-6">
      <PageTitle
        eyebrow="Living knowledge base"
        title="Ask the Exercise"
        description="Ask plain-language questions across the exercise record and generate targeted summaries for leaders, organizations, or follow-on planning."
      />

      <Panel>
        <PanelHeader title="Exercise Chat" eyebrow={exercise.name} action={<MessageCircleQuestion className="text-flare" size={20} />} />
        <div className="p-5">
          <AskExerciseClient
            exercisePackage={{
              exercise,
              scenario,
              missionAssignment,
              objectives,
              injects,
              syncMatrixEntries,
              evaluatorAssignments,
              decisionPoints,
              feedbackEntries,
              analysis,
              exsum,
              poamItems,
              capabilityGaps,
              evidenceItems
            }}
          />
        </div>
      </Panel>
    </div>
  );
}
