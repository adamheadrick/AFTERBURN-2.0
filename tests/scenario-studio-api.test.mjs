// Run after `next build`; invoke the compiled handler without a preview server.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

import { createAccessSession } from "../lib/access/session.ts";
process.env.AFTERBURN_ACCESS_PASSWORD = "test-fixture-only-not-a-deployment-password";
const gateCookie = "afterburn_access=" + await createAccessSession(process.env.AFTERBURN_ACCESS_PASSWORD);
delete process.env.OPENAI_API_KEY;
const require = createRequire(import.meta.url);
const { POST } = require("../.next/server/app/api/scenario-studio/route.js").routeModule.userland;
const brief = { goal: "Practice requesting and acknowledging mutual aid.", setting: "Fictional county", participants: "County EM and Guard liaison", hazard: "Infrastructure outage", format: "Tabletop", duration: "60" };
const request = (body) => new Request("http://localhost/api/scenario-studio", { method: "POST", headers: { cookie: gateCookie }, body: typeof body === "string" ? body : JSON.stringify(body) });

test("invalid JSON, oversized requests, and incomplete briefs fail cleanly", async () => {
  assert.equal((await POST(request("{"))).status, 400);
  assert.equal((await POST(request("x".repeat(120001)))).status, 413);
  assert.equal((await POST(request({ action: "build", brief: {} }))).status, 400);
});

test("example generation and plan handoff preserve the planner's exact edited story", async () => {
  const response = await POST(request({ action: "build", brief }));
  assert.equal(response.status, 200);
  const { draft, mode } = await response.json();
  assert.equal(mode, "example");
  assert.ok(draft.story.includes(brief.goal));
  draft.title = "A planner's title";
  draft.story = "A planner's revised story.\n\nIncluding a specific decision.";
  const plan = await POST(request({ action: "plan", brief, current: draft }));
  assert.equal(plan.status, 200);
  const result = await plan.json();
  assert.equal(result.draft.title, draft.title);
  assert.equal(result.draft.story, draft.story);
  const refine = await POST(request({ action: "refine", brief, current: draft, revision: "Reduce the scope" }));
  assert.equal(refine.status, 400);
  assert.match((await refine.json()).error, /example mode/);
});

test("an explicitly requested example never requires a paid AI call or sign-in", async () => {
  process.env.OPENAI_API_KEY = "not-a-real-key-test-must-not-call-ai";
  try {
    const response = await POST(request({ action: "build", brief, example: true }));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).mode, "example");
  } finally { delete process.env.OPENAI_API_KEY; }
});

test("reviewed sources create connected multi-day drafts without converting proposals to confirmations", async () => {
  const imported = { ...brief, days: 3, duration: "240", source: { filename: "synthetic.pptx", reference: "Slide 2", scenario: "A reviewed scenario with two connected lanes." }, lanes: [
    { id: "LANE-1", name: "Coordination", problem: "Information needs verification.", status: "proposed" },
    { id: "LANE-2", name: "Response", problem: "A second team needs the same resource.", status: "proposed" }
  ] };
  const response = await POST(request({ action: "build", brief: imported, example: true }));
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.mode, "source");
  assert.equal(result.draft.story, imported.source.scenario);
  assert.ok(result.draft.injects.every((inject) => inject.day === 3));
  assert.ok(result.draft.objectives.some((objective) => objective.laneId === "LANE-1"));
  assert.ok(result.draft.objectives.some((objective) => objective.laneId === "LANE-2"));
});
