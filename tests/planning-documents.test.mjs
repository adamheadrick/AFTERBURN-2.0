import assert from "node:assert/strict";
import test from "node:test";
import { zipSync, strToU8 } from "fflate";
import { parsePlanningDocument, proposePlanningBrief } from "../lib/import/planning-document.ts";
import { initialBrief, briefSchema, laneSchema, buildExampleDraft, validateDraftForBrief, savedStudioSchema } from "../lib/scenario-studio.ts";
import { buildBriefSections, briefingHtml } from "../lib/exercise-briefing.ts";
const slide = (lines) => `<p:sld xmlns:p="p" xmlns:a="a">${lines.map((line) => `<a:p><a:r><a:t>${line}</a:t></a:r></a:p>`).join("")}</p:sld>`;
function fixture() {
  return zipSync(Object.fromEntries(Object.entries({
    "ppt/presentation.xml": '<p:presentation xmlns:p="p" xmlns:r="r"><p:sldIdLst><p:sldId r:id="s2"/><p:sldId r:id="s1"/><p:sldId r:id="s3"/></p:sldIdLst></p:presentation>',
    "ppt/_rels/presentation.xml.rels": '<Relationships><Relationship Id="s1" Target="slides/slide1.xml"/><Relationship Id="s2" Target="slides/slide2.xml"/><Relationship Id="s3" Target="slides/slide3.xml"/></Relationships>',
    "ppt/slides/slide2.xml": slide(["EXERCISE OVERVIEW AND INTENT", "Practice coordinated handoffs between response agencies.", "LOCATION", "Fictional County", "DATES", "Dates pending", "PARTICIPANTS", "County EM and partner agencies", "Day 1: Prepare", "Day 2: Rehearse", "Day 3: Execute"]),
    "ppt/slides/slide1.xml": slide(["LANE 1 / SITE PENDING", "Flood response", "OPERATIONAL PROBLEM", "Rising water interrupts access.", "DRAFT STANDARDS", "Verify a request within a proposed five minutes.", "PARTICIPANTS", "Rescue teams", "Lead: Agency pending"]),
    "ppt/slides/slide3.xml": slide(["SCENARIO AND OPERATIONAL FRAMEWORK", "Rising water puts pressure on limited resources."]),
    "ppt/slides/_rels/slide1.xml.rels": '<Relationships><Relationship Type="x/notesSlide" Target="../notesSlides/notesSlide9.xml"/></Relationships>',
    "ppt/notesSlides/notesSlide9.xml": slide(["This is proposed; confirm with the agency.", "2"])
  }).map(([key, value]) => [key, strToU8(value)])));
}
const base = { ...initialBrief, goal: "Practice shared resource decisions between teams.", setting: "Fictional county", participants: "Proposed partner teams", days: 3, duration: "240", lanes: [laneSchema.parse({ id: "LANE-1", name: "Response", problem: "Two teams need the same resource.", source: "Test · Slide 2" }), laneSchema.parse({ id: "LANE-2", name: "Coordination", problem: "A handoff needs acknowledgement." })], schedule: [{ day: 1, label: "Prepare" }, { day: 2, label: "Rehearse" }, { day: 3, label: "Execute" }] };

test("PowerPoint import follows presentation order, retains source labels and speaker notes", () => {
  const document = parsePlanningDocument(fixture(), "synthetic.pptx");
  assert.equal(document.sections.length, 3);
  assert.equal(document.sections[0].lines[0], "EXERCISE OVERVIEW AND INTENT");
  assert.equal(document.sections[1].notes, "This is proposed; confirm with the agency.");
  const proposed = proposePlanningBrief(document);
  assert.equal(proposed.setting, "Fictional County");
  assert.equal(proposed.days, 3);
  assert.equal(proposed.lanes[0].status, "proposed");
  assert.match(proposed.lanes[0].source, /Slide 2/);
  assert.match(proposed.lanes[0].standard, /proposed five minutes/);
  assert.equal(proposed.source.reference, "Slide 3");
});

