// Run after `next build`; invoke the compiled handler without a preview server.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

delete process.env.OPENAI_API_KEY;
const require = createRequire(import.meta.url);
const { POST } = require("../.next/server/app/api/scenario-studio/route.js").routeModule.userland;
const brief = { goal: "Practice requesting and acknowledging mutual aid.", setting: "Fictional county", participants: "County EM and Guard liaison", hazard: "Infrastructure outage", format: "Tabletop", duration: "60" };
const request = (body) => new Request("http://localhost/api/scenario-studio", { method: "POST", body: typeof body === "string" ? body : JSON.stringify(body) });

test("invalid JSON, oversized requests, and incomplete briefs fail cleanly", async () => {
  assert.equal((await POST(request("{"))).status, 400);
  assert.equal((await POST(request("x".repeat(65001)))).status, 413);
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
