import { PageTitle } from "@/components/page-title";
import { Field, inputStyles, Panel, PanelHeader } from "@/components/panel";
import { Button } from "@/components/button";
import { SupportingOrganizationsField } from "@/components/supporting-organizations-field";

const exerciseTypes = [
  "Tabletop Exercise",
  "Functional Exercise",
  "Full-Scale Exercise",
  "Domestic Operations Exercise",
  "Homeland Defense Exercise",
  "Emergency Management Exercise",
  "Law Enforcement Support Exercise",
  "Cyber / Infrastructure Exercise"
];

const scenarioCategories = [
  "Severe Weather",
  "Wildland Fire",
  "Flood Response",
  "Civil Disturbance",
  "Search and Rescue",
  "CBRNE",
  "Cyber Incident",
  "Critical Infrastructure Disruption",
  "UAS / Drone Threat",
  "Mass Casualty",
  "Multi-Hazard Complex Incident"
];

export default function NewExercisePage() {
  return (
    <div>
      <PageTitle
        eyebrow="Step 1"
        title="Create Exercise"
        description="Capture the planning frame, participating organizations, assumptions, constraints, resources, and desired training outcomes."
      />
      <Panel>
        <PanelHeader title="Exercise Setup Form" eyebrow="Planning inputs" />
        <form action="/scenario-builder" className="grid gap-5 p-5">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Exercise Name"><input name="name" className={inputStyles} placeholder="Example: County Severe Weather Tabletop" /></Field>
            <Field label="Exercise Date"><input name="date" type="date" className={inputStyles} /></Field>
            <Field label="Location"><input name="location" className={inputStyles} placeholder="Example: County EOC, city hall, affected area, or exercise venue" /></Field>
            <Field label="Lead Organization"><input name="lead_org" className={inputStyles} placeholder="Example: County Emergency Management" /></Field>
            <Field label="Exercise Type">
              <select name="exercise_type" className={inputStyles} defaultValue="">
                <option value="">Select exercise type</option>
                {exerciseTypes.map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <Field label="Scenario Category">
              <select name="scenario_category" className={inputStyles} defaultValue="">
                <option value="">Select scenario category</option>
                {scenarioCategories.map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid gap-2 text-sm font-semibold text-ink">
            <span>Supporting Organizations</span>
            <SupportingOrganizationsField />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Operational Environment"><textarea name="environment" className={inputStyles} rows={5} placeholder="Describe the setting the exercise will test: geography, population, infrastructure, facilities, season, or operating conditions." /></Field>
            <Field label="Planning Assumptions"><textarea name="assumptions" className={inputStyles} rows={5} placeholder="List assumptions planners should use. Example: EOC is activated, mutual aid is available, communications are degraded, shelters may open." /></Field>
            <Field label="Constraints / Limitations"><textarea name="constraints" className={inputStyles} rows={5} placeholder="List known limits. Example: limited staffing, no live field movement, no real patient transport, weather window, policy limits, budget limits." /></Field>
            <Field label="Available Resources"><textarea name="resources" className={inputStyles} rows={5} placeholder="List exercise resources or simulated capabilities. Example: EOC staff, patrol units, fire apparatus, EMS units, public works crews, GIS, communications, volunteer support." /></Field>
          </div>
          <Field label="Desired Training Objectives">
            <textarea name="training_objectives" className={inputStyles} rows={5} placeholder="Describe what the exercise should test or improve. Example: resource requests, public warning, interagency coordination, EOC reporting, shelter coordination, damage assessment." />
          </Field>
          <div>
            <Button variant="ember" type="submit">Create Exercise and Continue</Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}