test("Word and text import preserve content without claiming semantic extraction", () => {
  const word = zipSync({ "word/document.xml": strToU8('<w:document xmlns:w="w"><w:p><w:r><w:t>Exercise planning notes</w:t></w:r></w:p></w:document>') });
  assert.equal(parsePlanningDocument(word, "notes.docx").sections[0].lines[0], "Exercise planning notes");
  const text = parsePlanningDocument(strToU8("Purpose still undecided"), "notes.txt");
  assert.equal(proposePlanningBrief(text).goal, "");
  assert.equal(proposePlanningBrief(text).lanes.length, 0);
});

test("unsupported, empty, oversized and entity-bearing documents fail explicitly", () => {
  assert.throws(() => parsePlanningDocument(strToU8("test"), "file.pdf"), /PDF import/);
  assert.throws(() => parsePlanningDocument(new Uint8Array(), "empty.txt"), /no readable text/);
  assert.throws(() => parsePlanningDocument(new Uint8Array(8 * 1024 * 1024 + 1), "large.pptx"), /smaller than 8 MB/);
  const evil = zipSync({ "word/document.xml": strToU8('<!DOCTYPE x [<!ENTITY leak SYSTEM "file:///etc/passwd">]><w:document/>') });
  assert.throws(() => parsePlanningDocument(evil, "entity.docx"), /custom XML entities/);
});

test("multi-lane multi-day concepts cover each lane without inventing leads or standards", () => {
  const draft = validateDraftForBrief(buildExampleDraft(base), base);
  for (const lane of base.lanes) {
    assert.ok(draft.objectives.some((objective) => objective.laneId === lane.id));
    assert.ok(draft.injects.some((inject) => inject.laneId === lane.id));
  }
  assert.ok(draft.injects.every((inject) => inject.day === 3));
  assert.match(draft.objectives[0].criterion, /Planner to define/);
  const orphan = structuredClone(draft); orphan.injects[0].laneId = "LANE-999";
  assert.throws(() => validateDraftForBrief(orphan, base), /defined lane/);
  const late = structuredClone(draft); late.injects[0].day = 4;
  assert.throws(() => validateDraftForBrief(late, base), /exceeds/);
  const duplicateSchedule = { ...base, schedule: [{ day: 1, label: "A" }, { day: 1, label: "B" }] };
  assert.throws(() => validateDraftForBrief(draft, duplicateSchedule), /unique/);
});

test("source drafts keep source scenario and proposed criteria, with no invented incident when narrative is missing", () => {
  const source = { ...base, source: { filename: "synthetic.pptx", scenario: "The planner's reviewed scenario.", reference: "Slide 3" } };
  assert.equal(buildExampleDraft(source).story, source.source.scenario);
  const blank = buildExampleDraft({ ...source, source: { ...source.source, scenario: "" } });
  assert.match(blank.story, /still needs development/);
  assert.doesNotMatch(blank.story, /severe storm crosses/);
});

test("temporary blank lane and task edits remain restorable while generation stays strict", () => {
  const brief = { ...base, lanes: [{ ...base.lanes[0], name: "" }], planningItems: [{ id: "1", question: "", owner: "", due: "", status: "open", source: "" }] };
  assert.equal(briefSchema.safeParse(brief).success, false);
  assert.equal(savedStudioSchema.safeParse({ version: 1, brief, draft: null, mode: "source", step: 1, dirty: true, updatedAt: "now" }).success, true);
});

test("brief reflects current decisions, standards, and unassigned owners; HTML escapes untrusted text", () => {
  const brief = { ...base, planningItems: [{ id: "1", question: "Confirm the lead", owner: "", due: "", status: "open", source: "" }] };
  const draft = buildExampleDraft(brief);
  draft.title = '<script>alert("x")</script>';
  draft.objectives[0].criterion = "Planner changed this standard.";
  const sections = buildBriefSections(brief, draft, "source");
  assert.ok(sections.some((section) => section.bullets.some((bullet) => bullet.includes("Planner changed this standard."))));
  assert.ok(sections.some((section) => section.bullets.some((bullet) => bullet.includes("Owner: Unassigned"))));
  assert.ok(sections.some((section) => section.title.startsWith("Controller annex")));
  const html = briefingHtml(sections);
  assert.ok(html.includes("&lt;script&gt;"));
  assert.ok(!html.includes("<script>"));
  const closed = buildBriefSections({ ...brief, planningItems: [{ ...brief.planningItems[0], status: "complete" }] }, draft, "source");
  assert.ok(!closed.find((section) => section.title === "Open decisions and actions").bullets.length);
});
