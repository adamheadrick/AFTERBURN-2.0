"use client";

import { Archive, ChevronDown, Inbox, ShieldCheck, UploadCloud, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { saveDropoffFiles, validateFiles, type SavedAttachment } from "@/lib/dropoff-files";
import { usePathname } from "next/navigation";
import { Button } from "@/components/button";
import { inputStyles } from "@/components/panel";
import {
  dropoffCategories,
  dropoffFunctionalAreas,
  dropoffModules,
  dropoffUrgencyLevels,
  dropoffVisibilityRecommendations
} from "@/lib/dropoff-options";

type DropoffResponse = {
  message: string;
  submission: Record<string, unknown> & { id: string };
  screeningReport: Record<string, unknown>;
  attachments: SavedAttachment[];
  persistenceWarning?: string;
};

const initialForm = {
  title: "",
  category: "AAR Observation",
  exercise_event: "",
  module_context: "Planning",
  phase: "Planning",
  entity: "",
  functional_area: "Operations",
  body: "",
  recommended_action: "",
  tags: "",
  urgency: "Medium",
  visibility_recommendation: "Internal Review Only"
};

function moduleFromPath(pathname: string) {
  if (pathname.includes("scenario")) return "Scenario";
  if (pathname.includes("mission")) return "Mission Assignment";
  if (pathname.includes("objectives")) return "Objectives";
  if (pathname.includes("sync-matrix")) return "Sync Matrix";
  if (pathname.includes("execute") || pathname.includes("injects") || pathname.includes("white-cell")) return "Execution";
  if (pathname.includes("feedback") || pathname.includes("observations")) return "Observer Notes";
  if (pathname.includes("analysis") || pathname.includes("review")) return "AAR";
  if (pathname.includes("exsum")) return "Executive Summary";
  if (pathname.includes("library") || pathname.includes("lessons")) return "Doctrine / Library";
  return "Planning";
}

export function DropoffDrawer({ triggerVariant = "default" }: { triggerVariant?: "default" | "quiet" }) {
  const pathname = usePathname();
  const inferredModule = useMemo(() => moduleFromPath(pathname), [pathname]);
  const [open, setOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [form, setForm] = useState({ ...initialForm, module_context: inferredModule, phase: inferredModule });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<DropoffResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm((current) => ({
      ...current,
      module_context: current.module_context || inferredModule,
      phase: current.phase || inferredModule
    }));
  }, [inferredModule]);

  function updateField(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function addFiles(files: File[]) {
    const combined = [...attachments];
    for (const file of files) {
      if (!combined.some((existing) => existing.name === file.name && existing.size === file.size && existing.lastModified === file.lastModified)) combined.push(file);
    }
    const validation = validateFiles(combined);
    if (validation) { setError(validation); return; }
    setError("");
    setAttachments(combined);
    if (!form.title.trim() && combined[0]) updateField("title", combined[0].name);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/dropoff/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
          body: form.body.trim() || "Attached files for human review. File contents have not been analyzed.",
          attachments: attachments.map((file) => ({ file_name: file.name, file_type: file.type || "application/octet-stream", file_size: file.size }))
        })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Dropoff submission failed.");
      }

      const saved = { ...payload, attachments: attachments.map((file) => ({ id: crypto.randomUUID(), file_name: file.name, file_type: file.type || "application/octet-stream", file_size: file.size, storage: "browser" as const })) };
      await saveDropoffFiles(saved, attachments);
      setResult(saved);
      setForm({ ...initialForm, module_context: inferredModule, phase: inferredModule });
      setAttachments([]);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Dropoff submission failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label="Dropoff"
        onClick={() => setOpen(true)}
        className={
          triggerVariant === "quiet"
            ? "inline-flex items-center text-sm font-normal text-steel transition hover:text-ink focus:outline-none focus:ring-1 focus:ring-flare/60"
            : "inline-flex min-h-8 items-center justify-center gap-1.5 rounded-md border border-line bg-panel px-2.5 py-1 text-xs font-semibold text-ink transition hover:bg-field"
        }
      >
        {triggerVariant === "default" ? <Inbox size={14} className="text-steel" /> : null}
        <span className={triggerVariant === "default" ? "hidden sm:inline" : ""}>Dropoff</span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close Dropoff"
            className="absolute inset-0 bg-black/70"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col border-l border-line bg-night shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-line p-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex size-8 items-center justify-center rounded-md border border-line bg-panel">
                    <Archive size={16} className="text-steel" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-steel">Intake tray</p>
                    <h2 className="text-base font-semibold text-ink">Dropoff</h2>
                  </div>
                </div>
                <p className="mt-3 max-w-xl text-sm font-semibold leading-6 text-steel">
                  Submit an observation, document, lesson, issue, recommendation, or doctrine reference for AFTERBURN review.
                </p>
              </div>
              <button
                type="button"
                className="rounded-md border border-line p-1.5 text-steel hover:bg-field hover:text-ink"
                onClick={() => setOpen(false)}
                aria-label="Close Dropoff"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto p-4">
              <div className="mb-4 rounded-md border border-line bg-panel p-3">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={18} className="mt-0.5 shrink-0 text-steel" />
                  <p className="text-sm font-semibold leading-6 text-steel">
                    Do not submit classified information. Submission text is screened for potential sensitive content. Attached file contents require human review and are not yet analyzed by AI.
                  </p>
                </div>
              </div>

              {result ? (
                <div className="mb-4 rounded-md border border-signal/40 bg-signal/10 p-3">
                  <p className="text-sm font-semibold text-signal">Saved to this browser</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-steel">
                    Text screening status: {String(result.submission.status)}. Text risk recommendation: {String(result.screeningReport.risk_level)}. This item is not published and requires review before repository use.
                  </p>
                  <p className="mt-2 text-sm text-steel">{result.attachments.length} file(s) saved. Files stay on this device and browser; clearing site data removes them.</p>
                  <Link href="/admin/dropoff" onClick={() => setOpen(false)} className="mt-3 inline-block text-sm font-semibold underline">Review submissions and download files</Link>
                  {result.persistenceWarning ? (
                    <p className="mt-2 text-xs font-semibold leading-5 text-steel">
                      The shared repository did not save this submission. Your browser copy is available in Review submissions.
                    </p>
                  ) : null}
                </div>
              ) : null}

              {error ? (
                <div className="mb-5 rounded-md border border-red-400/40 bg-red-500/10 p-4 text-sm font-semibold text-red-100">
                  {error}
                </div>
              ) : null}

              <form onSubmit={handleSubmit}><fieldset disabled={submitting} className="grid min-w-0 gap-4">
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Title
                  <input
                    className={inputStyles}
                    value={form.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    placeholder="Short title for the observation, issue, lesson, or reference"
                    minLength={3}
                    required
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold text-ink">
                    Category
                    <select className={inputStyles} value={form.category} onChange={(event) => updateField("category", event.target.value)}>
                      {dropoffCategories.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-ink">
                    Urgency / impact
                    <select className={inputStyles} value={form.urgency} onChange={(event) => updateField("urgency", event.target.value)}>
                      {dropoffUrgencyLevels.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </label>
                </div>

                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Exercise / Event association
                  <input
                    className={inputStyles}
                    value={form.exercise_event}
                    onChange={(event) => updateField("exercise_event", event.target.value)}
                    placeholder="Current exercise, event name, or archive reference"
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Submission body
                  <textarea
                    className={`${inputStyles} min-h-36 leading-6`}
                    value={form.body}
                    onChange={(event) => updateField("body", event.target.value)}
                    placeholder="What happened, why it matters, who was affected, and what should be considered for AAR, lessons learned, or future planning?"
                    minLength={5}
                    required={attachments.length === 0}
                  />
                </label>

                <div className="grid gap-3">
                  <label
                    className="grid gap-2 border border-dashed border-line bg-panel p-4 text-sm font-semibold text-ink"
                    onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "copy"; }}
                    onDrop={(event) => { event.preventDefault(); if (!submitting) addFiles(Array.from(event.dataTransfer.files)); }}
                  >
                    <span className="flex items-center gap-2"><UploadCloud size={18} /> Attach files or drop them here</span>
                    <input type="file" multiple disabled={submitting} className="w-full text-sm file:mr-3 file:border-0 file:bg-flare file:px-3 file:py-2 file:text-night" onChange={(event) => { addFiles(Array.from(event.currentTarget.files ?? [])); event.currentTarget.value = ""; }} />
                  </label>
                  <p className="text-xs leading-5 text-steel">Preview: files are saved in this browser, not uploaded to a shared repository. Up to 10 files, 25 MB each, 50 MB total. AI does not read attached file contents yet.</p>
                  <ul className="grid gap-2" aria-label="Selected attachments">
                    {attachments.map((file, index) => <li key={`${file.name}-${index}`} className="flex items-center justify-between gap-3 text-sm text-ink">
                      <span className="min-w-0 break-words">{file.name} ({Math.max(1, Math.ceil(file.size / 1024))} KB)</span>
                      <button type="button" disabled={submitting} aria-label={`Remove ${file.name}`} onClick={() => setAttachments((current) => current.filter((_, i) => i !== index))} className="p-2"><X size={16} /></button>
                    </li>)}
                  </ul>
                </div>

                <button
                  type="button"
                  className="flex items-center justify-between rounded-md border border-line bg-panel px-4 py-3 text-left text-sm font-black text-ink hover:bg-field"
                  onClick={() => setAdvancedOpen(!advancedOpen)}
                >
                  Advanced details
                  <ChevronDown className={`text-flare transition ${advancedOpen ? "rotate-180" : ""}`} size={18} />
                </button>

                {advancedOpen ? (
                  <div className="grid gap-4 rounded-md border border-line bg-night p-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-2 text-sm font-semibold text-ink">
                        Related module or phase
                        <select className={inputStyles} value={form.module_context} onChange={(event) => updateField("module_context", event.target.value)}>
                          {dropoffModules.map((item) => <option key={item}>{item}</option>)}
                        </select>
                      </label>
                      <label className="grid gap-2 text-sm font-semibold text-ink">
                        Functional area
                        <select className={inputStyles} value={form.functional_area} onChange={(event) => updateField("functional_area", event.target.value)}>
                          {dropoffFunctionalAreas.map((item) => <option key={item}>{item}</option>)}
                        </select>
                      </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-2 text-sm font-semibold text-ink">
                        Entity / Organization
                        <input className={inputStyles} value={form.entity} onChange={(event) => updateField("entity", event.target.value)} placeholder="Agency, office, lane, or partner" />
                      </label>
                      <label className="grid gap-2 text-sm font-semibold text-ink">
                        Visibility recommendation
                        <select className={inputStyles} value={form.visibility_recommendation} onChange={(event) => updateField("visibility_recommendation", event.target.value)}>
                          {dropoffVisibilityRecommendations.map((item) => <option key={item}>{item}</option>)}
                        </select>
                      </label>
                    </div>

                    <label className="grid gap-2 text-sm font-semibold text-ink">
                      Optional recommended action
                      <textarea className={`${inputStyles} min-h-24`} value={form.recommended_action} onChange={(event) => updateField("recommended_action", event.target.value)} placeholder="Suggested fix, owner, follow-up, policy change, training requirement, or future exercise input" />
                    </label>

                    <label className="grid gap-2 text-sm font-semibold text-ink">
                      Optional tags
                      <input className={inputStyles} value={form.tags} onChange={(event) => updateField("tags", event.target.value)} placeholder="Separate tags with commas" />
                    </label>


                  </div>
                ) : null}

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                  <p className="max-w-md text-xs font-semibold leading-5 text-steel">
                    Lifecycle: Dropoff → Screening → Review → Sanitization → Repository / Library → AAR, EXSUM, improvement plan, or future exercise input.
                  </p>
                  <Button type="submit" variant="ember" disabled={submitting}>
                    {submitting ? "Screening..." : "Submit to Dropoff"}
                  </Button>
                </div>
              </fieldset></form>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
