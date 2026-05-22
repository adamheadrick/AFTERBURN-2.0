import { ButtonLink } from "@/components/button";
import { GraphicOverviewBuilder } from "@/components/graphic-overview-builder";
import { PageTitle } from "@/components/page-title";
import { Panel, PanelHeader } from "@/components/panel";
import { getAppData } from "@/lib/data";

export default async function GraphicOverviewPage() {
  const { exercise, scenario, syncMatrixEntries } = await getAppData();
  const mapQuery = encodeURIComponent(exercise.location || scenario.area_of_operations || "United States");
  const lanes = Array.from(new Set(syncMatrixEntries.map((entry) => entry.location_lane).filter(Boolean))).slice(0, 5);
  const recommendedLayers = [
    "Affected area / hazard footprint",
    "EOC, ICP, staging areas, shelters, and partner facilities",
    "Critical infrastructure and known outage locations",
    "Evacuation, access, or response routes",
    "Communications gaps or backup reporting paths",
    "Decision points and resource request locations"
  ];

  return (
    <div className="grid gap-6">
      <PageTitle
        eyebrow="Pre-event"
        title="Map / Graphic Overview"
        description="Build only the map information participants need to understand the problem, affected areas, routes, facilities, decisions, and coordination points."
      />

      <Panel>
        <PanelHeader title="Planning Graphic Builder" eyebrow={exercise.name} action={<ButtonLink href="/mission-assignment" variant="ghost">Next: Tasking</ButtonLink>} />
        <GraphicOverviewBuilder
          mapSrc={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
          layers={recommendedLayers}
          lanes={lanes}
        />
      </Panel>
    </div>
  );
}
