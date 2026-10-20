"use client";
import { useState } from "react";
import { Presentation, Printer, Download } from "lucide-react";
import { buildBriefSections, briefingHtml } from "@/lib/exercise-briefing";
import type { ScenarioBrief, ScenarioDraft, GenerationMode } from "@/lib/scenario-studio";
import styles from "./scenario-studio.module.css";
export function ExerciseBriefing({ brief, draft, mode, initiallyOpen = false }: { brief: ScenarioBrief; draft: ScenarioDraft; mode: GenerationMode; initiallyOpen?: boolean }) {
  const [open, setOpen] = useState(initiallyOpen);
  const [index, setIndex] = useState(0);
  const [includeControllers, setIncludeControllers] = useState(false);
  const [error, setError] = useState("");
  const all = buildBriefSections(brief, draft, mode);
  const sections = includeControllers ? all : all.filter((section) => !section.title.startsWith("Controller annex"));
  const activeIndex = Math.min(index, sections.length - 1);
  const active = sections[activeIndex];
  function download() {
    const url = URL.createObjectURL(new Blob([briefingHtml(sections)], { type: "text/html;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "afterburn-planning-brief.html"; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function print() {
    const view = window.open("", "_blank");
    if (!view) { setError("Allow a new window to print, or download the briefing and print it from your browser."); return; }
    view.opener = null;
    view.document.write(briefingHtml(sections)); view.document.close();
    view.focus(); view.print();
  }
  return <section className={styles.briefingBox}>
    <div className={styles.groupHeading}><div><p className={styles.eyebrow}>Built from your current plan</p><h2>Your planning brief</h2></div><Presentation size={24} /></div>
    <p className={styles.hint}>Overview, scenario, lanes, standards, schedule, and open decisions. Edit the plan and the brief updates with it.</p>
    <button type="button" className={styles.primary} onClick={() => setOpen(!open)} aria-expanded={open}>{open ? "Close briefing view" : "Review my briefing"}</button>
    {open && <>
      <label className={styles.checkbox}><input type="checkbox" checked={includeControllers} onChange={(event) => { setIncludeControllers(event.target.checked); setIndex(0); }} />Include controller annex and injects</label>
      <label className={styles.label}>Briefing section<select value={activeIndex} onChange={(event) => setIndex(Number(event.target.value))}>{sections.map((section, i) => <option key={i} value={i}>{i + 1}. {section.title}</option>)}</select></label>
      <article className={styles.briefSlide}><p className={styles.eyebrow}>Afterburn / Planning brief / {activeIndex + 1} of {sections.length}</p><h2>{active.title}</h2>{active.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}<ul>{active.bullets.map((bullet, i) => <li key={i}>{bullet}</li>)}</ul>{active.note && <p className={styles.hint}>{active.note}</p>}</article>
      <div className={styles.actions}><button type="button" className={styles.secondary} disabled={activeIndex === 0} onClick={() => setIndex(activeIndex - 1)}>Previous</button><button type="button" className={styles.secondary} disabled={activeIndex === sections.length - 1} onClick={() => setIndex(activeIndex + 1)}>Next</button><button type="button" className={styles.primary} onClick={print}><Printer size={16} /> Print / save as PDF</button><button type="button" className={styles.secondary} onClick={download}><Download size={16} /> Download briefing</button></div>
      <p className={styles.hint}>Download is a standalone HTML brief. Editable PowerPoint export is not included in this preview.</p>
      {error && <p className={styles.error} role="alert">{error}</p>}
    </>}
  </section>;
}
