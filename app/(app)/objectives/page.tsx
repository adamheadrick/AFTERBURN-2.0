import { AiGenerator } from "@/components/ai-generator";
import { ButtonLink, Button } from "@/components/button";
import { PageTitle } from "@/components/page-title";
import { Field, inputStyles, Panel, PanelHeader } from "@/components/panel";
import { getAppData } from "@/lib/data";

const suggestedObjectives = [
  "Validate command and control structure",
  "Assess interagency communication",
  "Evaluate resource request process",
  "Test common operating picture development",
  "Assess operational reporting",
  "Identify capability gaps",
  "Evaluate partner tasking / mission assignment execution",
  "Capture improvement plan items"
];

export default async function ObjectivesPage() {
  const { exercise, scenario, missionAssignment, objectives } = await getAppData();
  const objectiveSpringboard = suggestedObjectives.map((item, index) => `Objective ${index + 1}: ${item}`).join("\n");

  return (
    <div>
      <PageTitle
        eyebrow="Step 4"
        title="Exercise Objectives"
        description="Define measurable objectives tied to capabilities, partner organizations, evaluation criteria, success indicators, and assigned tasks."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Panel>
          <PanelHeader title="Objective Builder" eyebrow="Evaluation design" action={<ButtonLink href="/injects" variant="ghost">Next: Injects</ButtonLink>} />
          <form className="grid gap-5 p-5">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Objective Title"><input className={inputStyles} placeholder="Example: Validate resource request process" /></Field>
              <Field label="Core Capability"><input className={inputStyles} placeholder="Example: Operational Coordination" /></Field>
              <Field label="Associated Organization"><input className={inputStyles} placeholder="Example: County Emergency Management" /></Field>
              <Field label="Related Tasking / Mission Assignment Task"><input className={inputStyles} placeholder="Example: Request, approve, and track mutual aid support" /></Field>
            </div>
            <Field label="Objective Description"><textarea className={inputStyles} rows={4} placeholder="Describe what the exercise should test and why it matters." /></Field>
            <Field label="Evaluation Criteria"><textarea className={inputStyles} rows={4} placeholder="Describe what evaluators should watch for during the exercise." /></Field>
            <Field label="Success Indicators"><textarea className={inputStyles} rows={4} placeholder="Describe what good performance should look like." /></Field>
            <div><Button variant="ember" type="button">Add Objective</Button></div>
          </form>
        </Panel>
        <aside className="grid h-fit gap-6">
          <Panel>
            <PanelHeader title="Recommended Objective Springboard" eyebrow="AI suggestions" />
            <div className="p-5">
              <AiGenerator
                endpoint="/api/generate-objectives"
                buttonLabel="Recommend Objectives"
                payload={{ exercise, scenario, missionAssignment }}
                initialOutput={objectiveSpringboard}
                outputLabel="Suggested Objectives"
              />
            </div>
          </Panel>
          <Panel>
            <PanelHeader title="Current Objectives" />
            <div className="divide-y divide-line">
              {objectives.map((objective) => (
                <div key={objective.id} className="p-5">
                  <p className="font-black text-ink">{objective.title}</p>
                  <p className="mt-2 text-sm leading-6 text-steel">{objective.description}</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-ember">{objective.core_capability}</p>
                </div>
              ))}
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}
