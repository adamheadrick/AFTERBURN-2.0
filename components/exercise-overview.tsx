"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/button";
import { PageTitle } from "@/components/page-title";
import { useBrowserConcept } from "@/components/use-browser-concept";
import { workspaceSections } from "@/lib/workspace-navigation";

export function ExerciseOverview() {
  const { concept, loaded, unavailable } = useBrowserConcept();
  const briefReady = !!concept?.draft && !concept.dirty;
  return <div className="grid gap-6">
    <PageTitle eyebrow="Exercise workspace" title="Overview" description="Build the exercise, coordinate the team, and turn what you learn into improvement." />
    <section className="workspace-next">
      <div className="min-w-0">
        <p className="workspace-eyebrow">{!loaded ? "Your work" : concept ? "Your browser draft" : "Start with the purpose"}</p>
        <h2 className="mt-2 break-words text-xl font-semibold">{!loaded ? "Loading your draft…" : concept ? concept.draft?.title || concept.brief.name || "Exercise concept" : "What does your team need to practice?"}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-steel">{unavailable ? "The saved draft could not be read. Open the planner to check your work." : concept ? concept.brief.goal || "Continue defining the training need." : "Answer a few questions or bring a planning document. AFTERBURN helps shape the scenario, objectives, and briefing."}</p>
        {concept && <p className="mt-3 text-xs text-steel">{concept.draft ? concept.dirty ? "Setup changed · review the plan before briefing" : "Draft ready for your review · not approved" : "Concept in progress"} · Saved on this device</p>}
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <ButtonLink href="/exercises/new">{concept ? "Continue planning" : "Start an exercise"}<ArrowRight size={16} aria-hidden="true" /></ButtonLink>
        {briefReady && <ButtonLink href="/briefing" variant="subtle">Open planning brief</ButtonLink>}
      </div>
    </section>
    <section aria-labelledby="lifecycle-title">
      <h2 id="lifecycle-title" className="mb-4 text-base font-semibold">The exercise lifecycle</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {workspaceSections.filter(section => ["plan", "execute", "review", "improve"].includes(section.id)).map((section, index) =>
          <Link key={section.id} href={section.href} className="workspace-tool">
            <span className="workspace-eyebrow">{"0" + (index + 1)}</span>
            <h3 className="mt-3 text-lg font-semibold">{section.label}</h3>
            <p className="mt-2 flex-1 text-sm leading-6 text-steel">{section.description}</p>
            <span className="mt-4 flex items-center gap-2 text-sm font-semibold text-flare">Open {section.label.toLowerCase()}<ArrowRight size={15} aria-hidden="true" /></span>
          </Link>)}
      </div>
    </section>
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
      <p className="text-sm leading-6 text-steel">Carry exercise records and lessons into your next plan.</p>
      <ButtonLink href="/library" variant="subtle">Browse library</ButtonLink>
    </div>
  </div>;
}
