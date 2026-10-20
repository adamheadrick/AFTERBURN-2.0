import { z } from "zod";

export const laneSchema = z.object({
  id: z.string().regex(/^LANE-\d+$/), name: z.string().trim().min(1).max(180),
  problem: z.string().max(1500).default(""), standard: z.string().max(1800).default(""),
  lead: z.string().max(200).default(""), evaluator: z.string().max(200).default(""),
  evidence: z.string().max(500).default(""), dependencies: z.string().max(1000).default(""),
  status: z.enum(["proposed", "confirmed"]).default("proposed"), source: z.string().max(250).default("")
});
export const planningItemSchema = z.object({
  id: z.string().max(60), question: z.string().min(1).max(1500), owner: z.string().max(200).default(""),
  due: z.string().max(100).default(""), status: z.enum(["open", "working", "complete"]).default("open"), source: z.string().max(250).default("")
});
export const briefSchema = z.object({
  goal: z.string().trim().min(12, "Describe what your team needs to practice.").max(1500),
  setting: z.string().trim().min(2).max(300),
  participants: z.string().trim().min(2).max(500),
  hazard: z.enum(["Severe weather", "Infrastructure outage", "Wildland fire", "Cyber disruption", "Flooding", "Multiple hazards"]),
  format: z.enum(["Tabletop", "Functional", "Full-scale", "Mixed / progressive"]),
  duration: z.enum(["60", "90", "120", "240", "480"]),
  name: z.string().max(120).default(""), dates: z.string().max(120).default(""), days: z.number().int().min(1).max(7).default(1),
  lanes: z.array(laneSchema).max(6).default([]),
  schedule: z.array(z.object({ day: z.number().int().min(1).max(7), label: z.string().max(250) })).max(7).default([]),
  planningItems: z.array(planningItemSchema).max(30).default([]),
  source: z.object({ filename: z.string().max(250), scenario: z.string().max(6000), reference: z.string().max(250) }).optional()
});

const text = z.string().trim().min(1).max(3000);
export const scenarioDraftSchema = z.object({
  title: text.max(120),
  story: text.max(8000),
  assumptions: z.array(text).min(1).max(6),
  objectives: z.array(z.object({
    id: z.string().regex(/^OBJ-\d+$/),
    title: text.max(200),
    action: text,
    evidence: text,
    criterion: text,
    laneId: z.string().default("shared")
  })).min(2).max(12),
  injects: z.array(z.object({
    id: z.string().regex(/^INJ-\d+$/),
    minute: z.number().int().min(0).max(479),
    day: z.number().int().min(1).max(7).default(1),
    laneId: z.string().default("shared"),
    event: text,
    recipient: text,
    expectedAction: text,
    objectiveId: z.string()
  })).min(3).max(18),
  controllerNotes: z.array(text).min(1).max(6)
}).superRefine((draft, ctx) => {
  const objectiveIds = draft.objectives.map((objective) => objective.id);
  if (new Set(objectiveIds).size !== objectiveIds.length || new Set(draft.injects.map((inject) => inject.id)).size !== draft.injects.length) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Objective and inject IDs must be unique." });
  }
  for (const inject of draft.injects) {
    if (!objectiveIds.includes(inject.objectiveId)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Every inject must reference an objective." });
  }
  if (objectiveIds.some((id) => !draft.injects.some((inject) => inject.objectiveId === id))) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Every objective needs an inject to exercise it." });
  }
});

export type ScenarioBrief = z.infer<typeof briefSchema>;
export type ScenarioDraft = z.infer<typeof scenarioDraftSchema>;
export type GenerationMode = "ai" | "example" | "source";
export const studioStorageKey = "afterburn.scenarioStudio.v1";

export const initialBrief: ScenarioBrief = {
  goal: "", setting: "", participants: "", hazard: "Severe weather", format: "Tabletop", duration: "90", name: "", dates: "", days: 1, lanes: [], schedule: [], planningItems: []
};

// In-progress edits may temporarily be blank; generation responses remain strict.
export const editableDraftSchema = scenarioDraftSchema.innerType().extend({
  title: z.string().max(120),
  story: z.string().max(8000),
  objectives: z.array(scenarioDraftSchema.innerType().shape.objectives.element.extend({ criterion: z.string().max(3000) })).min(2).max(12)
});

export const studioRequestSchema = z.object({
  brief: briefSchema,
  action: z.enum(["build", "refine", "plan"]),
  example: z.boolean().optional(),
  current: editableDraftSchema.optional(),
  revision: z.string().trim().max(1500).optional()
}).superRefine((input, ctx) => {
  if (input.action !== "build" && !input.current) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "An existing scenario is required." });
  if (input.current && (!input.current.title.trim() || !input.current.story.trim())) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "The title and story are required." });
  if (input.action === "refine" && !input.revision) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Describe the change you want." });
});

