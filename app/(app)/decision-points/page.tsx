import { GitBranch, Plus } from "lucide-react";
import { Button } from "@/components/button";
import { PageTitle } from "@/components/page-title";
import { Field, inputStyles, Panel, PanelHeader } from "@/components/panel";
import { PriorityBadge } from "@/components/status-badge";
import { getAppData } from "@/lib/data";

export default async function DecisionPointsPage() {
  const { exercise, decisionPoints } = await getAppData();

  return (
    <div className="grid gap-6">
      <PageTitle
        eyebrow="Command decisions"
        title="Decision Point Tracker"
        description="Capture time-sensitive decisions, authorities, options, outcomes, and AAR relevance for leadership-focused assessment."
      />

      <Panel>
        <PanelHeader title="Decision Log" eyebrow={exercise.name} action={<GitBranch className="text-flare" size={20} />} />
        <div className="grid gap-4 p-5">
          {decisionPoints.map((point) => (
            <div key={point.id} className="rounded-md border border-line bg-night p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-flare">{point.time_window} | {point.status}</p>
                  <h2 className="mt-2 text-xl font-black text-ink">{point.decision_required}</h2>
                </div>
                <PriorityBadge priority={point.priority} />
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-steel">Authority</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-ink">{point.decision_authority}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-steel">Information Available</p>
                  <p className="mt-2 text-sm leading-6 text-steel">{point.information_available}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-steel">AAR Relevance</p>
                  <p className="mt-2 text-sm leading-6 text-steel">{point.aar_relevance}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className="rounded-md border border-line bg-panel p-3">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">Options considered</p>
                  <ul className="mt-2 grid gap-1 text-sm text-ink">
                    {point.options_considered.map((option) => <li key={option}>{option}</li>)}
                  </ul>
                </div>
                <div className="rounded-md border border-line bg-panel p-3">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">Actual decision / outcome</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-ink">{point.actual_decision}</p>
                  <p className="mt-2 text-sm leading-6 text-steel">{point.outcome}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <PanelHeader title="Add Decision Point" eyebrow="Decision input" />
        <form className="grid gap-4 p-5 md:grid-cols-2">
          <Field label="Decision required"><input className={inputStyles} placeholder="Describe the decision participants must make" /></Field>
          <Field label="Decision authority"><input className={inputStyles} placeholder="Identify who is authorized to decide" /></Field>
          <Field label="Time-sensitive window"><input className={inputStyles} placeholder="Enter the decision window or phase" /></Field>
          <Field label="AAR relevance"><input className={inputStyles} placeholder="Explain why this decision matters for the AAR" /></Field>
          <Field label="Information available"><textarea className={inputStyles} rows={4} placeholder="List what decision-makers know at the time." /></Field>
          <Field label="Options considered"><textarea className={inputStyles} rows={4} placeholder="List realistic options participants may consider." /></Field>
          <div className="md:col-span-2">
            <Button variant="ember" type="button"><Plus size={17} /> Add Decision Point</Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}
