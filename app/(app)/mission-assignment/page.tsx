import { AiGenerator } from "@/components/ai-generator";
import { ButtonLink } from "@/components/button";
import { PageTitle } from "@/components/page-title";
import { Field, inputStyles, Panel, PanelHeader } from "@/components/panel";
import { getAppData } from "@/lib/data";

function missionToText(mission: Awaited<ReturnType<typeof getAppData>>["missionAssignment"]) {
  const hasMissionContent = [
    mission.mission_number,
    mission.requesting_agency,
    mission.supporting_agency,
    mission.mission_statement,
    mission.purpose,
    mission.scope,
    mission.resources_required,
    mission.command_control_structure
  ].some(Boolean) || mission.tasks.length > 0;

  if (!hasMissionContent) {
    return "Generated tasking / mission assignment language will appear here after you provide exercise, scenario, resource, authority, and coordination inputs.";
  }

  return `Mission Assignment Number: ${mission.mission_number}
Requesting Agency: ${mission.requesting_agency}
Supporting Agency: ${mission.supporting_agency}

Mission Statement:
${mission.mission_statement}

Purpose:
${mission.purpose}

Scope:
${mission.scope}

Tasks:
${mission.tasks.map((task, index) => `${index + 1}. ${task}`).join("\n")}

Coordinating Instructions:
${mission.coordinating_instructions}

Timeline:
${mission.timeline}

Resources Required:
${mission.resources_required}

Personnel Required:
${mission.personnel_required}

Equipment Required:
${mission.equipment_required}

Communications Requirements:
${mission.communications_requirements}

Reporting Requirements:
${mission.reporting_requirements}

Sustainment Requirements:
${mission.sustainment_requirements}

Safety Considerations:
${mission.safety_considerations}

Legal / Policy Considerations:
${mission.legal_policy_considerations}

Command and Control Structure:
${mission.command_control_structure}

Measures of Performance:
${mission.measures_of_performance.map((item) => `- ${item}`).join("\n")}

Measures of Effectiveness:
${mission.measures_of_effectiveness.map((item) => `- ${item}`).join("\n")}

Expected Deliverables:
${mission.deliverables.map((item) => `- ${item}`).join("\n")}`;
}

export default async function MissionAssignmentPage() {
  const data = await getAppData();
  const { exercise, scenario, missionAssignment } = data;

  return (
    <div>
      <PageTitle
        eyebrow="Step 3"
        title="Tasking / Mission Assignment Generator"
        description="Generate clear partner tasking: who requested support, who is supporting, what needs to happen, what resources are needed, and how updates will be reported."
      />
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Panel>
          <PanelHeader title="Tasking Inputs" eyebrow={exercise.name} />
          <div className="grid gap-5 p-5">
            <Field label="Requesting Organization"><input className={inputStyles} defaultValue={missionAssignment.requesting_agency} placeholder="Identify who is requesting support or coordination" /></Field>
            <Field label="Supporting Organization"><input className={inputStyles} defaultValue={missionAssignment.supporting_agency} placeholder="Identify who is providing support" /></Field>
            <Field label="Response / Exercise Need"><textarea className={inputStyles} rows={5} defaultValue={scenario.operational_problem} placeholder="Describe the operational problem, support need, or capability the exercise will test." /></Field>
            <Field label="Resources Required"><textarea className={inputStyles} rows={5} defaultValue={missionAssignment.resources_required} placeholder="List personnel, equipment, facilities, systems, and partner capabilities needed." /></Field>
            <Field label="Authority / Policy Considerations"><textarea className={inputStyles} rows={4} defaultValue={missionAssignment.legal_policy_considerations} placeholder="Capture legal authorities, policy limits, privacy issues, safety requirements, or approval constraints." /></Field>
            <Field label="Coordination and Reporting Structure"><textarea className={inputStyles} rows={4} defaultValue={missionAssignment.command_control_structure} placeholder="Describe coordination nodes, reporting cadence, decision authority, and update flow." /></Field>
          </div>
        </Panel>
        <Panel>
          <PanelHeader title="Generated Tasking / Mission Assignment" eyebrow="AI planning support" action={<ButtonLink href="/objectives" variant="ghost">Next: Objectives</ButtonLink>} />
          <div className="p-5">
            <AiGenerator
              endpoint="/api/generate-mission-assignment"
              buttonLabel="Generate Tasking"
              payload={{ exercise, scenario, missionAssignment }}
              initialOutput={missionToText(missionAssignment)}
              outputLabel="Tasking / Mission Assignment"
              large
            />
          </div>
        </Panel>
      </div>
    </div>
  );
}