export const savedStudioSchema = z.object({
  version: z.literal(1),
  brief: briefSchema.extend({ goal: z.string().max(1500), setting: z.string().max(300), participants: z.string().max(500), lanes: z.array(laneSchema.extend({ name: z.string().max(180) })).max(6).default([]), planningItems: z.array(planningItemSchema.extend({ question: z.string().max(1500) })).max(30).default([]) }),
  draft: editableDraftSchema.nullable(),
  mode: z.enum(["ai", "example", "source"]),
  step: z.number().int().min(0).max(3),
  dirty: z.boolean(),
  updatedAt: z.string()
});

const events: Record<ScenarioBrief["hazard"], { start: string; escalate: string; complication: string }> = {
  "Severe weather": {
    start: "A severe storm crosses the area. Initial reports describe blocked roads, scattered power outages, and conflicting accounts of the hardest-hit neighborhoods.",
    escalate: "A facility reports loss of backup power while an unverified social media post claims the primary evacuation route is blocked.",
    complication: "A second request competes for the same limited transport resources, and the original resource estimate is now in doubt."
  },
  "Infrastructure outage": {
    start: "A widespread power outage interrupts traffic signals and essential services. The cause and restoration time remain unconfirmed.",
    escalate: "A care facility reports diminishing backup power and requests assistance before an agreed restoration estimate is available.",
    complication: "A water utility reports an additional service interruption, placing a competing demand on limited generators and transport."
  },
  "Wildland fire": {
    start: "A fast-moving vegetation fire threatens an inhabited area. Smoke reduces visibility and initial reports disagree about the direction of spread.",
    escalate: "A wind shift places a second neighborhood at risk while a care facility requests help moving residents.",
    complication: "A planned route becomes unavailable. Two jurisdictions request the same limited transport resources."
  },
  "Flooding": {
    start: "Rising water disrupts access to several communities. Reports of stranded residents and threatened infrastructure are incomplete.",
    escalate: "A levee inspection reports distress while a facility requests assistance moving people out of the affected area.",
    complication: "A primary route closes and a possible hazardous release competes with rescue requests for limited resources."
  },
  "Multiple hazards": {
    start: "Several incidents begin to converge on a shared command structure. Partners receive conflicting reports and must verify the situation.",
    escalate: "Conditions in one area interrupt access and support for a second incident. Agencies must agree on priorities.",
    complication: "Competing requests exceed the resources immediately available. A change in one lane affects the decisions in the others."
  },
  "Cyber disruption": {
    start: "Dispatch and public-facing information systems become intermittently unavailable. The cause is unconfirmed, and routine reports cannot be trusted without verification.",
    escalate: "Conflicting service-status reports reach partner agencies while a critical facility requests support through a backup channel.",
    complication: "A second essential service loses access to shared systems. Partners must prioritize scarce technical support and maintain an agreed operating picture."
  }
};

