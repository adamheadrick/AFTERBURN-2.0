"use client";

import { CheckCircle2, FileSearch, Filter, GitMerge, ShieldAlert, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/button";
import { inputStyles } from "@/components/panel";
import {
  dropoffCategories,
  dropoffFunctionalAreas,
  dropoffRiskLevels,
  dropoffStatuses,
  repositoryItemTypes
} from "@/lib/dropoff-options";
import type { DropoffScreeningReport, DropoffStatus, DropoffSubmission, LessonsRepositoryItem } from "@/lib/types/database";

const storageKey = "afterburn.dropoffSubmissions";

type StoredDropoff = {
  submission: DropoffSubmission;
  screeningReport: DropoffScreeningReport;
};

type QueueItem = {
  submission: DropoffSubmission;
  screeningReport?: DropoffScreeningReport;
};

function readStoredDropoffs(): QueueItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) ?? "[]") as StoredDropoff[];
    return stored
      .filter((item) => item.submission?.id)
      .map((item) => ({ submission: item.submission, screeningReport: item.screeningReport }));
  } catch {
    return [];
  }
}

function statusClass(status: string) {
  if (status.includes("Cleared") || status.includes("Approved") || status.includes("Added")) return "border-signal/40 bg-signal/10 text-signal";
  if (status.includes("Rejected") || status.includes("Sensitive") || status.includes("Sanitization")) return "border-red-400/40 bg-red-500/15 text-red-100";
  if (status.includes("Human")) return "border-flare/40 bg-flare/10 text-flare";
  return "border-line bg-panel text-ink";
}

function riskClass(risk: string) {
  if (risk === "Critical" || risk === "High") return "border-red-400/40 bg-red-500/15 text-red-100";
  if (risk === "Medium") return "border-flare/40 bg-flare/10 text-flare";
  return "border-signal/40 bg-signal/10 text-signal";
}

