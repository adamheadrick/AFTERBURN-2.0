import assert from "node:assert/strict";
import test from "node:test";
import { briefSchema, buildExampleDraft, exportScenarioMarkdown, initialBrief, savedStudioSchema, scenarioDraftSchema, studioRequestSchema, validateDraftForBrief } from "../lib/scenario-studio.ts";

const brief = { ...initialBrief, goal: "Practice mutual aid handoffs during disrupted communications.", setting: "Fictional River County", participants: "County EM and National Guard liaison teams" };

test("every example combination has complete objective coverage and injects within the session", () => {
  for (const hazard of briefSchema.shape.hazard.options) {
    for (const format of briefSchema.shape.format.options) {
      for (const duration of briefSchema.shape.duration.options) {
        const input = { ...brief, hazard, format, duration };
        const draft = validateDraftForBrief(buildExampleDraft(input), input);
        assert.ok(draft.story.includes(brief.setting));
        assert.ok(draft.story.includes(brief.participants));
        assert.ok(draft.story.includes(brief.goal));
        assert.ok(draft.story.includes(`${duration}-minute`));
        for (const objective of draft.objectives) assert.ok(draft.injects.some((inject) => inject.objectiveId === objective.id));
        assert.ok(draft.injects.at(-1).minute <= Number(duration) * .75, "Leave hotwash time");
      }
    }
  }
});

test("rejects orphan injects, duplicate IDs, and untested objectives", () => {
  const orphan = buildExampleDraft(brief);
  orphan.injects[0].objectiveId = "OBJ-999";
  assert.equal(scenarioDraftSchema.safeParse(orphan).success, false);
  const duplicate = buildExampleDraft(brief);
  duplicate.injects[1].id = duplicate.injects[0].id;
  assert.equal(scenarioDraftSchema.safeParse(duplicate).success, false);
  const uncovered = buildExampleDraft(brief);
  uncovered.injects.forEach((inject) => { inject.objectiveId = "OBJ-2"; });
  assert.equal(scenarioDraftSchema.safeParse(uncovered).success, false);
});

test("rejects out-of-session and out-of-order injects", () => {
  const late = buildExampleDraft(brief);
  late.injects[2].minute = Number(brief.duration);
  assert.throws(() => validateDraftForBrief(late, brief), /duration/);
  const reversed = buildExampleDraft(brief);
  reversed.injects.reverse();
  assert.throws(() => validateDraftForBrief(reversed, brief), /chronological/);
});

test("generation requires a complete brief and refinement requires an existing story and instruction", () => {
  assert.equal(studioRequestSchema.safeParse({ brief: initialBrief, action: "build" }).success, false);
  assert.equal(studioRequestSchema.safeParse({ brief, action: "refine", revision: "Reduce scope" }).success, false);
  assert.equal(studioRequestSchema.safeParse({ brief, action: "refine", current: buildExampleDraft(brief) }).success, false);
  assert.equal(studioRequestSchema.safeParse({ brief, action: "plan", current: buildExampleDraft(brief) }).success, true);
  const blank = buildExampleDraft(brief); blank.story = " ";
  assert.equal(studioRequestSchema.safeParse({ brief, action: "plan", current: blank }).success, false);
});

test("partial inputs and temporarily blank edits survive browser draft validation", () => {
  const saved = { version: 1, brief: { ...initialBrief, goal: "Practice" }, draft: null, mode: "example", step: 0, dirty: true, updatedAt: new Date().toISOString() };
  assert.equal(savedStudioSchema.safeParse(saved).success, true);
  const draft = buildExampleDraft(brief); draft.story = ""; draft.objectives[0].criterion = "";
  assert.equal(savedStudioSchema.safeParse({ ...saved, brief, draft, step: 2 }).success, true);
  assert.equal(savedStudioSchema.safeParse({ ...saved, version: 99 }).success, false);
});

test("export preserves planner edits, traceability, evidence, and example provenance", () => {
  const draft = buildExampleDraft(brief);
  draft.story = "Planner-edited story with a unique handoff decision.";
  draft.objectives[0].criterion = "The receiving team acknowledges the request before the next inject.";
  const output = exportScenarioMarkdown(brief, draft, "example");
  assert.ok(output.includes(draft.story));
  assert.ok(output.includes(draft.objectives[0].criterion));
  assert.ok(output.includes("illustrative template, not AI generation"));
  for (const objective of draft.objectives) assert.ok(output.includes(objective.evidence));
  for (const inject of draft.injects) assert.ok(output.includes(`${inject.id} · T+${inject.minute} · ${inject.objectiveId}`));
  assert.ok(output.includes("has not been saved to the shared exercise database"));
});
