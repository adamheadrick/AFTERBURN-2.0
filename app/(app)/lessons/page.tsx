import { BookOpenCheck, Layers } from "lucide-react";
import { PageTitle } from "@/components/page-title";
import { Panel, PanelHeader } from "@/components/panel";
import { PoamStatusBadge } from "@/components/status-badge";
import { getAppData } from "@/lib/data";

export default async function LessonsPage() {
  const { exercise, capabilityGaps } = await getAppData();

  return (
    <div className="grid gap-6">
      <PageTitle
        eyebrow="Institutional memory"
        title="Lessons Learned Repository"
        description="Track recurring capability gaps, recommendations, best practices, and category tags across exercises."
      />

      <section className="grid gap-4 lg:grid-cols-3">
        {capabilityGaps.map((gap) => (
          <div key={gap.id} className="rounded-md border border-line bg-night p-4">
            <div className="flex items-start justify-between gap-3">
              <BookOpenCheck className="text-flare" size={20} />
              <PoamStatusBadge status={gap.status} />
            </div>
            <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-flare">{gap.civilian_category}</p>
            <h2 className="mt-2 text-lg font-black text-ink">{gap.gap}</h2>
            <p className="mt-3 text-sm leading-6 text-steel">{gap.recommendation}</p>
            <div className="mt-4 grid gap-2 text-xs font-black uppercase tracking-[0.12em] text-steel">
              <span>Capability: <span className="text-ink">{gap.capability_area}</span></span>
              <span>Optional Army function: <span className="text-ink">{gap.warfighting_function}</span></span>
              <span>Recurrence: <span className="text-flare">{gap.recurrence_count} events</span></span>
            </div>
          </div>
        ))}
      </section>

      <Panel>
        <PanelHeader title="Redundancy Screen" eyebrow={exercise.name} action={<Layers className="text-flare" size={20} />} />
        <div className="grid gap-4 p-5 md:grid-cols-3">
          {capabilityGaps.map((gap) => (
            <div key={gap.id} className="rounded-md border border-line bg-panel p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">{gap.affected_entities.join(" / ")}</p>
              <h3 className="mt-2 text-base font-black text-ink">Best practice</h3>
              <p className="mt-2 text-sm leading-6 text-steel">{gap.best_practice}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
