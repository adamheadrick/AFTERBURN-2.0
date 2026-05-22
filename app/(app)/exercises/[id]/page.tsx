import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/button";
import { PageTitle } from "@/components/page-title";
import { Panel, PanelHeader } from "@/components/panel";
import { ExerciseStatusBadge, PriorityBadge } from "@/components/status-badge";
import { getExercise } from "@/lib/data";

export default async function ExerciseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { exercise, scenario, missionAssignment, objectives, injects, feedbackEntries, poamItems } = await getExercise(id);

  if (!exercise) {
    notFound();
  }

  return (
    <div>
      <PageTitle
        eyebrow="Exercise Workspace"
        title={exercise.name}
        description={`${exercise.exercise_type} / ${exercise.scenario_category} / Lead: ${exercise.lead_org}`}
      />
      <div className="mb-6 flex flex-wrap gap-3">
        <ExerciseStatusBadge status={exercise.status} />
        <ButtonLink href="/scenario-builder" variant="subtle">Scenario</ButtonLink>
        <ButtonLink href="/mission-assignment" variant="subtle">Tasking</ButtonLink>
        <ButtonLink href="/feedback" variant="subtle">Feedback</ButtonLink>
        <ButtonLink href="/exsum" variant="ember">Summary / AAR</ButtonLink>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="grid gap-6">
          <Panel>
            <PanelHeader title="Scenario Narrative" />
            <p className="p-5 text-sm leading-7 text-steel">{scenario.generated_narrative}</p>
          </Panel>
          <Panel>
            <PanelHeader title="Tasking / Mission Assignment" eyebrow={missionAssignment.mission_number} />
            <div className="grid gap-3 p-5 text-sm leading-6 text-steel">
              <p className="font-semibold text-ink">{missionAssignment.mission_statement}</p>
              <p>{missionAssignment.purpose}</p>
              <ul className="grid gap-2">
                {missionAssignment.tasks.map((task) => <li key={task}>- {task}</li>)}
              </ul>
            </div>
          </Panel>
          <Panel>
            <PanelHeader title="Feedback Signal" />
            <div className="divide-y divide-line">
              {feedbackEntries.map((entry) => (
                <div key={entry.id} className="grid gap-3 p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ink">{entry.operational_lane}</span>
                    <PriorityBadge priority={entry.priority} />
                  </div>
                  <p className="text-sm leading-6 text-steel">{entry.what_happened}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
        <aside className="grid h-fit gap-6">
          <Panel>
            <PanelHeader title="Objectives" />
            <div className="divide-y divide-line">
              {objectives.map((objective) => (
                <div key={objective.id} className="p-4">
                  <p className="text-sm font-black text-ink">{objective.title}</p>
                  <p className="mt-1 text-xs text-steel">{objective.core_capability}</p>
                </div>
              ))}
            </div>
          </Panel>
          <Panel>
            <PanelHeader title="Injects" />
            <div className="divide-y divide-line">
              {injects.map((inject) => (
                <div key={inject.id} className="p-4">
                  <p className="text-sm font-black text-ink">{inject.inject_number} / {inject.inject_time}</p>
                  <p className="mt-1 text-xs leading-5 text-steel">{inject.description}</p>
                </div>
              ))}
            </div>
          </Panel>
          <Panel>
            <PanelHeader title="Open Improvement Items" />
            <div className="divide-y divide-line">
              {poamItems.map((item) => (
                <div key={item.id} className="p-4">
                  <p className="text-sm font-black text-ink">{item.finding_id}</p>
                  <p className="mt-1 text-xs leading-5 text-steel">{item.corrective_action}</p>
                </div>
              ))}
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}
