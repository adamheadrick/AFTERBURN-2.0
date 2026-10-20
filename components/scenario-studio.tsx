"use client";

import { ArrowLeft, ArrowRight, Check, Download, LoaderCircle, RotateCcw, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { briefSchema, exportScenarioMarkdown, initialBrief, savedStudioSchema, studioStorageKey, validateDraftForBrief, type GenerationMode, type ScenarioBrief, type ScenarioDraft } from "@/lib/scenario-studio";
import styles from "@/components/scenario-studio.module.css";

const steps = ["Find the purpose", "Set the scene", "Shape the story", "Review the plan"];
const startingPoints = [
  { label: "Coordinate across agencies", goal: "Practice clear handoffs and shared priorities between agencies when several urgent requests arrive at once." },
  { label: "Make decisions under pressure", goal: "Practice making and communicating defensible decisions with incomplete and conflicting information." },
  { label: "Keep communications working", goal: "Practice switching to backup communications and verifying that critical messages reach the right people." }
];

export function ScenarioStudio() {
  const [brief, setBrief] = useState<ScenarioBrief>(initialBrief);
  const [draft, setDraft] = useState<ScenarioDraft | null>(null);
  const [mode, setMode] = useState<GenerationMode>("example");
  const [step, setStep] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [revision, setRevision] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [storageStatus, setStorageStatus] = useState("Drafts stay in this browser. Export a copy to keep or share.");
  const [restored, setRestored] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const requestInFlight = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(studioStorageKey);
      if (raw) {
        const saved = savedStudioSchema.parse(JSON.parse(raw));
        setBrief(saved.brief); setDraft(saved.draft); setMode(saved.mode); setDirty(saved.dirty);
        setStep(!saved.draft ? Math.min(saved.step, 1) : saved.dirty && saved.step === 3 ? 2 : saved.step); setRestored(true);
      }
    } catch { setStorageStatus("The previous browser draft could not be restored. New work can still be exported."); }
    setHydrated(true);
    return () => requestRef.current?.abort();
  }, []);

  useEffect(() => {
    if (!hydrated || (!draft && !brief.goal && !brief.setting && !brief.participants)) return;
    try {
      localStorage.setItem(studioStorageKey, JSON.stringify({ version: 1, brief, draft, mode, step, dirty, updatedAt: new Date().toISOString() }));
      setStorageStatus("Saved in this browser · not in the shared exercise database");
    } catch { setStorageStatus("Browser saving is unavailable. Export your draft before leaving."); }
  }, [brief, draft, mode, step, dirty, hydrated]);

  useEffect(() => { headingRef.current?.focus(); }, [step]);

  function changeBrief<K extends keyof ScenarioBrief>(key: K, value: ScenarioBrief[K]) {
    setBrief((previous) => ({ ...previous, [key]: value })); setDirty(true); setError("");
  }
  function changeStory(key: "title" | "story", value: string) {
    setDraft((previous) => previous ? { ...previous, [key]: value } : previous); setDirty(true);
  }
  async function generate(action: "build" | "refine" | "plan") {
    if (requestInFlight.current) return;
    if (action === "plan" && draft && !dirty) { setError(""); setStep(3); return; }
    if (!briefSchema.safeParse(brief).success) { setError("Add your training goal, setting, and participating teams before generating."); return; }
    if (action !== "build" && (!draft?.story.trim() || !draft.title.trim())) { setError("Add a title and scenario story before continuing."); return; }
    requestInFlight.current = true; setBusy(true); setError("");
    const controller = new AbortController(); requestRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), 55000);
    try {
      const response = await fetch("/api/scenario-studio", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal,
        body: JSON.stringify({ brief, action, ...(action !== "build" ? { current: draft } : {}), ...(action === "refine" ? { revision } : {}) })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not generate a scenario. Please try again.");
      const nextDraft = validateDraftForBrief(result.draft, brief);
      if (result.mode !== "ai" && result.mode !== "example") throw new Error("The generation response was incomplete. Please try again.");
      setDraft(nextDraft); setMode(result.mode); setDirty(false); setRevision(""); setRestored(false); setStep(action === "plan" ? 3 : 2);
    } catch (cause) {
      setError(cause instanceof Error && cause.name !== "AbortError" ? cause.message : "Generation timed out. Your existing draft is unchanged; please try again.");
    } finally { clearTimeout(timeout); requestInFlight.current = false; setBusy(false); }
  }
  function exportDraft() {
    if (!draft) return;
    if (draft.objectives.some((objective) => !objective.criterion.trim())) { setError("Add a success criterion for each objective before exporting."); return; }
    const url = URL.createObjectURL(new Blob([exportScenarioMarkdown(brief, draft, mode)], { type: "text/markdown;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "afterburn-exercise-concept.md"; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function startOver() {
    if (!window.confirm("Start a new concept? Export first if you want to keep this browser draft.")) return;
    try { localStorage.removeItem(studioStorageKey); } catch { /* Storage may be unavailable. */ }
    setDraft(null); setBrief(initialBrief); setStep(0); setDirty(false); setError(""); setRevision(""); setRestored(false);
    setStorageStatus("Drafts stay in this browser. Export a copy to keep or share.");
  }

  return <div className={styles.studio}>
    <div className={styles.topline}><span className={styles.eyebrow}>Plan / New exercise concept</span><span className={styles.preview}>Design preview</span></div>
    <nav className={styles.steps} aria-label="Exercise concept progress">{steps.map((label, index) =>
      <button key={label} type="button" className={`${styles.step} ${index === step ? styles.activeStep : ""}`} aria-current={index === step ? "step" : undefined} disabled={busy || index > step || (index === 3 && dirty)} onClick={() => { setStep(index); setError(""); }}>
        <span className={styles.stepNumber}>{index < step ? <Check size={14} aria-hidden="true" /> : `0${index + 1}`}</span><span>{label}</span>
      </button>
    )}</nav>
    {restored && <div className={styles.notice} role="status">Your previous concept is ready to continue. <button type="button" onClick={() => setRestored(false)}>Dismiss</button></div>}
    <div className={styles.layout}>
      <section className={styles.main} aria-busy={busy}>
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>Step 0{step + 1} / 04</p>
          <h1 ref={headingRef} tabIndex={-1} className={styles.heading}>{step === 0 ? "What should your team do better?" : step === 1 ? "Give the story a place to start." : step === 2 ? "A situation worth practicing." : "One story. A purposeful exercise."}</h1>
          <p className={styles.intro}>{step === 0 ? "Start with the challenge. We’ll help turn it into a scenario that gives your people something meaningful to practice." : step === 1 ? "Just enough context to make the scenario yours. You can refine the operational details after the first draft." : step === 2 ? "Read it as a planner. Does this situation bring out the decisions and coordination you want to test?" : "Follow the thread from each objective to the event that tests it and the evidence you’ll capture."}</p>
        </div>
        <fieldset disabled={busy} className={styles.fields}>
          {step === 0 && <>
            <label className={styles.label} htmlFor="training-goal">We need to practice…</label>
            <textarea id="training-goal" className={styles.goal} rows={4} maxLength={1500} value={brief.goal} onChange={(event) => changeBrief("goal", event.target.value)} placeholder="For example: coordinating evacuation support between county emergency management and National Guard teams when communications fail." />
            <p className={styles.hint}>One or two sentences is enough. Describe the capability, decision, or handoff that matters.</p>
            <p className={styles.smallLabel}>Or choose a starting point</p>
            <div className={styles.startingPoints}>{startingPoints.map((point) => <button type="button" key={point.label} aria-pressed={brief.goal === point.goal} onClick={() => changeBrief("goal", point.goal)} className={styles.choice}>{point.label}<ArrowRight size={16} aria-hidden="true" /></button>)}</div>
            <div className={styles.actions}><button type="button" className={styles.primary} disabled={brief.goal.trim().length < 12} onClick={() => { setStep(1); setError(""); }}>Set the scene <ArrowRight size={17} aria-hidden="true" /></button><span className={styles.hint}>No long form. Start with the essentials.</span></div>
          </>}
          {step === 1 && <form onSubmit={(event) => { event.preventDefault(); void generate("build"); }}>
            <div className={styles.formGrid}>
              <label className={styles.label}>Where does it happen?<input required minLength={2} maxLength={300} value={brief.setting} onChange={(event) => changeBrief("setting", event.target.value)} placeholder="A county, installation, or fictional region" /></label>
              <label className={styles.label}>Who needs to work together?<input required minLength={2} maxLength={500} value={brief.participants} onChange={(event) => changeBrief("participants", event.target.value)} placeholder="County EM, fire, EMS, National Guard…" /></label>
              <label className={styles.label}>What puts them under pressure?<select value={brief.hazard} onChange={(event) => changeBrief("hazard", event.target.value as ScenarioBrief["hazard"])}>{briefSchema.shape.hazard.options.map((hazard) => <option key={hazard}>{hazard}</option>)}</select></label>
              <label className={styles.label}>How will they practice?<select value={brief.format} onChange={(event) => changeBrief("format", event.target.value as ScenarioBrief["format"])}>{briefSchema.shape.format.options.map((format) => <option key={format}>{format}</option>)}</select></label>
              <label className={styles.label}>Session length<select value={brief.duration} onChange={(event) => changeBrief("duration", event.target.value as ScenarioBrief["duration"])}><option value="60">60 minutes</option><option value="90">90 minutes</option><option value="120">120 minutes</option></select></label>
            </div>
            <p className={styles.hint}>{brief.format === "Tabletop" ? "Tabletop: work through decisions together, without deploying resources." : "Functional and full-scale concepts still need detailed control, safety, staffing, and simulation plans before conduct."}</p>
            <div className={styles.actions}><button type="button" className={styles.secondary} onClick={() => setStep(0)}><ArrowLeft size={16} /> Back</button><button type="submit" className={styles.primary}><Sparkles size={17} /> Build my scenario</button></div>
          </form>}
          {step === 2 && draft && <>
            <div className={styles.modeLine}><span className={styles.pill}>{mode === "ai" ? "AI-assisted draft" : "Illustrative example"}</span><span className={styles.hint}>Editable · planner review required</span></div>
            {mode === "example" && <p className={styles.notice}>Example mode uses your answers with a starter template. It does not interpret free-form revisions or derive a custom plan from story edits.</p>}
            <label className={styles.label}>Exercise title<input maxLength={120} value={draft.title} onChange={(event) => changeStory("title", event.target.value)} /></label>
            <label className={styles.label}>The opening story<textarea className={styles.story} rows={14} maxLength={8000} value={draft.story} onChange={(event) => changeStory("story", event.target.value)} /></label>
            <details className={styles.details}><summary>Assumptions to confirm <span>{draft.assumptions.length}</span></summary><ul>{draft.assumptions.map((assumption, index) => <li key={index}>{assumption}</li>)}</ul></details>
            {mode === "ai" && <div className={styles.refinement}><label className={styles.label}>What would make this more useful?<textarea rows={2} maxLength={1500} value={revision} onChange={(event) => setRevision(event.target.value)} placeholder="Make the communications failure the central challenge; keep the incident smaller." /></label><button type="button" className={styles.secondary} disabled={!revision.trim()} onClick={() => void generate("refine")}><Sparkles size={16} /> Refine the scenario</button></div>}
            <div className={styles.actions}><button type="button" className={styles.secondary} onClick={() => setStep(1)}><ArrowLeft size={16} /> Edit the setup</button><button type="button" className={styles.primary} disabled={!draft.story.trim() || !draft.title.trim()} onClick={() => void generate("plan")}>{mode === "ai" ? "Build plan from this story" : "Review starter plan"} <ArrowRight size={17} /></button></div>
          </>}
          {step === 3 && draft && <>
            {mode === "example" && <p className={styles.notice}>This is a starter plan. Review its objectives and injects against your story before use; example mode does not adapt them to free-form edits.</p>}
            <div className={styles.planTitle}><div><p className={styles.eyebrow}>{brief.format} · {brief.duration} minutes</p><h2>{draft.title}</h2></div><span className={styles.pill}>Draft concept</span></div>
            <details className={styles.details}><summary>Read the scenario and assumptions</summary><p className={styles.storyRead}>{draft.story}</p><ul>{draft.assumptions.map((assumption, index) => <li key={index}>{assumption}</li>)}</ul></details>
            <div className={styles.groupHeading}><h2>What you’ll test</h2><span>{draft.objectives.length} objectives</span></div>
            <div className={styles.objectives}>{draft.objectives.map((objective) => <article key={objective.id} className={styles.objective}>
              <span className={styles.eyebrow}>{objective.id}</span><h3>{objective.title}</h3><p>{objective.action}</p>
              <label className={styles.label}>Proposed success criterion<textarea rows={3} maxLength={3000} value={objective.criterion} onChange={(event) => setDraft({ ...draft, objectives: draft.objectives.map((item) => item.id === objective.id ? { ...item, criterion: event.target.value } : item) })} /></label>
              <div className={styles.evidence}><span className={styles.smallLabel}>Evidence to capture</span><p>{objective.evidence}</p></div>
            </article>)}</div>
            <div className={styles.groupHeading}><h2>How the situation unfolds</h2><span>{draft.injects.length} injects</span></div>
            <ol className={styles.timeline}>{draft.injects.map((inject) => <li key={inject.id}>
              <div className={styles.time}>T+{String(inject.minute).padStart(2, "0")}<small>min</small></div><div><div className={styles.injectMeta}>{inject.id} <span>Tests {inject.objectiveId}</span></div><h3>{inject.event}</h3><p><strong>To:</strong> {inject.recipient}</p><p><strong>Look for:</strong> {inject.expectedAction}</p></div>
            </li>)}</ol>
            <details className={styles.details}><summary>Controller notes and preparation</summary><ul>{draft.controllerNotes.map((note, index) => <li key={index}>{note}</li>)}</ul></details>
            <div className={styles.handoff}><span className={styles.eyebrow}>Next planning decisions</span><h3>Put people and standards behind the story.</h3><p>Confirm authorities and resources, refine evaluation targets, and assign controllers and evaluators. This concept is ready to discuss; it is not yet an approved exercise.</p></div>
            <div className={styles.actions}><button type="button" className={styles.secondary} onClick={() => setStep(2)}><ArrowLeft size={16} /> Back to the story</button><button type="button" className={styles.primary} onClick={exportDraft}><Download size={17} /> Export exercise concept</button></div>
          </>}
        </fieldset>
        {busy && <div className={styles.loading} role="status"><LoaderCircle size={19} className={styles.spin} /> Connecting your story, objectives, and evidence…</div>}
        {error && <div className={styles.error} role="alert">{error}{error.startsWith("Sign in") && <> <Link href="/login">Go to sign in</Link></>}</div>}
      </section>
      <aside className={styles.sidebar} aria-label="Exercise concept summary">
        <div className={styles.sideCard}><span className={styles.eyebrow}>The throughline</span><h2>Purpose first.<br />The story follows.</h2><p>A good scenario creates the right decisions. Every inject should test an objective. Every assessment should rest on evidence.</p><div className={styles.thread}><span>Training goal</span><span>Scenario & decisions</span><span>Objectives & injects</span><span>Evidence & improvement</span></div></div>
        {brief.goal && <div className={styles.summary}><p className={styles.eyebrow}>Your exercise, taking shape</p><p>{brief.goal}</p>{brief.setting && <dl><div><dt>Setting</dt><dd>{brief.setting}</dd></div>{brief.participants && <div><dt>Teams</dt><dd>{brief.participants}</dd></div>}<div><dt>Format</dt><dd>{brief.format} · {brief.duration} min</dd></div><div><dt>Pressure</dt><dd>{brief.hazard}</dd></div></dl>}</div>}
        <p className={styles.storage} role="status">{storageStatus}</p>
        {draft && <button disabled={busy} type="button" className={styles.reset} onClick={startOver}><RotateCcw size={14} /> Start another concept</button>}
      </aside>
    </div>
  </div>;
}
