import { BarChart3, TrendingUp } from "lucide-react";
import { PageTitle } from "@/components/page-title";
import { Panel, PanelHeader } from "@/components/panel";
import { getAppData } from "@/lib/data";

export default async function InsightsPage() {
  const { exercise, trendInsights, capabilityGaps, poamItems } = await getAppData();
  const openPoam = poamItems.filter((item) => item.status !== "complete").length;
  const repeatedGaps = capabilityGaps.filter((gap) => gap.recurrence_count > 1).length;

  return (
    <div className="grid gap-6">
      <PageTitle
        eyebrow="Portfolio analytics"
        title="Insights / Trends"
        description="Identify recurring friction, repeated capability gaps, open improvement items, and long-term readiness risk across exercises."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-md border border-line bg-night p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">Repeated gaps</p>
          <p className="mt-2 text-4xl font-black text-ink">{repeatedGaps}</p>
        </div>
        <div className="rounded-md border border-line bg-night p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">Open improvements</p>
          <p className="mt-2 text-4xl font-black text-ink">{openPoam}</p>
        </div>
        <div className="rounded-md border border-line bg-night p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">Trend signals</p>
          <p className="mt-2 text-4xl font-black text-ink">{trendInsights.length}</p>
        </div>
      </section>

      <Panel>
        <PanelHeader title="Readiness Trend Signals" eyebrow={exercise.name} action={<TrendingUp className="text-flare" size={20} />} />
        <div className="grid gap-4 p-5 lg:grid-cols-3">
          {trendInsights.map((insight) => (
            <div key={insight.id} className="rounded-md border border-line bg-night p-4">
              <BarChart3 className="text-ember" size={20} />
              <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-flare">{insight.category}</p>
              <h2 className="mt-2 text-lg font-black text-ink">{insight.title}</h2>
              <p className="mt-3 text-2xl font-black text-flare">{insight.metric}</p>
              <p className="mt-3 text-sm font-semibold leading-6 text-ink">{insight.signal}</p>
              <p className="mt-3 text-sm leading-6 text-steel">{insight.detail}</p>
              <p className="mt-4 text-sm font-black leading-6 text-ink">{insight.recommended_action}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
