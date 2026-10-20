"use client";
import type { ScenarioBrief } from "@/lib/scenario-studio";
import styles from "./scenario-studio.module.css";
type Props = { brief: ScenarioBrief; onChange: (brief: ScenarioBrief) => void };

export function ExercisePlanningFields({ brief, onChange }: Props) {
  function updateLane(index: number, change: Partial<ScenarioBrief["lanes"][number]>) { onChange({ ...brief, lanes: brief.lanes.map((lane, i) => i === index ? { ...lane, ...change } : lane) }); }
  return <>
    <div className={styles.formGrid}>
      <label className={styles.label}>Exercise name (optional)<input maxLength={120} value={brief.name} onChange={(event) => onChange({ ...brief, name: event.target.value })} /></label>
      <label className={styles.label}>Dates or planning window<input maxLength={120} value={brief.dates} onChange={(event) => onChange({ ...brief, dates: event.target.value })} placeholder="Dates can stay undecided" /></label>
      <label className={styles.label}>Exercise days<select value={brief.days} onChange={(event) => { const days = Number(event.target.value); onChange({ ...brief, days, schedule: Array.from({ length: days }, (_, index) => ({ day: index + 1, label: brief.schedule.find((item) => item.day === index + 1)?.label ?? "" })) }); }}>{[1,2,3,4,5,6,7].map((day) => <option value={day} key={day}>{day} {day === 1 ? "day" : "days"}</option>)}</select></label>
    </div>
    {brief.days > 1 && <div className={styles.formGrid}>{Array.from({ length: brief.days }, (_, index) => <label key={index} className={styles.label}>Day {index + 1} focus<input maxLength={250} placeholder="Set up, rehearse, execute, assess…" value={brief.schedule.find((item) => item.day === index + 1)?.label ?? ""} onChange={(event) => onChange({ ...brief, schedule: Array.from({ length: brief.days }, (_, day) => ({ day: day + 1, label: day === index ? event.target.value : brief.schedule.find((item) => item.day === day + 1)?.label ?? "" })) })} /></label>)}</div>}
    <div className={styles.groupHeading}><h2>Connected lanes</h2><span>{brief.lanes.length ? `${brief.lanes.length} lanes` : "Optional for a single scenario"}</span></div>
    <p className={styles.hint}>Use a lane for a distinct operational problem or team. Capture dependencies when one lane’s decisions affect another.</p>
    {brief.lanes.map((lane, index) => <details className={styles.details} key={lane.id} open={brief.lanes.length === 1}>
      <summary>{lane.name || `Lane ${index + 1}`} · {lane.status}</summary>
      <div className={styles.refinement}>
        {lane.source && <p className={styles.hint}>{lane.source}</p>}
        <label className={styles.label}>Lane name<input required maxLength={180} value={lane.name} onChange={(event) => updateLane(index, { name: event.target.value })} /></label>
        <label className={styles.label}>Operational problem<textarea rows={3} maxLength={1500} value={lane.problem} onChange={(event) => updateLane(index, { problem: event.target.value })} /></label>
        <div className={styles.formGrid}><label className={styles.label}>Lead or lead organization<input maxLength={200} value={lane.lead} onChange={(event) => updateLane(index, { lead: event.target.value, status: "proposed" })} placeholder="Unassigned" /></label><label className={styles.label}>Lead commitment<select value={lane.status} onChange={(event) => updateLane(index, { status: event.target.value as "proposed" | "confirmed" })}><option value="proposed">Proposed / needs confirmation</option><option value="confirmed" disabled={!lane.lead.trim()}>Confirmed by planner</option></select></label></div>
        <label className={styles.label}>Draft performance standards<textarea rows={4} maxLength={1800} value={lane.standard} onChange={(event) => updateLane(index, { standard: event.target.value })} placeholder="What should the team accomplish, under what conditions, and to what standard?" /></label>
        <label className={styles.label}>Who evaluates it?<input maxLength={200} value={lane.evaluator} onChange={(event) => updateLane(index, { evaluator: event.target.value })} placeholder="Unassigned" /></label>
        <label className={styles.label}>How will it be measured?<input maxLength={500} value={lane.evidence} onChange={(event) => updateLane(index, { evidence: event.target.value })} placeholder="For example: radio log, sensor timestamps, and an evaluator’s record" /></label>
        <label className={styles.label}>Dependencies on other lanes<textarea rows={2} maxLength={1000} value={lane.dependencies} onChange={(event) => updateLane(index, { dependencies: event.target.value })} placeholder="Shared resources, information handoffs, access, command decisions…" /></label>
        <button type="button" className={styles.reset} onClick={() => onChange({ ...brief, lanes: brief.lanes.filter((_, i) => i !== index) })}>Remove this lane</button>
      </div>
    </details>)}
    {brief.lanes.length < 6 && <button type="button" className={styles.secondary} onClick={() => { const id = Math.max(0, ...brief.lanes.map((lane) => Number(lane.id.split("-")[1]))) + 1; onChange({ ...brief, lanes: [...brief.lanes, { id: `LANE-${id}`, name: `Lane ${id}`, problem: "", standard: "", lead: "", status: "proposed", evaluator: "", evidence: "", dependencies: "", source: "" }] }); }}>Add a lane</button>}
  </>;
}

export function PlanningActions({ brief, onChange }: Props) {
  function update(index: number, change: Partial<ScenarioBrief["planningItems"][number]>) { onChange({ ...brief, planningItems: brief.planningItems.map((item, i) => i === index ? { ...item, ...change } : item) }); }
  return <details className={styles.details}>
    <summary>Decisions, RFIs, and planning actions · {brief.planningItems.filter((item) => item.status !== "complete").length} open</summary>
    <p className={styles.hint}>Assign an owner and due date. Closing an action does not approve the exercise or confirm partner participation.</p>
    {brief.planningItems.map((item, index) => <div className={styles.refinement} key={item.id}>
      <label className={styles.label}>Question or action<textarea rows={2} maxLength={1500} value={item.question} onChange={(event) => update(index, { question: event.target.value })} /></label>
      <div className={styles.formGrid}><label className={styles.label}>Owner<input maxLength={200} value={item.owner} onChange={(event) => update(index, { owner: event.target.value })} placeholder="Unassigned" /></label><label className={styles.label}>Due<input maxLength={100} value={item.due} onChange={(event) => update(index, { due: event.target.value })} placeholder="Date or planning milestone" /></label><label className={styles.label}>Status<select value={item.status} onChange={(event) => update(index, { status: event.target.value as typeof item.status })}><option value="open">Open</option><option value="working">In progress</option><option value="complete">Complete</option></select></label></div>
      <p className={styles.hint}>{item.source || "Planner input"}</p>
      <button type="button" className={styles.reset} onClick={() => onChange({ ...brief, planningItems: brief.planningItems.filter((_, i) => i !== index) })}>Remove action</button>
    </div>)}
    {brief.planningItems.length < 30 && <button type="button" className={styles.secondary} onClick={() => onChange({ ...brief, planningItems: [...brief.planningItems, { id: crypto.randomUUID(), question: "New planning action", owner: "", due: "", status: "open", source: "" }] })}>Add planning action</button>}
  </details>;
}