/** Explicitly illustrative, deterministic content for a workspace without an AI key. */
export function buildExampleDraft(brief: ScenarioBrief): ScenarioDraft {
  const event = events[brief.hazard];
  const describe = brief.format === "Tabletop" ? "discuss and record" : "demonstrate and record through simulated exercise channels";
  const draft: ScenarioDraft = {
    title: `${brief.hazard} at ${brief.setting}`.slice(0, 120),
    story: `It is the start of a normal operating period in ${brief.setting}. ${event.start}\n\n${brief.participants} must establish a shared understanding of what is happening and decide who needs to act. Information arrives in pieces; key details remain unverified. ${event.escalate}\n\nAs the situation develops, ${event.complication}\n\nOver this ${brief.duration}-minute ${brief.format.toLowerCase()} exercise, participants will ${describe} their decisions, coordination, and rationale. The planning focus is: ${brief.goal}\n\nThe exercise closes with a decision brief and hotwash: what was known, what was decided, what evidence supports the assessment, and what the team should practice next.`,
    assumptions: [
      "All incidents, service interruptions, and resource requests are fictional exercise conditions.",
      "Local authorities, available resources, agency roles, and performance targets still require planner confirmation.",
      brief.format === "Tabletop" ? "Discussion only; no personnel or equipment are deployed." : "This starter is not an execution authorization. Exercise boundaries, safety controls, staffing, and simulation arrangements must be developed before conduct."
    ],
    objectives: [
      { id: "OBJ-1", title: "Establish a shared operating picture", action: `Identify confirmed facts, unknowns, and information owners in support of this goal: ${brief.goal}`, evidence: "Timestamped situation brief and an information-gap log.", laneId: "shared", criterion: "Before the first escalation, record the current situation, at least two information gaps, and an owner and verification method for each. Planner to confirm this proposed target." },
      { id: "OBJ-2", title: "Coordinate a defensible response", action: `${brief.participants} ${describe} a prioritized response, responsible leads, and the route for unresolved requests.`, evidence: "Decision log, resource request, and acknowledgement from the receiving role.", laneId: "shared", criterion: "Before the closing brief, record a prioritized decision, rationale, responsible lead, and acknowledged handoff for each competing request. Planner to confirm this proposed target." }
    ],
    injects: [
      { day: brief.days, laneId: "shared", id: "INJ-1", minute: 0, event: event.start, recipient: brief.participants, expectedAction: "Establish the initial operating picture and assign verification of missing information.", objectiveId: "OBJ-1" },
      { day: brief.days, laneId: "shared", id: "INJ-2", minute: Math.round(Number(brief.duration) * .3), event: event.escalate, recipient: brief.participants, expectedAction: "Verify the report, identify decision authority, and coordinate an acknowledged support request.", objectiveId: "OBJ-2" },
      { day: brief.days, laneId: "shared", id: "INJ-3", minute: Math.round(Number(brief.duration) * .6), event: event.complication, recipient: brief.participants, expectedAction: "Reassess priorities, document the tradeoff, and communicate the revised decision to partners.", objectiveId: "OBJ-2" }
    ],
    controllerNotes: [
      "Confirm that these proposed objectives actually test the planner's stated goal; revise this example before use.",
      "Release injects when the relevant discussion or action is ready; the minute marks are suggested exercise time, not real incident deadlines.",
      "Use exercise channels and labels. Confirm local exercise safety and stop procedures before conduct.",
      "Reserve the final quarter of the session for a decision brief and hotwash. Capture evidence, an improvement owner, and a proposed retest for each finding."
    ]
  };
  if (brief.name) draft.title = brief.name;
  if (brief.source) draft.story = brief.source.scenario || `Scenario narrative still needs development.\n\nTraining purpose: ${brief.goal}\n\nReviewed lane problems:\n${brief.lanes.map((lane) => `${lane.name}: ${lane.problem || "To be defined"}`).join("\n")}`;
  if (brief.days > 1 && !brief.source) draft.story = draft.story.replace(`Over this ${brief.duration}-minute`, `Across ${brief.days} days, with up to ${brief.duration} minutes of scheduled activity per day, this`);
  if (brief.lanes.length) {
    draft.objectives = brief.lanes.map((lane, index) => ({
      id: `OBJ-${index + 1}`, laneId: lane.id, title: lane.name,
      action: lane.problem || `Practice coordination and decisions for ${lane.name}.`,
      criterion: lane.standard || "Planner to define a measurable performance standard before conduct.",
      evidence: lane.evidence || "Measurement method and evidence source still need to be assigned."
    }));
    draft.objectives.push({ id: `OBJ-${brief.lanes.length + 1}`, laneId: "shared", title: "Coordinate decisions between lanes", action: brief.goal, criterion: "Proposed: record competing requests, the priority decision, its owner, and acknowledgement by affected lanes.", evidence: "Shared decision log and cross-lane handoff records; evaluator to be assigned." });
    draft.injects = draft.objectives.map((objective, index) => ({
      id: `INJ-${index + 1}`, day: brief.days, minute: Math.round(index / draft.objectives.length * Number(brief.duration) * .65), laneId: objective.laneId,
      event: objective.laneId === "shared" ? "Two lanes need the same limited resource. Controllers introduce a competing request for the command team to resolve." : `Proposed controller prompt for ${objective.title}: request a situation update, identify an unresolved decision, and establish what support is needed.`,
      recipient: objective.laneId === "shared" ? brief.participants : brief.lanes.find((lane) => lane.id === objective.laneId)?.lead || "Lane lead to be assigned",
      expectedAction: objective.action, objectiveId: objective.id
    }));
    if (draft.injects.length < 3) draft.injects.push({ ...draft.injects[1], id: "INJ-3", minute: Math.round(Number(brief.duration) * .7), event: "Controllers ask affected teams to acknowledge the revised shared priority and record the handoff." });
    if (!brief.source) draft.story += `\n\nConnected lanes: ${brief.lanes.map((lane) => lane.name).join("; ")}. Each lane reports into the shared command structure; planners must confirm how changes in one lane affect the others.`;
    draft.controllerNotes.unshift("Injects are proposed scaffolding, not extracted or approved events. Review them against each lane's operational problem and standard.");
  }
  if (brief.source) draft.assumptions.unshift(`Imported from ${brief.source.filename} (${brief.source.reference}). Draft standards, proposed partners, and unresolved decisions retain their original status pending review.`);
  return draft;
}

