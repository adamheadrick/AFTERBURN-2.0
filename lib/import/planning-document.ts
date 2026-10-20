import { unzipSync, strFromU8 } from "fflate";
import { XMLParser } from "fast-xml-parser";
import type { ScenarioBrief } from "../scenario-studio";

export type SourceSection = { label: string; lines: string[]; notes: string };
export type PlanningDocument = { filename: string; sections: SourceSection[]; warnings: string[] };
type Node = Record<string, unknown>;
const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, parseTagValue: false, trimValues: false });
function xml(raw: string): Node[] {
  if (/<!DOCTYPE|<!ENTITY/i.test(raw)) throw new Error("Documents with custom XML entities are not supported.");
  return parser.parse(raw) as Node[];
}
function nodes(value: unknown, name: string): Node[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((node: Node) => Object.entries(node).flatMap(([key, child]) => key === name ? [node] : key !== ":@" ? nodes(child, name) : []));
}
function textIn(value: unknown): string {
  if (!Array.isArray(value)) return "";
  return value.map((node: Node) => Object.entries(node).map(([key, child]) => key === "#text" ? String(child) : key === ":@" ? "" : textIn(child)).join("")).join("");
}
function paragraphs(tree: Node[], prefix: "a" | "w") {
  return nodes(tree, `${prefix}:p`).map((node) => nodes(node[`${prefix}:p`], `${prefix}:t`).map((run) => textIn(run[`${prefix}:t`])).join("").trim()).filter(Boolean);
}
function attributes(node: Node) { return (node[":@"] ?? {}) as Record<string, string>; }
function resolve(base: string, target: string) {
  const parts = target.startsWith("/") ? [] : base.split("/").slice(0, -1);
  for (const part of target.split("/")) { if (part === "..") parts.pop(); else if (part && part !== ".") parts.push(part); }
  return parts.join("/");
}

/** Runs in the browser. Only document text and speaker notes are extracted. */
export function parsePlanningDocument(bytes: Uint8Array, filename: string): PlanningDocument {
  if (bytes.length > 8 * 1024 * 1024) throw new Error("Use a document smaller than 8 MB. Remove large images or paste the planning text.");
  const extension = filename.split(".").pop()?.toLowerCase();
  if (["txt", "md"].includes(extension ?? "")) {
    const content = strFromU8(bytes);
    if (content.length > 160000) throw new Error("Use a shorter document (up to 160,000 characters).");
    if (!content.trim()) throw new Error("This file has no readable text.");
    return { filename, sections: [{ label: "Document", lines: content.split(/\r?\n/).filter(Boolean), notes: "" }], warnings: [] };
  }
  if (extension !== "pptx" && extension !== "docx") throw new Error("Choose a PowerPoint (.pptx), Word (.docx), or text file. PDF import is not available yet.");
  let expanded = 0;
  const files = unzipSync(bytes, { filter: (entry) => {
    const include = /^(ppt\/(presentation\.xml|_rels\/presentation\.xml\.rels|slides\/slide\d+\.xml|slides\/_rels\/slide\d+\.xml\.rels|notesSlides\/notesSlide\d+\.xml)|word\/document\.xml)$/.test(entry.name);
    if (include) { expanded += entry.originalSize; if (entry.originalSize > 2 * 1024 * 1024 || expanded > 12 * 1024 * 1024) throw new Error("The document contains too much expanded text to import."); }
    return include;
  } });
  const read = (path: string) => { if (!files[path]) throw new Error("The document is missing required content. Re-save it as a new PowerPoint or Word file."); return xml(strFromU8(files[path])); };
  const sections: SourceSection[] = [];
  if (extension === "docx") sections.push({ label: "Document", lines: paragraphs(read("word/document.xml"), "w"), notes: "" });
  else {
    const relationships = new Map(nodes(read("ppt/_rels/presentation.xml.rels"), "Relationship").map((node) => { const a = attributes(node); return [a["@_Id"], a["@_Target"]]; }));
    const slides = nodes(read("ppt/presentation.xml"), "p:sldId");
    if (slides.length > 100) throw new Error("Import up to 100 slides at a time.");
    slides.forEach((slide, index) => {
      const target = relationships.get(attributes(slide)["@_r:id"]);
      if (!target) throw new Error("A slide could not be resolved in this presentation.");
      const path = resolve("ppt/presentation.xml", target);
      const lines = paragraphs(read(path), "a");
      const relPath = path.replace(/\/([^/]+)$/, "/_rels/$1.rels");
      let notes = "";
      if (files[relPath]) {
        for (const node of nodes(read(relPath), "Relationship")) {
          const attr = attributes(node);
          if (attr["@_Type"]?.endsWith("/notesSlide") && attr["@_TargetMode"] !== "External") notes = paragraphs(read(resolve(path, attr["@_Target"])), "a").filter((line) => !/^\d+$/.test(line)).join("\n");
        }
      }
      sections.push({ label: `Slide ${index + 1}`, lines, notes });
    });
  }
  const length = sections.reduce((sum, section) => sum + section.lines.join("\n").length + section.notes.length, 0);
  if (!length) throw new Error("No editable text was found. Image-only pages are not supported; paste their text instead.");
  if (length > 160000) throw new Error("Use a shorter document (up to 160,000 characters).");
  return { filename, sections, warnings: ["Text and speaker notes only. Images, charts, diagrams, and their labels may need manual review."] };
}

