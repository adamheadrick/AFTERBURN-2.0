"use client";

import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import { Button } from "@/components/button";
import { inputStyles } from "@/components/panel";
import { PriorityBadge } from "@/components/status-badge";
import type { FeedbackEntry, ObservationType, Priority } from "@/lib/types/database";

function unique(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

function includes(value: string, query: string) {
  return value.toLowerCase().includes(query.toLowerCase());
}

export function FeedbackExplorer({ entries }: { entries: FeedbackEntry[] }) {
  const [organization, setOrganization] = useState("all");
  const [reporter, setReporter] = useState("all");
  const [role, setRole] = useState("all");
  const [lane, setLane] = useState("all");
  const [priority, setPriority] = useState<Priority | "all">("all");
  const [type, setType] = useState<ObservationType | "all">("all");
  const [query, setQuery] = useState("");

  const organizations = useMemo(() => unique(entries.map((entry) => entry.organization)), [entries]);
  const reporters = useMemo(() => unique(entries.map((entry) => entry.observer_name)), [entries]);
  const roles = useMemo(() => unique(entries.map((entry) => entry.role)), [entries]);
  const lanes = useMemo(() => unique(entries.map((entry) => entry.operational_lane)), [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const queryTarget = [
        entry.observer_name,
        entry.organization,
        entry.role,
        entry.operational_lane,
        entry.related_objective,
        entry.what_happened,
        entry.friction,
        entry.capability_gap,
        entry.resource_shortfall,
        entry.communication_issue,
        entry.command_control_issue,
        entry.interagency_issue,
        entry.recommended_corrective_action
      ].join(" ");

      return (
        (organization === "all" || entry.organization === organization) &&
        (reporter === "all" || entry.observer_name === reporter) &&
        (role === "all" || entry.role === role) &&
        (lane === "all" || entry.operational_lane === lane) &&
        (priority === "all" || entry.priority === priority) &&
        (type === "all" || entry.observation_type === type) &&
        (!query || includes(queryTarget, query))
      );
    });
  }, [entries, lane, organization, priority, query, reporter, role, type]);

  const highOrCritical = filteredEntries.filter((entry) => entry.priority === "high" || entry.priority === "critical").length;
  const impactedFunctions = unique(filteredEntries.map((entry) => entry.operational_lane)).length;

  function resetFilters() {
    setOrganization("all");
    setReporter("all");
    setRole("all");
    setLane("all");
    setPriority("all");
    setType("all");
    setQuery("");
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 rounded-md border border-line bg-night p-4 lg:grid-cols-[1fr_160px_160px]">
        <label className="grid gap-2 text-sm font-black text-ink">
          <span className="flex items-center gap-2"><Search size={16} className="text-flare" /> Search gap, challenge, or action</span>
          <input className={inputStyles} placeholder="Search feedback text" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <div className="rounded-md border border-line bg-panel p-3">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-steel">Visible entries</p>
          <p className="mt-2 text-3xl font-black text-flare">{filteredEntries.length}</p>
        </div>
        <div className="rounded-md border border-line bg-panel p-3">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-steel">High / Critical</p>
          <p className="mt-2 text-3xl font-black text-flare">{highOrCritical}</p>
        </div>
      </div>

      <div className="grid gap-3 rounded-md border border-line bg-night p-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="grid gap-2 text-sm font-black text-ink">
          Reported By Organization
          <select className={inputStyles} value={organization} onChange={(event) => setOrganization(event.target.value)}>
            <option value="all">All organizations</option>
            {organizations.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-black text-ink">
          Reported By Individual
          <select className={inputStyles} value={reporter} onChange={(event) => setReporter(event.target.value)}>
            <option value="all">All individuals</option>
            {reporters.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-black text-ink">
          Reporter Role or Function
          <select className={inputStyles} value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="all">All reporter functions</option>
            {roles.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-black text-ink">
          Impacted Function or Lane
          <select className={inputStyles} value={lane} onChange={(event) => setLane(event.target.value)}>
            <option value="all">All impacted functions</option>
            {lanes.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-black text-ink">
          Priority
          <select className={inputStyles} value={priority} onChange={(event) => setPriority(event.target.value as Priority | "all")}>
            <option value="all">All priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-black text-ink">
          Observation Type
          <select className={inputStyles} value={type} onChange={(event) => setType(event.target.value as ObservationType | "all")}>
            <option value="all">All types</option>
            <option value="improve">Improve</option>
            <option value="sustain">Sustain</option>
            <option value="general">General</option>
          </select>
        </label>
        <div className="flex items-end md:col-span-2">
          <Button variant="subtle" type="button" onClick={resetFilters} className="w-full">
            <Filter size={16} />
            Reset Filters
          </Button>
        </div>
      </div>

      <div className="rounded-md border border-line bg-night p-4">
        <div className="flex flex-wrap gap-2 text-sm font-black text-ink">
          <span className="rounded-md border border-line bg-panel px-3 py-1">{impactedFunctions} impacted functions</span>
          <span className="rounded-md border border-line bg-panel px-3 py-1">{organizations.length} reporting organizations</span>
        </div>
      </div>

      <div className="grid gap-3">
        {filteredEntries.map((entry) => (
          <article key={entry.id} className="rounded-md border border-line bg-night p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">Impacted function: {entry.operational_lane}</p>
                <h3 className="mt-2 text-lg font-black text-ink">{entry.capability_gap || entry.friction || entry.what_happened}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <PriorityBadge priority={entry.priority} />
                <span className="rounded-md border border-line bg-panel px-2 py-1 text-xs font-black uppercase text-ink">{entry.observation_type}</span>
              </div>
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-[280px_1fr]">
              <div className="rounded-md border border-line bg-panel p-3">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-steel">Reported by</p>
                <p className="mt-2 text-sm font-black text-ink">{entry.observer_name}</p>
                <p className="mt-1 text-sm leading-6 text-steel">{entry.organization}</p>
                <p className="text-sm leading-6 text-steel">{entry.role}</p>
              </div>
              <div className="grid gap-2 text-sm leading-6 text-steel">
                <p><span className="font-black text-ink">What happened:</span> {entry.what_happened}</p>
                <p><span className="font-black text-ink">Friction:</span> {entry.friction}</p>
                <p><span className="font-black text-ink">Corrective action:</span> {entry.recommended_corrective_action}</p>
              </div>
            </div>
          </article>
        ))}
        {!filteredEntries.length ? (
          <div className="rounded-md border border-line bg-night p-5">
            <p className="font-black text-ink">No feedback matches those filters.</p>
            <p className="mt-2 text-sm leading-6 text-steel">Broaden the reporting organization, individual, function, or keyword filter.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
