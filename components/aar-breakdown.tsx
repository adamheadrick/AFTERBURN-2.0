import { Building2, Layers3, Users } from "lucide-react";
import { PriorityBadge } from "@/components/status-badge";
import type { FeedbackEntry, SyncMatrixEntry } from "@/lib/types/database";

function groupBy<T>(items: T[], getKey: (item: T) => string) {
  return items.reduce<Record<string, T[]>>((groups, item) => {
    const key = getKey(item) || "Unassigned";
    groups[key] = [...(groups[key] ?? []), item];
    return groups;
  }, {});
}

function highPriority(entries: FeedbackEntry[]) {
  return entries.filter((entry) => entry.priority === "critical" || entry.priority === "high").length;
}

export function AarBreakdown({
  feedbackEntries,
  syncMatrixEntries
}: {
  feedbackEntries: FeedbackEntry[];
  syncMatrixEntries: SyncMatrixEntry[];
}) {
  const byOrganization = Object.entries(groupBy(feedbackEntries, (entry) => entry.organization));
  const byLane = Object.entries(groupBy(feedbackEntries, (entry) => entry.operational_lane));
  const syncByEntity = Object.entries(groupBy(syncMatrixEntries, (entry) => entry.organization));

  return (
    <div className="grid gap-5">
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-md border border-line bg-night p-4">
          <Users className="text-ember" size={18} />
          <p className="mt-3 text-2xl font-black text-ink">All participants</p>
          <p className="mt-2 text-sm leading-6 text-steel">Senior leader executive summary covering the whole exercise audience.</p>
        </div>
        <div className="rounded-md border border-line bg-night p-4">
          <Layers3 className="text-ember" size={18} />
          <p className="mt-3 text-2xl font-black text-ink">{byLane.length}</p>
          <p className="mt-2 text-sm leading-6 text-steel">Functional categories available for lane-specific AARs.</p>
        </div>
        <div className="rounded-md border border-line bg-night p-4">
          <Building2 className="text-ember" size={18} />
          <p className="mt-3 text-2xl font-black text-ink">{byOrganization.length}</p>
          <p className="mt-2 text-sm leading-6 text-steel">Organization breakouts available for partner reviews.</p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-md border border-line bg-night p-4">
          <p className="text-sm font-black text-ink">Category / Function Breakouts</p>
          <div className="mt-3 grid gap-3">
            {byLane.map(([lane, entries]) => (
              <div key={lane} className="rounded-md border border-line bg-panel p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-black text-ink">{lane}</p>
                  <span className="text-xs font-black text-flare">{entries.length} observation(s)</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-steel">{entries[0]?.capability_gap || entries[0]?.friction || "No gap narrative captured."}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-md border border-line bg-night p-4">
          <p className="text-sm font-black text-ink">Organization Breakouts</p>
          <div className="mt-3 grid gap-3">
            {byOrganization.map(([organization, entries]) => {
              const syncRows = syncByEntity.find(([entity]) => entity === organization)?.[1] ?? [];

              return (
                <div key={organization} className="rounded-md border border-line bg-panel p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-black text-ink">{organization}</p>
                    <span className="text-xs font-black text-flare">{syncRows.length} sync row(s)</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-md border border-line bg-night px-2 py-1 text-xs font-black text-steel">{entries.length} observation(s)</span>
                    <span className="rounded-md border border-line bg-night px-2 py-1 text-xs font-black text-steel">{highPriority(entries)} high/critical</span>
                    {entries[0] ? <PriorityBadge priority={entries[0].priority} /> : null}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-steel">{entries[0]?.recommended_corrective_action || "No corrective action captured."}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
