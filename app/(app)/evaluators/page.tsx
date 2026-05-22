import { ClipboardCheck, Plus } from "lucide-react";
import { Button } from "@/components/button";
import { PageTitle } from "@/components/page-title";
import { Field, inputStyles, Panel, PanelHeader } from "@/components/panel";
import { getAppData } from "@/lib/data";

export default async function EvaluatorsPage() {
  const { exercise, objectives, evaluatorAssignments } = await getAppData();
  const coveredObjectives = new Set(evaluatorAssignments.map((item) => item.objective_focus));
  const uncovered = objectives.filter((objective) => !coveredObjectives.has(objective.title));

  return (
    <div className="grid gap-6">
      <PageTitle
        eyebrow="Observation plan"
        title="Evaluator Coverage"
        description="Assign observers/evaluators so every major objective, function, organization, and time block has someone watching it during execution."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-md border border-line bg-night p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">Evaluator assignments</p>
          <p className="mt-2 text-4xl font-black text-ink">{evaluatorAssignments.length}</p>
        </div>
        <div className="rounded-md border border-line bg-night p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">Objectives covered</p>
          <p className="mt-2 text-4xl font-black text-ink">{coveredObjectives.size}</p>
        </div>
        <div className="rounded-md border border-line bg-night p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">Coverage gaps</p>
          <p className="mt-2 text-4xl font-black text-ink">{uncovered.length}</p>
        </div>
      </section>

      <Panel>
        <PanelHeader title="Coverage Matrix" eyebrow={exercise.name} action={<ClipboardCheck className="text-flare" size={20} />} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-[0.14em] text-steel">
              <tr>
                <th className="px-5 py-3">Evaluator</th>
                <th className="px-5 py-3">Function / Lane</th>
                <th className="px-5 py-3">Organization</th>
                <th className="px-5 py-3">Time Block</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3">Objective</th>
                <th className="px-5 py-3">Observation Focus</th>
                <th className="px-5 py-3">Collection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {evaluatorAssignments.map((assignment) => (
                <tr key={assignment.id} className="align-top hover:bg-field">
                  <td className="px-5 py-4 font-black text-ink">{assignment.evaluator_name}</td>
                  <td className="px-5 py-4 text-steel">{assignment.assigned_lane}</td>
                  <td className="px-5 py-4 text-steel">{assignment.assigned_entity}</td>
                  <td className="px-5 py-4 text-flare">{assignment.time_block}</td>
                  <td className="px-5 py-4 text-steel">{assignment.location}</td>
                  <td className="px-5 py-4 text-steel">{assignment.objective_focus}</td>
                  <td className="px-5 py-4 text-steel">{assignment.observation_focus}</td>
                  <td className="px-5 py-4 text-steel">{assignment.collection_method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <Panel>
          <PanelHeader title="Coverage Gaps" eyebrow="Objectives without named evaluator coverage" />
          <div className="grid gap-3 p-5 md:grid-cols-2">
            {uncovered.length ? uncovered.map((objective) => (
              <div key={objective.id} className="rounded-md border border-line bg-night p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">{objective.core_capability}</p>
                <h2 className="mt-2 text-lg font-black text-ink">{objective.title}</h2>
                <p className="mt-2 text-sm leading-6 text-steel">{objective.evaluation_criteria}</p>
              </div>
            )) : (
              <p className="text-sm font-semibold text-ink">Every current objective has evaluator coverage.</p>
            )}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Add Assignment" eyebrow="Coverage input" />
          <form className="grid gap-4 p-5">
            <Field label="Evaluator name"><input className={inputStyles} placeholder="Enter evaluator or observer name" /></Field>
            <Field label="Assigned function / lane"><input className={inputStyles} placeholder="Enter lane, branch, function, or operating area" /></Field>
            <Field label="Assigned organization"><input className={inputStyles} placeholder="Enter the organization being observed or supported" /></Field>
            <Field label="Time block"><input className={inputStyles} placeholder="Enter the time block or phase" /></Field>
            <Field label="Required observation focus"><textarea className={inputStyles} rows={4} placeholder="Describe exactly what this evaluator should watch for and what evidence should be captured." /></Field>
            <Button variant="ember" type="button"><Plus size={17} /> Add Evaluator</Button>
          </form>
        </Panel>
      </section>
    </div>
  );
}