function after(lines: string[], label: RegExp) {
  const index = lines.findIndex((line) => label.test(line.trim()));
  return index >= 0 ? lines[index + 1] ?? "" : "";
}
export function proposePlanningBrief(document: PlanningDocument): Partial<ScenarioBrief> {
  const { sections, filename } = document;
  const overview = sections.find((section) => section.lines.slice(0, 2).some((line) => /EXERCISE OVERVIEW|EXERCISE INTENT/i.test(line))) ?? sections[0];
  const all = sections.flatMap((section) => section.lines);
  const goal = overview?.lines.find((line) => /^(Integrate|Practice|Validate|Test|Assess|Develop)\b/i.test(line) && line.length > 35) ?? "";
  const setting = after(overview?.lines ?? [], /^LOCATION$/i) || "";
  const dates = after(overview?.lines ?? [], /^DATES$/i) || "";
  const participants = after(overview?.lines ?? [], /^PARTICIPANTS$/i) || "";
  const dayNumbers = all.flatMap((line) => { const match = line.match(/^Day\s+(\d+)\s*[:–-]\s*(.+)/i); return match ? [{ day: Number(match[1]), label: match[2] }] : []; });
  const schedule = [...new Map(dayNumbers.filter((row) => row.day <= 7).map((row) => [row.day, row])).values()].sort((a, b) => a.day - b.day);
  const lanes: ScenarioBrief["lanes"] = [];
  for (const section of sections) {
    const heading = section.lines.findIndex((line) => /^LANE\s+\d+\s*[/|:–-]/i.test(line));
    if (heading < 0 || !section.lines.some((line) => /^OPERATIONAL PROBLEM$/i.test(line))) continue;
    const match = section.lines[heading].match(/^LANE\s+(\d+)/i)!;
    const id = `LANE-${match[1]}`;
    if (lanes.some((lane) => lane.id === id)) continue;
    const standardStart = section.lines.findIndex((line) => /^(DRAFT )?STANDARDS\b/i.test(line));
    const standardEnd = section.lines.findIndex((line, index) => index > standardStart && /^PARTICIPANTS$/i.test(line));
    lanes.push({ id, name: (section.lines[heading + 1] || `Lane ${match[1]}`).slice(0, 180), problem: after(section.lines, /^OPERATIONAL PROBLEM$/i).slice(0, 1500), standard: standardStart >= 0 ? section.lines.slice(standardStart + 1, standardEnd >= 0 ? standardEnd : standardStart + 5).join("\n").slice(0, 1800) : "", lead: (section.lines.find((line) => /^Lead:/i.test(line)) ?? "").replace(/^Lead:\s*/i, "").slice(0, 200), status: "proposed", evaluator: "", evidence: "", dependencies: "", source: `${filename} · ${section.label}`.slice(0, 250) });
  }
  const narrative = sections.find((section) => section.lines.slice(0, 2).some((line) => /SCENARIO AND OPERATIONAL FRAMEWORK|INCIDENT NARRATIVE|SCENARIO OVERVIEW/i.test(line)));
  const scenario = narrative?.lines.filter((line) => !/^\d+$/.test(line) && !/\/ IPR|\/ \d{1,2} [A-Z]{3} \d{2}$/.test(line)).join("\n").slice(0, 6000) ?? "";
  const decisionSection = sections.find((section) => section.lines.some((line) => /Decisions requested|Decisions required/i.test(line)));
  const planningItems: ScenarioBrief["planningItems"] = (decisionSection?.lines ?? []).filter((line) => /^(Approve|Accept|Confirm|How |Role for)/i.test(line)).slice(0, 15).map((question, index) => ({ id: `ACTION-${index + 1}`, question, owner: "", due: "", status: "open", source: `${filename} · ${decisionSection?.label}`.slice(0, 250) }));
  for (const lane of lanes) planningItems.push({ id: `MEASURE-${lane.id}`, question: `Assign an evaluator and measurement method for ${lane.name}.`, owner: "", due: "", status: "open", source: "Suggested follow-up; not a source commitment" });
  return { name: filename.replace(/\.[^.]+$/, "").slice(0, 120), goal: goal.slice(0, 1500), setting: setting.slice(0, 300), dates: dates.slice(0, 120), participants: participants.slice(0, 500), days: schedule.length ? Math.max(...schedule.map((item) => item.day)) : 1, schedule, lanes: lanes.slice(0, 6), planningItems, ...(lanes.length > 1 ? { hazard: "Multiple hazards" as const } : {}), source: { filename: filename.slice(0, 250), scenario, reference: narrative?.label ?? "Planner-selected source text" } };
}
