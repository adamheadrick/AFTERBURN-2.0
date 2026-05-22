import { SyncMatrixClient } from "@/components/sync-matrix-client";
import { ButtonLink } from "@/components/button";
import { PageTitle } from "@/components/page-title";
import { Panel, PanelHeader } from "@/components/panel";
import { getAppData } from "@/lib/data";

export default async function SyncMatrixPage() {
  const data = await getAppData();
  const { exercise, scenario, missionAssignment, objectives, injects, syncMatrixEntries } = data;
  const participatingOrganizations = Array.from(
    new Set([exercise.lead_org, ...exercise.supporting_orgs, missionAssignment.supporting_agency].filter(Boolean))
  );

  return (
    <div>
      <PageTitle
        eyebrow="Step 6"
        title="Rehearsal Timeline / Sync Matrix"
        description="Build the rehearsal script: each time block shows participating organization tasks, purpose, personnel, locations, reporting, expected outputs, and gaps."
      />
      <Panel>
        <PanelHeader title="Execution Timeline" eyebrow={exercise.name} action={<ButtonLink href="/feedback" variant="ghost">Next: Feedback</ButtonLink>} />
        <div className="p-5">
          <SyncMatrixClient
            exerciseId={exercise.id}
            initialEntries={syncMatrixEntries}
            participatingOrganizations={participatingOrganizations}
            aiPayload={{ exercise, scenario, missionAssignment, objectives, injects, syncMatrixEntries }}
          />
        </div>
      </Panel>
    </div>
  );
}
