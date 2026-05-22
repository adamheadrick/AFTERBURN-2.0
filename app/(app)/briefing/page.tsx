import { Presentation } from "lucide-react";
import { ButtonLink } from "@/components/button";
import { PageTitle } from "@/components/page-title";
import { Panel, PanelHeader } from "@/components/panel";
import { getAppData } from "@/lib/data";

export default async function BriefingPage() {
  const { exercise, scenario, objectives, syncMatrixEntries, readinessScore, analysis, poamItems } = await getAppData();
  const personnel = syncMatrixEntries.reduce((sum, row) => sum + row.boots_on_ground, 0);

  return (
    <div className="grid gap-6">
      <PageTitle
        eyebrow="Leadership view"
        title="Leadership Brief"
        description="Convert exercise data into a clean leader-level layout for pre-event and post-event briefs."
      />

      <Panel>
        <PanelHeader title="Pre-Event Leadership Brief" eyebrow={exercise.name} action={<Presentation className="text-flare" size={20} />} />
        <div className="grid gap-4 p-5 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-md border border-line bg-night p-5">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">Scenario overview</p>
            <h2 className="mt-2 text-2xl font-black text-ink">{exercise.scenario_category}</h2>
            <p className="mt-3 text-sm leading-6 text-steel">{scenario.generated_narrative}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-line bg-night p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">Readiness</p>
              <p className="mt-2 text-4xl font-black text-ink">{readinessScore.score}%</p>
              <p className="mt-1 text-sm font-black text-flare">{readinessScore.label}</p>
            </div>
            <div className="rounded-md border border-line bg-night p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">Personnel</p>
              <p className="mt-2 text-4xl font-black text-ink">{personnel}</p>
              <p className="mt-1 text-sm font-semibold text-steel">Rehearsal timeline estimate</p>
            </div>
            <div className="rounded-md border border-line bg-night p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">Objectives</p>
              <p className="mt-2 text-4xl font-black text-ink">{objectives.length}</p>
            </div>
            <div className="rounded-md border border-line bg-night p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">Open improvements</p>
              <p className="mt-2 text-4xl font-black text-ink">{poamItems.filter((item) => item.status !== "complete").length}</p>
            </div>
          </div>
        </div>
      </Panel>

      <Panel>
        <PanelHeader title="Post-Event Leadership Brief" eyebrow="AAR-ready summary" action={<ButtonLink href="/exsum" variant="ghost">Open Summary</ButtonLink>} />
        <div className="grid gap-4 p-5 lg:grid-cols-3">
          <div className="rounded-md border border-line bg-night p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">Top sustains</p>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-ink">
              {analysis.sustains.slice(0, 5).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="rounded-md border border-line bg-night p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">Top improves</p>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-ink">
              {analysis.improves.slice(0, 5).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="rounded-md border border-line bg-night p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">Recommended decisions</p>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-ink">
              {analysis.recommendations.slice(0, 5).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </Panel>
    </div>
  );
}
