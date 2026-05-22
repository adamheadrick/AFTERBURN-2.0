"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Clock3, Download, ListChecks, Mic2, Plus, Sparkles, Trash2, Users } from "lucide-react";
import { Button } from "@/components/button";
import { inputStyles } from "@/components/panel";
import type { SyncMatrixEntry, SyncMatrixStatus } from "@/lib/types/database";

const statusOptions: SyncMatrixStatus[] = ["planned", "active", "complete", "gap", "unassigned"];
const views = [
  { id: "rehearsal", label: "Script", icon: Mic2 },
  { id: "timeline", label: "Timeline", icon: Clock3 },
  { id: "gaps", label: "Gaps", icon: AlertTriangle },
  { id: "resources", label: "Resources", icon: Users },
  { id: "details", label: "Details", icon: ListChecks }
] as const;

type ViewId = (typeof views)[number]["id"];

function blankEntry(exerciseId: string, index: number): SyncMatrixEntry {
  const hour = 8 + index;
  const nextHour = hour + 1;

  return {
    id: `local-${Date.now()}-${index}`,
    exercise_id: exerciseId,
    time_block: `${String(hour).padStart(2, "0")}00-${String(nextHour).padStart(2, "0")}00`,
    external_effect: "",
    inject_trigger: "",
    organization: "",
    task: "",
    purpose: "",
    boots_on_ground: 0,
    equipment_assets: "",
    location_lane: "",
    supported_objective: "",
    supported_mission_task: "",
    communications_reporting: "",
    expected_output: "",
    status: "unassigned",
    notes: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function blankOrganizationEntry({
  exerciseId,
  timeBlock,
  organization,
  index,
  source
}: {
  exerciseId: string;
  timeBlock: string;
  organization: string;
  index: number;
  source?: SyncMatrixEntry;
}): SyncMatrixEntry {
  return {
    id: `local-${Date.now()}-${index}`,
    exercise_id: exerciseId,
    time_block: timeBlock,
    external_effect: source?.external_effect ?? "",
    inject_trigger: source?.inject_trigger ?? "",
    organization,
    task: "",
    purpose: "",
    boots_on_ground: 0,
    equipment_assets: "",
    location_lane: source?.location_lane ?? "",
    supported_objective: source?.supported_objective ?? "",
    supported_mission_task: source?.supported_mission_task ?? "",
    communications_reporting: "",
    expected_output: "",
    status: "planned",
    notes: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

export function SyncMatrixClient({
  exerciseId,
  initialEntries,
  participatingOrganizations,
  aiPayload
}: {
  exerciseId: string;
  initialEntries: SyncMatrixEntry[];
  participatingOrganizations: string[];
  aiPayload: Record<string, unknown>;
}) {
  const [entries, setEntries] = useState(initialEntries);
  const [organizationFilter, setOrganizationFilter] = useState("");
  const [objectiveFilter, setObjectiveFilter] = useState("");
  const [taskFilter, setTaskFilter] = useState("");
  const [laneFilter, setLaneFilter] = useState("");
  const [aiOutput, setAiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeView, setActiveView] = useState<ViewId>("rehearsal");
  const [addOrgByTime, setAddOrgByTime] = useState<Record<string, string>>({});

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const organizationMatch = !organizationFilter || entry.organization.toLowerCase().includes(organizationFilter.toLowerCase());
      const objectiveMatch = !objectiveFilter || entry.supported_objective.toLowerCase().includes(objectiveFilter.toLowerCase());
      const taskMatch = !taskFilter || entry.supported_mission_task.toLowerCase().includes(taskFilter.toLowerCase());
      const laneMatch = !laneFilter || entry.location_lane.toLowerCase().includes(laneFilter.toLowerCase());
      return organizationMatch && objectiveMatch && taskMatch && laneMatch;
    });
  }, [entries, laneFilter, objectiveFilter, organizationFilter, taskFilter]);

  const byHour = useMemo(() => {
    const totals = new Map<string, number>();
    entries.forEach((entry) => totals.set(entry.time_block, (totals.get(entry.time_block) ?? 0) + entry.boots_on_ground));
    return Array.from(totals.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [entries]);

  const byOrganization = useMemo(() => {
    const totals = new Map<string, number>();
    entries.forEach((entry) => {
      if (entry.organization) {
        totals.set(entry.organization, (totals.get(entry.organization) ?? 0) + entry.boots_on_ground);
      }
    });
    return Array.from(totals.entries()).sort((a, b) => b[1] - a[1]);
  }, [entries]);

  const entriesByTime = useMemo(() => {
    const grouped = new Map<string, SyncMatrixEntry[]>();
    filteredEntries.forEach((entry) => grouped.set(entry.time_block, [...(grouped.get(entry.time_block) ?? []), entry]));
    return Array.from(grouped.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredEntries]);

  const allOrganizations = useMemo(() => {
    return Array.from(
      new Set(
        [...participatingOrganizations, ...entries.map((entry) => entry.organization)]
          .map((organization) => organization.trim())
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [entries, participatingOrganizations]);

  const resourceSurges = byHour.filter(([, total]) => total >= 40);
  const gapEntries = entries.filter((entry) => entry.status === "gap" || entry.status === "unassigned" || !entry.organization);
  const [peakHour, peakPersonnel] = byHour.reduce(
    (peak, current) => (current[1] > peak[1] ? current : peak),
    ["None", 0] as [string, number]
  );
  const totalPersonnel = entries.reduce((sum, entry) => sum + entry.boots_on_ground, 0);
  const filteredPersonnel = filteredEntries.reduce((sum, entry) => sum + entry.boots_on_ground, 0);
  const hasActiveFilters = Boolean(organizationFilter || objectiveFilter || taskFilter || laneFilter);
  const commandStats = [
    { label: "Visible rows", value: `${filteredEntries.length}/${entries.length}` },
    { label: "Visible segments", value: entriesByTime.length },
    { label: "Visible personnel", value: filteredPersonnel },
    { label: "Items needing review", value: gapEntries.length }
  ];

  function updateEntry(id: string, patch: Partial<SyncMatrixEntry>) {
    setEntries((current) => current.map((entry) => (entry.id === id ? { ...entry, ...patch, updated_at: new Date().toISOString() } : entry)));
  }

  function clearFilters() {
    setOrganizationFilter("");
    setObjectiveFilter("");
    setTaskFilter("");
    setLaneFilter("");
  }

  function addOrganizationBrief(timeBlock: string, organization: string) {
    if (!organization) {
      return;
    }

    setEntries((current) => {
      const source = current.find((entry) => entry.time_block === timeBlock);
      const alreadyExists = current.some((entry) => entry.time_block === timeBlock && entry.organization === organization);

      if (alreadyExists) {
        return current;
      }

      return [
        ...current,
        blankOrganizationEntry({
          exerciseId,
          timeBlock,
          organization,
          index: current.length,
          source
        })
      ];
    });
  }

  function addMissingOrganizationBriefs(timeBlock: string, organizations: string[]) {
    if (!organizations.length) {
      return;
    }

    setEntries((current) => {
      const source = current.find((entry) => entry.time_block === timeBlock);
      const existingOrganizations = new Set(current.filter((entry) => entry.time_block === timeBlock).map((entry) => entry.organization));
      const additions = organizations
        .filter((organization) => organization && !existingOrganizations.has(organization))
        .map((organization, index) =>
          blankOrganizationEntry({
            exerciseId,
            timeBlock,
            organization,
            index: current.length + index,
            source
          })
        );

      return additions.length ? [...current, ...additions] : current;
    });
  }

  async function generateMatrix() {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-sync-matrix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aiPayload)
      });
      const data = (await response.json()) as { text?: string; error?: string };
      setAiOutput(data.text ?? data.error ?? "Generation failed.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 rounded-md border border-line bg-night p-4 lg:grid-cols-[1fr_360px]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-flare">Rehearsal timeline view</p>
          <h3 className="mt-2 text-2xl font-black text-ink">Synchronize the event by hour</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-steel">
            Give every participating organization a briefable script for each segment: task, purpose, personnel, location,
            equipment, reporting, and expected output. Use the detailed grid only when a planner needs every field.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="ghost" type="button" onClick={() => setActiveView("gaps")}>
              <AlertTriangle size={16} />
              Review Gaps
            </Button>
            <Button variant="ghost" type="button" onClick={() => setActiveView("resources")}>
              <Users size={16} />
              Resource View
            </Button>
            <Button variant="ghost" type="button" onClick={() => setActiveView("details")}>
              <ListChecks size={16} />
              Detailed Grid
            </Button>
          </div>
        </div>
        <div className="grid gap-2 rounded-md border border-line bg-panel p-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-black text-ink">Total personnel</span>
            <span className="text-sm font-black text-flare">{totalPersonnel}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-black text-ink">Peak window</span>
            <span className="text-sm font-black text-flare">{peakHour}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-black text-ink">Peak personnel</span>
            <span className="text-sm font-black text-flare">{peakPersonnel}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-black text-ink">Resource surges</span>
            <span className="text-sm font-black text-flare">{resourceSurges.length}</span>
          </div>
        </div>
      </section>

      <div className="grid gap-4 rounded-md border border-line bg-night p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-ink">Filter matrix</p>
          <p className="mt-1 text-xs font-semibold text-steel">
              Showing {filteredEntries.length} of {entries.length} organization rows across {entriesByTime.length} time blocks.
            </p>
          </div>
          <Button variant="ghost" type="button" onClick={clearFilters} disabled={!hasActiveFilters}>
            Clear Filters
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <input className={inputStyles} placeholder="Filter organization" value={organizationFilter} onChange={(event) => setOrganizationFilter(event.target.value)} />
          <input className={inputStyles} placeholder="Filter objective" value={objectiveFilter} onChange={(event) => setObjectiveFilter(event.target.value)} />
          <input className={inputStyles} placeholder="Filter tasking" value={taskFilter} onChange={(event) => setTaskFilter(event.target.value)} />
          <input className={inputStyles} placeholder="Filter lane" value={laneFilter} onChange={(event) => setLaneFilter(event.target.value)} />
        </div>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {commandStats.map((stat) => (
            <div key={stat.label} className="rounded-md border border-line bg-panel px-3 py-2">
              <p className="text-xs font-black uppercase tracking-[0.1em] text-steel">{stat.label}</p>
              <p className="mt-1 text-lg font-black text-flare">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="ember" type="button" onClick={() => setEntries((current) => [...current, blankEntry(exerciseId, current.length)])}>
          <Plus size={17} />
          Add Time Block
        </Button>
        <Button variant="subtle" type="button" onClick={generateMatrix} disabled={isGenerating}>
          <Sparkles size={17} />
          {isGenerating ? "Generating..." : "Generate Timeline"}
        </Button>
        <Button variant="ghost" type="button">
          <Download size={17} />
          Export CSV
        </Button>
        <Button variant="ghost" type="button">
          <Download size={17} />
          Export PDF
        </Button>
      </div>

      {aiOutput ? (
        <textarea className={`${inputStyles} min-h-[240px] leading-7`} value={aiOutput} onChange={(event) => setAiOutput(event.target.value)} />
      ) : null}

      <div className="grid grid-cols-2 gap-2 rounded-md border border-line bg-night p-2 md:grid-cols-5">
        {views.map((view) => (
          <button
            key={view.id}
            className={`flex min-h-11 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-black ${
              activeView === view.id ? "border border-flare/50 bg-field text-flare shadow-[inset_0_-2px_0_#ffd166]" : "text-ink hover:bg-field"
            }`}
            type="button"
            onClick={() => setActiveView(view.id)}
          >
            <view.icon size={16} />
            {view.label}
          </button>
        ))}
      </div>

      {activeView === "rehearsal" ? (
        <div className="grid gap-4">
          <div>
            <h3 className="text-lg font-black text-ink">Rehearsal Script by Segment</h3>
            <p className="mt-1 text-sm leading-6 text-steel">
              During the in-person rehearsal, each participating organization can brief from its row: task, purpose, personnel,
              location, equipment, reporting requirement, and expected output.
            </p>
          </div>
          <div className="grid gap-2 rounded-md border border-line bg-night p-4 md:grid-cols-5">
            {["Time / condition", "Organization task", "Purpose", "Personnel / assets / location", "Report / output / decision"].map((item, index) => (
              <div key={item} className="rounded-md border border-line bg-panel p-3">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-flare">Brief {index + 1}</p>
                <p className="mt-1 text-sm font-black text-ink">{item}</p>
              </div>
            ))}
          </div>
          {entriesByTime.map(([timeBlock, blockEntries]) => {
            const organizationsInBlock = new Set(blockEntries.map((entry) => entry.organization).filter(Boolean));
            const missingOrganizations = allOrganizations.filter((organization) => !organizationsInBlock.has(organization));
            const selectedOrganization = addOrgByTime[timeBlock] ?? missingOrganizations[0] ?? allOrganizations[0] ?? "";
            const total = blockEntries.reduce((sum, entry) => sum + entry.boots_on_ground, 0);

            return (
              <section key={timeBlock} className="rounded-md border border-line bg-night p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-2xl font-black text-ink">{timeBlock}</p>
                    <p className="mt-2 text-sm leading-6 text-steel">{blockEntries[0]?.external_effect}</p>
                    <p className="mt-1 text-sm font-semibold text-flare">{blockEntries[0]?.inject_trigger}</p>
                  </div>
                  <div className="grid gap-2 sm:min-w-[300px]">
                    <div className="flex items-center justify-between gap-3 rounded-md border border-line bg-panel px-3 py-2">
                      <span className="text-sm font-black text-ink">Organizations scripted</span>
                      <span className="text-sm font-black text-flare">{organizationsInBlock.size} / {allOrganizations.length}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-md border border-line bg-panel px-3 py-2">
                      <span className="text-sm font-black text-ink">Segment personnel</span>
                      <span className="text-sm font-black text-flare">{total}</span>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
                      <select
                        className={`${inputStyles} min-w-0`}
                        value={selectedOrganization}
                        onChange={(event) => setAddOrgByTime((current) => ({ ...current, [timeBlock]: event.target.value }))}
                      >
                        {(missingOrganizations.length ? missingOrganizations : allOrganizations).map((organization) => (
                          <option key={organization} value={organization}>{organization}</option>
                        ))}
                      </select>
                      <Button
                        variant="subtle"
                        type="button"
                        onClick={() => addOrganizationBrief(timeBlock, selectedOrganization)}
                        disabled={!selectedOrganization || organizationsInBlock.has(selectedOrganization)}
                      >
                        <Plus size={16} />
                        Add Org
                      </Button>
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={() => addMissingOrganizationBriefs(timeBlock, missingOrganizations)}
                        disabled={!missingOrganizations.length}
                      >
                        Add Missing
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-4">
                  {blockEntries.map((entry) => (
                    <div key={entry.id} className="rounded-md border border-line bg-panel p-4">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-black text-ink">{entry.organization || "Unassigned participating organization"}</p>
                          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-flare">{entry.status}</p>
                        </div>
                        <button
                          className="flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-black text-ink hover:bg-ember hover:text-night"
                          type="button"
                          onClick={() => setEntries((current) => current.filter((item) => item.id !== entry.id))}
                        >
                          <Trash2 size={15} />
                          Remove
                        </button>
                      </div>
                      <div className="grid gap-4 xl:grid-cols-[220px_1fr_1fr]">
                        <div className="grid gap-3">
                          <label className="grid gap-2 text-sm font-black text-ink">
                            Organization
                            <select className={inputStyles} value={entry.organization} onChange={(event) => updateEntry(entry.id, { organization: event.target.value })}>
                              <option value="">Select organization</option>
                              {allOrganizations.map((organization) => <option key={organization} value={organization}>{organization}</option>)}
                            </select>
                          </label>
                          <label className="grid gap-2 text-sm font-black text-ink">
                            Personnel #
                            <input className={inputStyles} type="number" value={entry.boots_on_ground} onChange={(event) => updateEntry(entry.id, { boots_on_ground: Number(event.target.value) })} />
                          </label>
                          <label className="grid gap-2 text-sm font-black text-ink">
                            Location / Lane
                            <input className={inputStyles} value={entry.location_lane} onChange={(event) => updateEntry(entry.id, { location_lane: event.target.value })} />
                          </label>
                          <label className="grid gap-2 text-sm font-black text-ink">
                            Status
                            <select className={inputStyles} value={entry.status} onChange={(event) => updateEntry(entry.id, { status: event.target.value as SyncMatrixStatus })}>
                              {statusOptions.map((status) => <option key={status}>{status}</option>)}
                            </select>
                          </label>
                        </div>
                        <div className="grid gap-3">
                          <label className="grid gap-2 text-sm font-black text-ink">
                            Task
                            <textarea className={`${inputStyles} min-h-28`} value={entry.task} onChange={(event) => updateEntry(entry.id, { task: event.target.value })} />
                          </label>
                          <label className="grid gap-2 text-sm font-black text-ink">
                            Purpose
                            <textarea className={`${inputStyles} min-h-28`} value={entry.purpose} onChange={(event) => updateEntry(entry.id, { purpose: event.target.value })} />
                          </label>
                          <label className="grid gap-2 text-sm font-black text-ink">
                            Supported Objective
                            <input className={inputStyles} value={entry.supported_objective} onChange={(event) => updateEntry(entry.id, { supported_objective: event.target.value })} />
                          </label>
                        </div>
                        <div className="grid gap-3">
                          <label className="grid gap-2 text-sm font-black text-ink">
                            Supported Tasking / Mission Task
                            <input className={inputStyles} value={entry.supported_mission_task} onChange={(event) => updateEntry(entry.id, { supported_mission_task: event.target.value })} />
                          </label>
                          <label className="grid gap-2 text-sm font-black text-ink">
                            Equipment / Assets
                            <textarea className={`${inputStyles} min-h-20`} value={entry.equipment_assets} onChange={(event) => updateEntry(entry.id, { equipment_assets: event.target.value })} />
                          </label>
                          <label className="grid gap-2 text-sm font-black text-ink">
                            Comms / Reporting
                            <textarea className={`${inputStyles} min-h-20`} value={entry.communications_reporting} onChange={(event) => updateEntry(entry.id, { communications_reporting: event.target.value })} />
                          </label>
                          <label className="grid gap-2 text-sm font-black text-ink">
                            Expected Output
                            <textarea className={`${inputStyles} min-h-20`} value={entry.expected_output} onChange={(event) => updateEntry(entry.id, { expected_output: event.target.value })} />
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : null}

      {activeView === "timeline" ? <div className="grid gap-3">
        <div>
          <h3 className="text-lg font-black text-ink">Timeline Quick View</h3>
          <p className="mt-1 text-sm leading-6 text-steel">Scan the exercise by hour first, then open the detailed matrix only when you need to edit every field.</p>
        </div>
        {entriesByTime.map(([timeBlock, blockEntries]) => {
          const total = blockEntries.reduce((sum, entry) => sum + entry.boots_on_ground, 0);
          const lead = blockEntries.find((entry) => entry.organization)?.organization ?? "No lead assigned";
          const hasGap = blockEntries.some((entry) => entry.status === "gap" || entry.status === "unassigned" || !entry.organization);

          return (
            <div key={timeBlock} className={`rounded-md border p-4 ${hasGap ? "border-ember/60 bg-ember/10" : "border-line bg-night"}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xl font-black text-ink">{timeBlock}</p>
                  <p className="mt-1 text-sm font-semibold text-steel">Lead: {lead}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-sm font-black">
                  <span className="rounded-md border border-line bg-panel px-3 py-1 text-ink">{total} personnel</span>
                  {hasGap ? <span className="rounded-md bg-ember px-3 py-1 text-night">Needs review</span> : <span className="rounded-md border border-line bg-panel px-3 py-1 text-ink">Aligned</span>}
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-ink">{blockEntries[0]?.external_effect}</p>
              <div className="mt-3 grid gap-2">
                {blockEntries.map((entry) => (
                  <div key={entry.id} className="grid gap-2 rounded-md border border-line bg-panel p-3 md:grid-cols-[180px_1fr_120px]">
                    <p className="text-sm font-black text-ink">{entry.organization || "Unassigned"}</p>
                    <p className="text-sm leading-6 text-steel">{entry.task}</p>
                    <p className="text-sm font-black uppercase text-ember">{entry.status}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div> : null}

      {activeView === "gaps" ? (
        <div className="grid gap-4">
          <div>
            <h3 className="text-lg font-black text-ink">Items Needing Planner Attention</h3>
            <p className="mt-1 text-sm leading-6 text-steel">Use this view during the control meeting to assign leads, resolve resource gaps, and tighten task/purpose alignment.</p>
          </div>
          {gapEntries.length ? (
            gapEntries.map((entry) => (
              <div key={entry.id} className="rounded-md border border-ember/60 bg-ember/10 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xl font-black text-ink">{entry.time_block}</p>
                  <span className="rounded-md bg-ember px-3 py-1 text-sm font-black text-night">{entry.status}</span>
                </div>
                <p className="mt-2 text-sm font-black text-ink">{entry.organization || "No lead organization assigned"}</p>
                <p className="mt-2 text-sm leading-6 text-steel">{entry.task || "No task assigned."}</p>
                <p className="mt-3 text-sm leading-6 text-ink">{entry.notes || entry.external_effect}</p>
              </div>
            ))
          ) : (
            <div className="rounded-md border border-line bg-night p-5">
              <p className="font-black text-ink">No gaps flagged.</p>
              <p className="mt-2 text-sm leading-6 text-steel">All visible time blocks have leads and no gap/unassigned status.</p>
            </div>
          )}
        </div>
      ) : null}

      {activeView === "resources" ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-md border border-line bg-night p-4">
            <h3 className="text-lg font-black text-ink">Total Personnel by Hour</h3>
            <div className="mt-4 grid gap-2">
              {byHour.map(([time, total]) => (
                <div key={time} className="grid grid-cols-[100px_1fr_70px] items-center gap-3 text-sm text-ink">
                  <span className="font-bold">{time}</span>
                  <span className="h-2 rounded-full bg-field"><span className="block h-full rounded-full bg-ember" style={{ width: `${Math.min(total, 80)}%` }} /></span>
                  <span className="text-right font-black">{total}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-md border border-line bg-night p-4">
            <h3 className="text-lg font-black text-ink">Personnel by Organization</h3>
            <div className="mt-4 grid gap-2">
              {byOrganization.map(([organization, total]) => (
                <div key={organization} className="flex items-center justify-between gap-3 rounded-md bg-panel px-3 py-2 text-sm">
                  <span className="font-bold text-ink">{organization}</span>
                  <span className="font-black text-flare">{total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {activeView === "details" ? (
        <div className="overflow-x-auto rounded-md border border-line">
        <table className="w-full min-w-[1900px] text-left text-sm">
          <thead className="border-b border-line bg-night text-xs uppercase tracking-[0.14em] text-ink">
            <tr>
              <th className="px-3 py-3">Time Block</th>
              <th className="px-3 py-3">External Effect</th>
              <th className="px-3 py-3">Inject / Trigger</th>
              <th className="px-3 py-3">Organization</th>
              <th className="px-3 py-3">Task</th>
              <th className="px-3 py-3">Purpose</th>
              <th className="px-3 py-3">Personnel</th>
              <th className="px-3 py-3">Equipment / Assets</th>
              <th className="px-3 py-3">Location / Lane</th>
              <th className="px-3 py-3">Objective</th>
              <th className="px-3 py-3">Tasking / Mission Task</th>
              <th className="px-3 py-3">Comms / Reporting</th>
              <th className="px-3 py-3">Expected Output</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Notes</th>
              <th className="px-3 py-3">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-panel">
            {filteredEntries.map((entry) => (
              <tr key={entry.id} className={entry.status === "gap" || entry.status === "unassigned" || !entry.organization ? "bg-ember/10" : ""}>
                <td className="px-3 py-3"><input className={`${inputStyles} w-32`} value={entry.time_block} onChange={(event) => updateEntry(entry.id, { time_block: event.target.value })} /></td>
                <td className="px-3 py-3"><textarea className={`${inputStyles} min-h-24 w-64`} value={entry.external_effect} onChange={(event) => updateEntry(entry.id, { external_effect: event.target.value })} /></td>
                <td className="px-3 py-3"><textarea className={`${inputStyles} min-h-24 w-56`} value={entry.inject_trigger} onChange={(event) => updateEntry(entry.id, { inject_trigger: event.target.value })} /></td>
                <td className="px-3 py-3">
                  <select className={`${inputStyles} w-56`} value={entry.organization} onChange={(event) => updateEntry(entry.id, { organization: event.target.value })}>
                    <option value="">Select organization</option>
                    {allOrganizations.map((organization) => <option key={organization} value={organization}>{organization}</option>)}
                  </select>
                </td>
                <td className="px-3 py-3"><textarea className={`${inputStyles} min-h-24 w-64`} value={entry.task} onChange={(event) => updateEntry(entry.id, { task: event.target.value })} /></td>
                <td className="px-3 py-3"><textarea className={`${inputStyles} min-h-24 w-64`} value={entry.purpose} onChange={(event) => updateEntry(entry.id, { purpose: event.target.value })} /></td>
                <td className="px-3 py-3"><input className={`${inputStyles} w-24`} type="number" value={entry.boots_on_ground} onChange={(event) => updateEntry(entry.id, { boots_on_ground: Number(event.target.value) })} /></td>
                <td className="px-3 py-3"><textarea className={`${inputStyles} min-h-24 w-56`} value={entry.equipment_assets} onChange={(event) => updateEntry(entry.id, { equipment_assets: event.target.value })} /></td>
                <td className="px-3 py-3"><input className={`${inputStyles} w-56`} value={entry.location_lane} onChange={(event) => updateEntry(entry.id, { location_lane: event.target.value })} /></td>
                <td className="px-3 py-3"><input className={`${inputStyles} w-56`} value={entry.supported_objective} onChange={(event) => updateEntry(entry.id, { supported_objective: event.target.value })} /></td>
                <td className="px-3 py-3"><textarea className={`${inputStyles} min-h-24 w-64`} value={entry.supported_mission_task} onChange={(event) => updateEntry(entry.id, { supported_mission_task: event.target.value })} /></td>
                <td className="px-3 py-3"><textarea className={`${inputStyles} min-h-24 w-56`} value={entry.communications_reporting} onChange={(event) => updateEntry(entry.id, { communications_reporting: event.target.value })} /></td>
                <td className="px-3 py-3"><textarea className={`${inputStyles} min-h-24 w-56`} value={entry.expected_output} onChange={(event) => updateEntry(entry.id, { expected_output: event.target.value })} /></td>
                <td className="px-3 py-3">
                  <select className={`${inputStyles} w-36`} value={entry.status} onChange={(event) => updateEntry(entry.id, { status: event.target.value as SyncMatrixStatus })}>
                    {statusOptions.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </td>
                <td className="px-3 py-3"><textarea className={`${inputStyles} min-h-24 w-56`} value={entry.notes} onChange={(event) => updateEntry(entry.id, { notes: event.target.value })} /></td>
                <td className="px-3 py-3">
                  <button className="rounded-md border border-line p-2 text-ink hover:bg-ember hover:text-night" type="button" onClick={() => setEntries((current) => current.filter((item) => item.id !== entry.id))}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      ) : null}
    </div>
  );
}
