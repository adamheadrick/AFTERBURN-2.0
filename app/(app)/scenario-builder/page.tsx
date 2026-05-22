import { AiGenerator } from "@/components/ai-generator";
import { ButtonLink } from "@/components/button";
import { PageTitle } from "@/components/page-title";
import { Field, inputStyles, Panel, PanelHeader } from "@/components/panel";
import { getAppData } from "@/lib/data";

export default async function ScenarioBuilderPage() {
  const { exercise, scenario } = await getAppData();

  return (
    <div>
      <PageTitle
        eyebrow="Step 2"
        title="Scenario Builder"
        description="Customize the situation, hazard, affected population, community impacts, partner coordination challenges, assumptions, and desired end state."
      />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel>
          <PanelHeader title="Scenario Inputs" eyebrow={exercise.name} />
          <div className="grid gap-5 p-5">
            <Field label="Situation"><textarea className={inputStyles} rows={4} defaultValue={scenario.situation} placeholder="Describe the current situation the exercise will present to participants." /></Field>
            <Field label="Background"><textarea className={inputStyles} rows={4} defaultValue={scenario.background} placeholder="Add relevant community, agency, infrastructure, seasonal, or prior-event context." /></Field>
            <Field label="Triggering Event"><textarea className={inputStyles} rows={4} defaultValue={scenario.triggering_event} placeholder="Describe the incident, condition, or decision point that starts exercise play." /></Field>
            <Field label="Threat / Hazard Description"><textarea className={inputStyles} rows={4} defaultValue={scenario.hazard_description} placeholder="Describe the hazard, threat, disruption, or emergency condition being exercised." /></Field>
            <Field label="Response Problem"><textarea className={inputStyles} rows={4} defaultValue={scenario.operational_problem} placeholder="Explain what responders and planners must solve during the exercise." /></Field>
            <Field label="Affected Area"><input className={inputStyles} defaultValue={scenario.area_of_operations} placeholder="Identify the exercise area, venue, jurisdiction, facility, or operating area." /></Field>
            <Field label="Affected Population"><textarea className={inputStyles} rows={3} defaultValue={scenario.affected_population} placeholder="Describe who is affected, at risk, displaced, isolated, or requiring support." /></Field>
            <Field label="Critical Infrastructure Impacts"><textarea className={inputStyles} rows={3} defaultValue={scenario.infrastructure_impacts} placeholder="List affected roads, power, water, communications, hospitals, schools, shelters, or other critical systems." /></Field>
            <Field label="Weather / Terrain Considerations"><textarea className={inputStyles} rows={3} defaultValue={scenario.weather_terrain} placeholder="Capture weather, terrain, access, visibility, safety, or operating conditions." /></Field>
            <Field label="Civil Authority Request"><textarea className={inputStyles} rows={3} defaultValue={scenario.civil_authority_request} placeholder="Describe any request for support, coordination, mutual aid, or external assistance." /></Field>
            <Field label="Authority / Policy Constraints"><textarea className={inputStyles} rows={3} defaultValue={scenario.legal_policy_constraints} placeholder="Capture legal, policy, privacy, safety, or operational constraints." /></Field>
            <Field label="Communications Environment"><textarea className={inputStyles} rows={3} defaultValue={scenario.communications_environment} placeholder="Describe primary and backup communications, systems, reporting paths, or known limitations." /></Field>
            <Field label="Interagency Complexity"><textarea className={inputStyles} rows={3} defaultValue={scenario.interagency_complexity} placeholder="Describe which organizations must coordinate and why that coordination is difficult." /></Field>
            <Field label="Desired End State"><textarea className={inputStyles} rows={3} defaultValue={scenario.desired_end_state} placeholder="Describe what successful exercise execution and learning should produce." /></Field>
          </div>
        </Panel>
        <Panel>
          <PanelHeader title="Generated Scenario Narrative" eyebrow="AI planning support" action={<ButtonLink href="/mission-assignment" variant="ghost">Next: Tasking</ButtonLink>} />
          <div className="p-5">
            <AiGenerator
              endpoint="/api/generate-scenario"
              buttonLabel="Generate Scenario Narrative"
              payload={{ exercise, scenario }}
              initialOutput={scenario.generated_narrative}
              outputLabel="Scenario Narrative"
            />
          </div>
        </Panel>
      </div>
    </div>
  );
}
