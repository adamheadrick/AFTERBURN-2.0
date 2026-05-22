"use client";

import { Archive, ChevronDown, Inbox, ShieldCheck, UploadCloud, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
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

const storageKey = "afterburn.dropoffSubmissions";

type AttachmentMetadata = {
  file_name: string;
  file_type: string;
  file_size: number;
};

type DropoffResponse = {
  message: string;
  submission: Record<string, unknown>;
  screeningReport: Record<string, unknown>;
  attachments: AttachmentMetadata[];
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

function storeSubmission(result: DropoffResponse) {
  const existing = JSON.parse(localStorage.getItem(storageKey) ?? "[]") as DropoffResponse[];
  localStorage.setItem(storageKey, JSON.stringify([result, ...existing].slice(0, 50)));
  window.dispatchEvent(new CustomEvent("afterburn-dropoff-updated"));
}

export function DropoffDrawer({ triggerVariant = "default" }: { triggerVariant?: "default" | "quiet" }) {
  const pathname = usePathname();
  const inferredModule = useMemo(() => moduleFromPath(pathname), [pathname]);
  const [open, setOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [form, setForm] = useState({ ...initialForm, module_context: inferredModule, phase: inferredModule });
  const [attachments, setAttachments] = useState<AttachmentMetadata[]>([]);
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
          attachments
        })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Dropoff submission failed.");
      }

      setResult(payload);
      storeSubmission(payload);
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
                    <p className="text-xs font-semibold text-steel">Secure intake tray</p>
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
                    Do not submit classified information. Submissions are automatically screened for potential sensitive, controlled, or classified content before being added to the repository.
                  </p>
                </div>
              </div>

              {result ? (
                <div className="mb-4 rounded-md border border-signal/40 bg-signal/10 p-3">
                  <p className="text-sm font-semibold text-signal">Received for screening</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-steel">
                    Status: {String(result.submission.status)}. Risk recommendation: {String(result.screeningReport.risk_level)}. This item is not published and requires review before repository use.
                  </p>
                  {result.persistenceWarning ? (
                    <p className="mt-2 text-xs font-semibold leading-5 text-steel">
                      Local preview note: saved to this browser session. Update Supabase schema to persist it in the live repository.
                    </p>
                  ) : null}
                </div>
              ) : null}

              {error ? (
                <div className="mb-5 rounded-md border border-red-400/40 bg-red-500/10 p-4 text-sm font-semibold text-red-100">
                  {error}
                </div>
              ) : null}

              <form className="grid gap-4" onSubmit={handleSubmit}>
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Title
                  <input
                    className={inputStyles}
                    value={form.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    placeholder="Short title for the observation, issue, lesson, or reference"
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
                    required
                  />
                </label>

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

                    <label className="grid gap-2 text-sm font-semibold text-ink">
                      Optional file upload
                      <span className="flex items-center gap-2 rounded-md border border-dashed border-line bg-panel px-3 py-3 text-sm font-semibold text-ink">
                        <UploadCloud size={18} className="text-flare" />
                        <input
                          type="file"
                          multiple
                          className="w-full text-sm text-ink file:mr-3 file:rounded-md file:border-0 file:bg-flare file:px-3 file:py-2 file:text-sm file:font-black file:text-night"
                          onChange={(event) => {
                            const files = Array.from(event.currentTarget.files ?? []);
                            setAttachments(files.map((file) => ({
                              file_name: file.name,
                              file_type: file.type || "unknown",
                              file_size: file.size
                            })));
                          }}
                        />
                      </span>
                    </label>

                    {attachments.length > 0 ? (
                      <div className="rounded-md border border-line bg-panel p-3">
                        <p className="text-xs font-black uppercase tracking-[0.12em] text-flare">Attachments queued for metadata screening</p>
                        <ul className="mt-2 grid gap-1 text-sm font-semibold text-ink">
                          {attachments.map((file) => (
                            <li key={`${file.file_name}-${file.file_size}`}>{file.file_name} · {Math.ceil(file.file_size / 1024)} KB</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
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
              </form>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