export function validateDraftForBrief(draft: unknown, brief: ScenarioBrief): ScenarioDraft {
  const result = scenarioDraftSchema.parse(draft);
  if (result.injects.some((inject) => inject.minute >= Number(brief.duration))) throw new Error("Injects must fall within the exercise duration.");
  if (brief.lanes.some((lane) => lane.status === "confirmed" && !lane.lead.trim())) throw new Error("A confirmed lane needs a named lead or organization.");
  if (brief.schedule.some((item) => item.day > brief.days) || new Set(brief.schedule.map((item) => item.day)).size !== brief.schedule.length) throw new Error("Schedule days must be unique and within the exercise.");
  const laneIds = new Set(["shared", ...brief.lanes.map((lane) => lane.id)]);
  if (brief.lanes.length !== new Set(brief.lanes.map((lane) => lane.id)).size) throw new Error("Lane IDs must be unique.");
  if (result.objectives.some((objective) => !laneIds.has(objective.laneId)) || result.injects.some((inject) => !laneIds.has(inject.laneId))) throw new Error("Every objective and inject must use a defined lane.");
  if (brief.lanes.some((lane) => !result.objectives.some((objective) => objective.laneId === lane.id))) throw new Error("Every lane needs an objective.");
  if (result.injects.some((inject) => inject.day > brief.days)) throw new Error("Inject day exceeds the exercise schedule.");
  if (result.injects.some((inject) => result.objectives.find((objective) => objective.id === inject.objectiveId)?.laneId !== inject.laneId)) throw new Error("Inject lane must match its objective.");
  if (result.injects.some((inject, index) => index > 0 && ((inject.day - 1) * 1440 + inject.minute) < ((result.injects[index - 1].day - 1) * 1440 + result.injects[index - 1].minute))) throw new Error("Injects must be in chronological order.");
  return result;
}

export function exportScenarioMarkdown(brief: ScenarioBrief, draft: ScenarioDraft, mode: GenerationMode) {
  return [
    `# ${draft.title}`, "Draft exercise concept — planner review required.",
    mode === "source" ? "Source: imported planning text with proposed controller scaffolding; not AI generation or confirmation of participation." : mode === "example" ? "Source: illustrative template, not AI generation. Objectives and injects require review against any story edits." : "Source: AI-assisted draft with planner edits.",
    "## Exercise frame", `- Goal: ${brief.goal}\n- Setting: ${brief.setting}\n- Participants: ${brief.participants}\n- Format: ${brief.format}\n- Dates: ${brief.dates || "To be decided"}\n- Days: ${brief.days}\n- Activity window per day: ${brief.duration} minutes\n- Hazard: ${brief.hazard}`,
    "## Lanes", ...brief.lanes.map((lane) => `### ${lane.id}: ${lane.name}\n${lane.problem}\n\nLead: ${lane.lead || "Unassigned"} (${lane.status})\nEvaluator: ${lane.evaluator || "Unassigned"}\nDependencies: ${lane.dependencies || "To be identified"}\nSource: ${lane.source || "Planner input"}`),
    "## Schedule", ...brief.schedule.map((item) => `- Day ${item.day}: ${item.label}`),
    "## Decisions and planning actions", ...brief.planningItems.map((item) => `- [${item.status}] ${item.question} — Owner: ${item.owner || "Unassigned"}; due: ${item.due || "Unscheduled"}; source: ${item.source || "Planner input"}`),
    "## Scenario", draft.story, "## Assumptions to confirm", ...draft.assumptions.map((item) => `- ${item}`),
    "## Objectives and evidence", ...draft.objectives.map((objective) => `### ${objective.id}: ${objective.title}\n${objective.action}\n\nProposed criterion: ${objective.criterion}\n\nEvidence to capture: ${objective.evidence}`),
    "## Inject sequence", ...draft.injects.map((inject) => `### ${inject.id} · T+${inject.minute} · ${inject.objectiveId} · Day ${inject.day} · ${inject.laneId}\n${inject.event}\n\nTo: ${inject.recipient}\n\nExpected action: ${inject.expectedAction}`),
    "## Controller notes", ...draft.controllerNotes.map((note) => `- ${note}`),
    "## Before conduct", "Confirm authorities, roles, resources, evaluation targets, exercise safety, and simulation arrangements. Assign controllers and evaluators. This concept has not been saved to the shared exercise database or approved for execution."
  ].join("\n\n");
}
