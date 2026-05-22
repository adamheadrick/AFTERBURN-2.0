import { UserRoundCheck } from "lucide-react";
import { ButtonLink } from "@/components/button";
import { PageTitle } from "@/components/page-title";
import { Panel, PanelHeader } from "@/components/panel";
import { getAppData } from "@/lib/data";

export default async function ParticipantPortalPage() {
  const { exercise, scenario, syncMatrixEntries, feedbackEntries } = await getAppData();
  const organization = exercise.supporting_orgs[0] || "Selected organization";
  const organizationRows = syncMatrixEntries.filter((row) => row.organization === organization);

  return (
    <div className="grid gap-6">
      <PageTitle
        eyebrow="Role-based access"
        title="Partner Access"
        description="A lightweight participant view with exercise overview, organization tasks, rehearsal script excerpts, feedback forms, and released products."
      />

      <Panel>
        <PanelHeader title={`${organization} View`} eyebrow={exercise.name} action={<UserRoundCheck className="text-flare" size={20} />} />
        <div className="grid gap-5 p-5 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">{exercise.scenario_category || "Participant view"}</p>
            <h2 className="mt-2 text-2xl font-black text-ink">{exercise.name}</h2>
            <p className="mt-3 text-sm leading-6 text-steel">
              {scenario.generated_narrative || "Participant-facing overview will appear here after the exercise scenario and released instructions are added."}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink href="/feedback" variant="flame">Submit Feedback</ButtonLink>
              <ButtonLink href="/sync-matrix" variant="subtle">View Timeline</ButtonLink>
              <ButtonLink href="/exsum" variant="ghost">Released Summary</ButtonLink>
            </div>
          </div>
          <div className="rounded-md border border-line bg-night p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">Participant scope</p>
            <ul className="mt-3 grid gap-2 text-sm font-semibold leading-6 text-ink">
              <li>Exercise overview</li>
              <li>Assigned organization tasks</li>
              <li>Relevant rehearsal timeline rows</li>
              <li>Rehearsal script excerpts</li>
              <li>Feedback and hotwash prompts</li>
              <li>Final products released by planners</li>
            </ul>
          </div>
        </div>
      </Panel>

      <Panel>
        <PanelHeader title="Organization Task Script" eyebrow="Rehearsal-ready excerpts" />
        <div className="grid gap-4 p-5">
          {organizationRows.map((row) => (
            <div key={row.id} className="rounded-md border border-line bg-night p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">{row.time_block} | {row.location_lane}</p>
              <h3 className="mt-2 text-lg font-black text-ink">{row.task}</h3>
              <p className="mt-2 text-sm leading-6 text-steel"><span className="font-black text-ink">Purpose:</span> {row.purpose}</p>
              <p className="mt-2 text-sm leading-6 text-steel"><span className="font-black text-ink">Personnel / assets:</span> {row.boots_on_ground} personnel | {row.equipment_assets}</p>
              <p className="mt-2 text-sm leading-6 text-steel"><span className="font-black text-ink">Report:</span> {row.communications_reporting}</p>
            </div>
          ))}
          {organizationRows.length === 0 ? (
            <div className="rounded-md border border-line bg-night p-4">
              <h3 className="text-lg font-black text-ink">No organization task rows yet</h3>
              <p className="mt-2 text-sm leading-6 text-steel">Add participating organizations and sync matrix rows to create entity-specific rehearsal scripts.</p>
            </div>
          ) : null}
          <div className="rounded-md border border-line bg-panel p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">Feedback prompts</p>
            <p className="mt-2 text-sm leading-6 text-ink">Existing feedback entries: {feedbackEntries.length}. Participants see only forms and released products in a production role model.</p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
