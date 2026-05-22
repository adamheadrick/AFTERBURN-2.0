import { Archive, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/button";
import { PageTitle } from "@/components/page-title";
import { Panel, PanelHeader } from "@/components/panel";
import { getAppData } from "@/lib/data";

export default async function ExercisePackagePage() {
  const data = await getAppData();
  const packageItems = [
    ["Scenario", Boolean(data.scenario.generated_narrative), "/scenario-builder"],
    ["Tasking / mission assignment", Boolean(data.missionAssignment.mission_number), "/mission-assignment"],
    ["Graphic overview", Boolean(data.exercise.location || data.scenario.area_of_operations || data.syncMatrixEntries.length), "/graphic-overview"],
    ["Rehearsal timeline / sync matrix", data.syncMatrixEntries.length > 0, "/sync-matrix"],
    ["Rehearsal script", data.syncMatrixEntries.length > 0, "/sync-matrix"],
    ["Inject list / MSEL", data.injects.length > 0, "/injects"],
    ["Observation plan", data.evaluatorAssignments.length > 0, "/evaluators"],
    ["Decision point log", data.decisionPoints.length > 0, "/decision-points"],
    ["Hotwash / feedback results", data.feedbackEntries.length > 0, "/feedback"],
    ["Executive summary / AAR", Boolean(data.exsum.content), "/exsum"],
    ["Organization reviews", data.feedbackEntries.length > 0, "/exsum"],
    ["Improvement plan / POA&M", data.poamItems.length > 0, "/poam"],
    ["Evidence binder", data.evidenceItems.length > 0, "/evidence"]
  ];
  const complete = packageItems.filter(([, done]) => done).length;

  return (
    <div className="grid gap-6">
      <PageTitle
        eyebrow="Final product"
        title="Exercise Package"
        description="Bundle the planning package, execution tools, observation products, AAR outputs, and corrective action tracker into one staff-ready package."
      />

      <Panel>
        <PanelHeader title="Package Builder" eyebrow={data.exercise.name} action={<Archive className="text-flare" size={20} />} />
        <div className="p-5">
          <div className="rounded-md border border-line bg-night p-5">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">Package completion</p>
            <p className="mt-2 text-5xl font-black text-ink">{complete}/{packageItems.length}</p>
            <p className="mt-2 text-sm font-semibold text-steel">Package export controls are visible for workflow review and can be connected to Word/PDF generation when ready.</p>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {packageItems.map(([label, done, href]) => (
              <a key={label as string} href={href as string} className="flex items-center justify-between gap-3 rounded-md border border-line bg-panel p-4 hover:border-flare/60 hover:bg-field">
                <span className="font-black text-ink">{label as string}</span>
                {done ? <CheckCircle2 className="text-signal" size={20} /> : <span className="text-xs font-black uppercase tracking-[0.12em] text-ember">Needs input</span>}
              </a>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button variant="flame" type="button">Export Exercise Package</Button>
            <Button variant="ghost" type="button">Export PDF</Button>
            <Button variant="ghost" type="button">Export Word</Button>
          </div>
        </div>
      </Panel>
    </div>
  );
}
