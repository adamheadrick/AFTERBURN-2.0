import { RadioTower } from "lucide-react";
import { AiGenerator } from "@/components/ai-generator";
import { PageTitle } from "@/components/page-title";
import { Panel, PanelHeader } from "@/components/panel";
import { getAppData } from "@/lib/data";

export default async function WhiteCellPage() {
  const { exercise, scenario, injects, syncMatrixEntries, evaluatorAssignments, decisionPoints } = await getAppData();
  const nextInject = injects[1] ?? injects[0];
  const activeRows = syncMatrixEntries.filter((row) => row.status === "active" || row.status === "gap").slice(0, 3);

  return (
    <div className="grid gap-6">
      <PageTitle
        eyebrow="Exercise control"
        title="Exercise Control / White Cell Assistant"
        description="Support controllers during live play with inject timing, observation prompts, decision reminders, and hotwash questions."
      />

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Panel>
          <PanelHeader title="Control Snapshot" eyebrow={exercise.name} action={<RadioTower className="text-flare" size={20} />} />
          <div className="grid gap-4 p-5">
            <div className="rounded-md border border-line bg-night p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">Next inject</p>
              {nextInject ? (
                <>
                  <h2 className="mt-2 text-lg font-black text-ink">{nextInject.inject_time} | {nextInject.inject_type}</h2>
                  <p className="mt-2 text-sm leading-6 text-steel">{nextInject.description}</p>
                </>
              ) : (
                <>
                  <h2 className="mt-2 text-lg font-black text-ink">No injects loaded</h2>
                  <p className="mt-2 text-sm leading-6 text-steel">Add MSEL / inject rows before using White Cell guidance during exercise play.</p>
                </>
              )}
            </div>
            {activeRows.map((row) => (
              <div key={row.id} className="rounded-md border border-line bg-panel p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">{row.time_block} | {row.organization}</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-ink">{row.task}</p>
                <p className="mt-2 text-sm leading-6 text-steel">{row.notes}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="AI Exercise Control Support" eyebrow="Live event prompts" />
          <div className="p-5">
            <AiGenerator
              endpoint="/api/white-cell-assistant"
              buttonLabel="Generate Control Guidance"
              payload={{ exercise, scenario, injects, syncMatrixEntries, evaluatorAssignments, decisionPoints, currentTimeBlock: "1000-1100" }}
              initialOutput="Generate controller guidance for current exercise play: next inject, delayed inject adjustment, friction capture prompts, decision point reminders, observer prompts, hotwash questions, and end-of-phase notes."
              outputLabel="Exercise Control Guidance"
              large
            />
          </div>
        </Panel>
      </section>
    </div>
  );
}