export function DropoffReviewQueue({
  demoSubmissions,
  demoReports,
  demoRepositoryItems
}: {
  demoSubmissions: DropoffSubmission[];
  demoReports: DropoffScreeningReport[];
  demoRepositoryItems: LessonsRepositoryItem[];
}) {
  const [items, setItems] = useState<QueueItem[]>(() =>
    demoSubmissions.map((submission) => ({
      submission,
      screeningReport: demoReports.find((report) => report.submission_id === submission.id)
    }))
  );
  const [selectedId, setSelectedId] = useState(demoSubmissions[0]?.id ?? "");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [risk, setRisk] = useState("All");
  const [functionalArea, setFunctionalArea] = useState("All");
  const [convertedItems, setConvertedItems] = useState<LessonsRepositoryItem[]>(demoRepositoryItems);

  useEffect(() => {
    function loadStored() {
      const storedItems = readStoredDropoffs();
      const demoItems = demoSubmissions.map((submission) => ({
        submission,
        screeningReport: demoReports.find((report) => report.submission_id === submission.id)
      }));
      const merged = [...storedItems, ...demoItems].filter((item, index, array) =>
        array.findIndex((candidate) => candidate.submission.id === item.submission.id) === index
      );
      setItems(merged);
      setSelectedId((current) => current || merged[0]?.submission.id || "");
    }

    loadStored();
    window.addEventListener("afterburn-dropoff-updated", loadStored);
    window.addEventListener("storage", loadStored);

    return () => {
      window.removeEventListener("afterburn-dropoff-updated", loadStored);
      window.removeEventListener("storage", loadStored);
    };
  }, [demoReports, demoSubmissions]);

  const filteredItems = useMemo(() => items.filter((item) => {
    const submission = item.submission;
    const report = item.screeningReport;

    return (
      (category === "All" || submission.category === category) &&
      (status === "All" || submission.status === status) &&
      (risk === "All" || report?.risk_level === risk || submission.ai_risk_level === risk) &&
      (functionalArea === "All" || submission.functional_area === functionalArea)
    );
  }), [category, functionalArea, items, risk, status]);

  useEffect(() => {
    if (filteredItems.length > 0 && !filteredItems.some((item) => item.submission.id === selectedId)) {
      setSelectedId(filteredItems[0].submission.id);
    }
  }, [filteredItems, selectedId]);

  const selectedItem = filteredItems.find((item) => item.submission.id === selectedId) ?? filteredItems[0] ?? items[0];

  function updateStatus(nextStatus: DropoffStatus) {
    if (!selectedItem) return;

    setItems((current) => current.map((item) =>
      item.submission.id === selectedItem.submission.id
        ? {
            ...item,
            submission: {
              ...item.submission,
              status: nextStatus,
              ai_screening_status: nextStatus,
              updated_at: new Date().toISOString()
            }
          }
        : item
    ));
  }

  function convertSelected() {
    if (!selectedItem) return;

    const submission = selectedItem.submission;
    const report = selectedItem.screeningReport;
    const converted: LessonsRepositoryItem = {
      id: crypto.randomUUID(),
      source_submission_id: submission.id,
      exercise_id: submission.exercise_id,
      title: submission.title,
      item_type: repositoryItemTypes.includes(report?.suggested_repository_category as never)
        ? String(report?.suggested_repository_category)
        : "Planning Consideration",
      summary: report?.suggested_sanitized_text?.slice(0, 180) ?? submission.body.slice(0, 180),
      approved_content: report?.suggested_sanitized_text ?? submission.body,
      functional_area: submission.functional_area,
      phase: submission.phase,
      entity: submission.entity,
      tags: report?.suggested_tags ?? submission.tags,
      recommended_action: submission.recommended_action,
      owner: "Unassigned reviewer",
      status: "Under Review",
      export_eligibility: submission.visibility_recommendation === "Public/Unclassified Export Candidate"
        ? "Public/Unclassified"
        : submission.visibility_recommendation === "Interagency Library Candidate"
          ? "Interagency Shareable"
          : "Internal Only",
      approved_by: "reviewer",
      approved_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setConvertedItems((current) => [converted, ...current]);
    updateStatus("Added to Repository");
  }

  return (
    <div className="grid gap-5">
      <section className="rounded-md border border-line bg-panel p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">Dropoff lifecycle</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-ink">
              Dropoff → Screening → Review → Sanitization → Library repository → AAR, EXSUM, improvement plan, or future exercise input.
            </p>
          </div>
          <div className="rounded-md border border-line bg-night px-3 py-2 text-sm font-black text-ink">
            {items.length} submissions
          </div>
        </div>
      </section>

      <section className="rounded-md border border-line bg-night p-4">
        <div className="mb-4 flex items-center gap-2">
          <Filter size={17} className="text-flare" />
          <h2 className="text-base font-black text-ink">Review filters</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <select className={inputStyles} value={category} onChange={(event) => setCategory(event.target.value)}>
            <option>All</option>
            {dropoffCategories.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className={inputStyles} value={status} onChange={(event) => setStatus(event.target.value)}>
            <option>All</option>
            {dropoffStatuses.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className={inputStyles} value={risk} onChange={(event) => setRisk(event.target.value)}>
            <option>All</option>
            {dropoffRiskLevels.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className={inputStyles} value={functionalArea} onChange={(event) => setFunctionalArea(event.target.value)}>
            <option>All</option>
            {dropoffFunctionalAreas.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.4fr]">
        <div className="grid gap-3">
          {filteredItems.map((item) => {
            const selected = selectedItem?.submission.id === item.submission.id;

            return (
              <button
                key={item.submission.id}
                type="button"
                onClick={() => setSelectedId(item.submission.id)}
                className={`rounded-md border p-4 text-left transition hover:border-flare/60 hover:bg-field ${selected ? "border-flare/60 bg-field" : "border-line bg-panel"}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-flare">{item.submission.category}</p>
                    <h3 className="mt-2 text-base font-black text-ink">{item.submission.title}</h3>
                  </div>
                  <span className={`rounded-md border px-2 py-1 text-xs font-black uppercase ${riskClass(item.screeningReport?.risk_level ?? item.submission.ai_risk_level)}`}>
                    {item.screeningReport?.risk_level ?? item.submission.ai_risk_level}
                  </span>
                </div>
                <p className="mt-3 line-clamp-2 text-sm font-semibold leading-6 text-ink">{item.submission.body}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`rounded-md border px-2 py-1 text-xs font-black ${statusClass(item.submission.status)}`}>{item.submission.status}</span>
                  <span className="rounded-md border border-line bg-night px-2 py-1 text-xs font-black text-ink">{item.submission.functional_area}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-md border border-line bg-panel">
          {selectedItem ? (
            <div>
              <div className="border-b border-line p-5">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">AI screening report</p>
                <h2 className="mt-2 text-xl font-black text-ink">{selectedItem.submission.title}</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`rounded-md border px-2 py-1 text-xs font-black uppercase ${statusClass(selectedItem.submission.status)}`}>{selectedItem.submission.status}</span>
                  <span className={`rounded-md border px-2 py-1 text-xs font-black uppercase ${riskClass(selectedItem.screeningReport?.risk_level ?? selectedItem.submission.ai_risk_level)}`}>
                    Risk: {selectedItem.screeningReport?.risk_level ?? selectedItem.submission.ai_risk_level}
                  </span>
                  <span className="rounded-md border border-line bg-night px-2 py-1 text-xs font-black text-ink">
                    Confidence: {Math.round((selectedItem.screeningReport?.confidence_score ?? selectedItem.submission.ai_confidence) * 100)}%
                  </span>
                </div>
              </div>

              <div className="grid gap-5 p-5">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.12em] text-flare">Submission</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-ink">{selectedItem.submission.body}</p>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-md border border-line bg-night p-4">
                    <h3 className="flex items-center gap-2 text-sm font-black text-ink"><ShieldAlert size={16} className="text-flare" />Sensitivity indicators</h3>
                    <ul className="mt-3 grid gap-2 text-sm font-semibold leading-6 text-ink">
                      {(selectedItem.screeningReport?.sensitivity_categories.length ? selectedItem.screeningReport.sensitivity_categories : ["No obvious indicators detected"]).map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-md border border-line bg-night p-4">
                    <h3 className="flex items-center gap-2 text-sm font-black text-ink"><FileSearch size={16} className="text-flare" />Flagged terms / sections</h3>
                    <ul className="mt-3 grid gap-2 text-sm font-semibold leading-6 text-ink">
                      {(selectedItem.screeningReport?.flagged_terms.length ? selectedItem.screeningReport.flagged_terms : ["None flagged"]).map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.12em] text-flare">Recommended handling</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-ink">{selectedItem.screeningReport?.recommended_handling ?? "Route to human review before repository conversion."}</p>
                </div>

                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.12em] text-flare">Suggested sanitized version</h3>
                  <textarea
                    className={`${inputStyles} mt-2 min-h-32 w-full leading-6`}
                    value={selectedItem.screeningReport?.suggested_sanitized_text ?? selectedItem.submission.body}
                    readOnly
                  />
                </div>

                <div className="grid gap-3 rounded-md border border-line bg-night p-4">
                  <h3 className="text-sm font-black uppercase tracking-[0.12em] text-flare">Reviewer actions</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="light" onClick={() => updateStatus("Cleared for Review")}><CheckCircle2 size={16} />Clear for Review</Button>
                    <Button type="button" variant="subtle" onClick={() => updateStatus("Sanitization Required")}><ShieldAlert size={16} />Sanitize</Button>
                    <Button type="button" variant="subtle" onClick={() => updateStatus("Rejected / Do Not Publish")}><XCircle size={16} />Reject</Button>
                    <Button type="button" variant="ember" onClick={convertSelected}><GitMerge size={16} />Convert to Repository</Button>
                  </div>
                  <textarea className={`${inputStyles} min-h-24`} placeholder="Reviewer notes, clarification request, duplicate linkage, or follow-up assignment" />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 text-sm font-semibold text-ink">No Dropoff submissions match the current filters.</div>
          )}
        </div>
      </section>

      <section className="rounded-md border border-line bg-panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-flare">Repository conversion queue</p>
            <h2 className="mt-2 text-lg font-black text-ink">Approved or converted records</h2>
          </div>
          <div className="rounded-md border border-line bg-night px-3 py-2 text-sm font-black text-ink">
            {convertedItems.length} records
          </div>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {convertedItems.map((item) => (
            <div key={item.id} className="rounded-md border border-line bg-night p-4">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-flare">{item.item_type}</p>
              <h3 className="mt-2 text-base font-black text-ink">{item.title}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-ink">{item.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-md border border-line bg-panel px-2 py-1 text-xs font-black text-ink">{item.status}</span>
                <span className="rounded-md border border-line bg-panel px-2 py-1 text-xs font-black text-ink">{item.export_eligibility}</span>
                <span className="rounded-md border border-line bg-panel px-2 py-1 text-xs font-black text-ink">Source: {item.source_submission_id?.slice(-4)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
