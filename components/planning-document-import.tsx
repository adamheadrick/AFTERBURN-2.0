"use client";
import { useState } from "react";
import { FileUp, ArrowRight } from "lucide-react";
import type { ScenarioBrief } from "@/lib/scenario-studio";
import type { PlanningDocument } from "@/lib/import/planning-document";
import styles from "./scenario-studio.module.css";

export function PlanningDocumentImport({ onApply }: { onApply: (brief: Partial<ScenarioBrief>) => void }) {
  const [open, setOpen] = useState(false);
  const [document, setDocument] = useState<PlanningDocument | null>(null);
  const [proposal, setProposal] = useState<Partial<ScenarioBrief> | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function readFile(file: File | undefined) {
    if (!file) return;
    setBusy(true); setError(""); setDocument(null); setProposal(null);
    try {
      if (file.size > 8 * 1024 * 1024) throw new Error("Choose a file smaller than 8 MB.");
      const { parsePlanningDocument, proposePlanningBrief } = await import("@/lib/import/planning-document");
      const parsed = parsePlanningDocument(new Uint8Array(await file.arrayBuffer()), file.name);
      setDocument(parsed); setProposal(proposePlanningBrief(parsed));
    } catch (cause) { setError(cause instanceof Error ? cause.message : "The document could not be read."); }
    finally { setBusy(false); }
  }
  return <section className={styles.importBox}>
    <button type="button" className={styles.choice} aria-expanded={open} onClick={() => setOpen(!open)}><span><FileUp size={17} aria-hidden="true" /> Start from my planning documents</span><ArrowRight size={16} /></button>
    {open && <div className={styles.importBody}>
      <h2>Bring the planning you’ve already done.</h2>
      <p className={styles.hint}>PowerPoint, Word, or text · up to 8 MB. Reading happens in this browser. Review the extraction before adding it to your concept.</p>
      <label className={styles.label}>Choose a planning brief<input type="file" accept=".pptx,.docx,.txt,.md" disabled={busy} onChange={(event) => void readFile(event.target.files?.[0])} /></label>
      {busy && <p role="status">Reading document text and speaker notes…</p>}
      {error && <p role="alert" className={styles.error}>{error}</p>}
      {document && proposal && <>
        <div className={styles.modeLine}><span className={styles.pill}>{document.sections.length} source sections</span><span className={styles.pill}>{proposal.lanes?.length ?? 0} proposed lanes</span></div>
        <p className={styles.notice}>These are text-based suggestions, not verified commitments. Blank fields and unresolved items need your input. {document.warnings.join(" ")}</p>
        <label className={styles.label}>Exercise name<input maxLength={120} value={proposal.name ?? ""} onChange={(event) => setProposal({ ...proposal, name: event.target.value })} /></label>
        <label className={styles.label}>Purpose found in the brief<textarea rows={3} maxLength={1500} value={proposal.goal ?? ""} onChange={(event) => setProposal({ ...proposal, goal: event.target.value })} placeholder="Add the training purpose if it was not found." /></label>
        <div className={styles.formGrid}><label className={styles.label}>Setting<input maxLength={300} value={proposal.setting ?? ""} onChange={(event) => setProposal({ ...proposal, setting: event.target.value })} /></label><label className={styles.label}>Participating organizations (proposed)<input maxLength={500} value={proposal.participants ?? ""} onChange={(event) => setProposal({ ...proposal, participants: event.target.value })} /></label></div>
        <p className={styles.hint}>Dates: {proposal.dates || "Not found"} · {proposal.days} day(s) found. Confirm format and daily activity window in the next step.</p>
        {proposal.source && <label className={styles.label}>Scenario source · {proposal.source.reference}<textarea rows={6} maxLength={6000} value={proposal.source.scenario} onChange={(event) => setProposal({ ...proposal, source: { ...proposal.source!, scenario: event.target.value } })} placeholder="Select and paste the scenario text from the source below if it was not identified." /></label>}
        {proposal.lanes?.map((lane) => <details className={styles.details} key={lane.id}><summary>{lane.name} · proposed</summary><p className={styles.hint}>{lane.source}</p><p className={styles.storyRead}>{lane.problem}</p><p className={styles.smallLabel}>Draft standards from source</p><p className={styles.storyRead}>{lane.standard || "Not found"}</p></details>)}
        <details className={styles.details}><summary>Inspect source text and speaker notes</summary>{document.sections.map((section) => <div key={section.label} className={styles.sourceSection}><h3>{section.label}</h3><p>{section.lines.join("\n")}</p>{section.notes && <><h4>Speaker notes</h4><p>{section.notes}</p></>}</div>)}</details>
        <button type="button" className={styles.primary} onClick={() => onApply(proposal)}>Use this as my starting point <ArrowRight size={16} /></button>
        <p className={styles.hint}>You can edit lanes, ownership, dates, and decisions next. The original file is not uploaded. Choosing AI generation later sends the reviewed planning fields to the generation service.</p>
      </>}
    </div>}
  </section>;
}
