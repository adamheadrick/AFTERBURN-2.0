import { Link2 } from "lucide-react";
import { PageTitle } from "@/components/page-title";
import { Panel, PanelHeader } from "@/components/panel";
import { getAppData } from "@/lib/data";

export default async function EvidencePage() {
  const { exercise, evidenceItems, poamItems } = await getAppData();

  return (
    <div className="grid gap-6">
      <PageTitle
        eyebrow="AAR defensibility"
        title="AAR Evidence Binder"
        description="Link final findings back to observer notes, rehearsal timeline rows, hotwash comments, decision logs, photos, and communications records."
      />

      <Panel>
        <PanelHeader title="Evidence Register" eyebrow={exercise.name} action={<Link2 className="text-flare" size={20} />} />
        <div className="grid gap-4 p-5">
          {poamItems.map((finding) => {
            const linked = evidenceItems.filter((item) => item.finding_id === finding.finding_id);

            return (
              <div key={finding.id} className="rounded-md border border-line bg-night p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">{finding.finding_id}</p>
                <h2 className="mt-2 text-lg font-black text-ink">{finding.finding}</h2>
                <div className="mt-4 grid gap-3 lg:grid-cols-3">
                  {linked.map((item) => (
                    <div key={item.id} className="rounded-md border border-line bg-panel p-4">
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">{item.evidence_type.replaceAll("_", " ")}</p>
                      <h3 className="mt-2 text-sm font-black text-ink">{item.source_label}</h3>
                      <p className="mt-2 text-sm leading-6 text-steel">{item.summary}</p>
                      <p className="mt-3 text-xs font-bold leading-5 text-ink">{item.relevance}</p>
                    </div>
                  ))}
                  {!linked.length ? (
                    <div className="rounded-md border border-line bg-panel p-4 text-sm font-semibold text-ink">No evidence linked yet.</div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
