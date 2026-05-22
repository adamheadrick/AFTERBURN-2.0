import { AiGenerator } from "@/components/ai-generator";
import { ButtonLink, Button } from "@/components/button";
import { PageTitle } from "@/components/page-title";
import { Field, inputStyles, Panel, PanelHeader } from "@/components/panel";
import { getAppData } from "@/lib/data";

function injectsToText(injects: Awaited<ReturnType<typeof getAppData>>["injects"]) {
  return injects
    .map(
      (inject) => `${inject.inject_number} | ${inject.inject_time} | ${inject.inject_type}
Delivered To: ${inject.delivered_to}
Description: ${inject.description}
Expected Action: ${inject.expected_action}
Evaluation Focus: ${inject.evaluation_focus}
Related Objective: ${inject.related_objective}
Related Task: ${inject.related_task}`
    )
    .join("\n\n");
}

export default async function InjectsPage() {
  const { exercise, scenario, objectives, injects } = await getAppData();

  return (
    <div>
      <PageTitle
        eyebrow="Step 5"
        title="Inject List / MSEL Builder"
        description="Create and sequence planned exercise events that test objectives, partner tasking, communications, coordination, and decision-making under pressure."
      />
      <div className="mb-6">
        <Panel>
          <PanelHeader title="Inject List" eyebrow={exercise.name} action={<ButtonLink href="/sync-matrix" variant="ghost">Next: Rehearsal Timeline</ButtonLink>} />
          <div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-4">
            {injects.map((inject) => (
              <div key={inject.id} className="rounded-md border border-line bg-night p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-black text-ember">{inject.inject_time}</p>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-ink">{inject.inject_number}</p>
                </div>
                <h3 className="mt-3 text-base font-black text-ink">{inject.inject_type}</h3>
                <p className="mt-2 text-sm leading-6 text-steel">{inject.expected_action}</p>
                <p className="mt-3 text-xs font-black uppercase tracking-[0.12em] text-ember">{inject.related_objective}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel>
          <PanelHeader title="Recommended Inject Springboard" eyebrow="AI event support" />
          <div className="p-5">
            <AiGenerator
              endpoint="/api/generate-injects"
              buttonLabel="Recommend Injects"
              payload={{ exercise, scenario, objectives }}
              initialOutput={injectsToText(injects)}
              outputLabel="Inject List / MSEL"
              large
            />
          </div>
        </Panel>
        <Panel>
          <PanelHeader title="Manual Inject Entry" eyebrow="Detailed edit" />
          <form className="grid gap-5 p-5">
            <div className="grid gap-5 md:grid-cols-3">
              <Field label="Inject Number"><input className={inputStyles} placeholder="Example: 005" /></Field>
              <Field label="Time"><input className={inputStyles} placeholder="Example: 14:30" /></Field>
              <Field label="Inject Type"><input className={inputStyles} placeholder="Example: Resource shortfall" /></Field>
            </div>
            <Field label="Inject Description"><textarea className={inputStyles} rows={4} placeholder="Describe what happens and what new information is introduced to exercise players." /></Field>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Delivery Method"><input className={inputStyles} placeholder="Example: Controller phone call, WebEOC entry, email, radio traffic, media post" /></Field>
              <Field label="Delivered To"><input className={inputStyles} placeholder="Example: EOC manager, public works, law enforcement, PIO" /></Field>
              <Field label="Expected Action"><input className={inputStyles} placeholder="What should participants do in response?" /></Field>
              <Field label="Evaluation Focus"><input className={inputStyles} placeholder="What should evaluators watch for?" /></Field>
              <Field label="Controller Notes"><input className={inputStyles} placeholder="Escalation notes, timing guidance, or alternate paths." /></Field>
              <Field label="Related Objective"><input className={inputStyles} placeholder="Which objective does this inject test?" /></Field>
            </div>
            <Field label="Related Tasking / Mission Assignment Task"><input className={inputStyles} placeholder="Which partner task or mission assignment does this pressure-test?" /></Field>
            <div><Button variant="ember" type="button">Add Inject</Button></div>
          </form>
        </Panel>
      </div>
    </div>
  );
}
