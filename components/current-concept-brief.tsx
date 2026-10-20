"use client";
import Link from "next/link";
import { ExerciseBriefing } from "@/components/exercise-briefing";
import { PageTitle } from "@/components/page-title";
import { ButtonLink } from "@/components/button";
import { useBrowserConcept } from "@/components/use-browser-concept";
import styles from "./scenario-studio.module.css";

export function CurrentConceptBrief({ children }: { children: React.ReactNode }) {
  const { concept, loaded, unavailable } = useBrowserConcept();
  if (!loaded) return <p role="status">Loading your briefing…</p>;
  if (unavailable) return <div className="grid gap-4">
    <PageTitle eyebrow="Plan" title="Planning brief" description="Your saved draft could not be read. Open the planner to check your work before creating a briefing." />
    <ButtonLink href="/exercises/new" className="w-fit">Open guided planner</ButtonLink>
  </div>;
  if (!concept?.draft) return <><p className={styles.notice}>This is the separate workspace briefing. To brief your own concept, <Link href="/exercises/new" className="underline">open the guided planner</Link>.</p>{children}</>;
  return <div className="grid gap-6">
    <PageTitle eyebrow="Plan" title="Planning brief" description="Review the briefing built from your browser draft. Proposed content and unresolved decisions still need your team's review." />
    <ButtonLink href="/exercises/new" variant="subtle" className="w-fit">Edit exercise plan</ButtonLink>
    {concept.dirty ? <p className={styles.notice}>Your setup or story has changed. Return to the guided planner and review the updated plan before generating the briefing.</p> :
      <ExerciseBriefing brief={concept.brief} draft={concept.draft} mode={concept.mode} initiallyOpen />}
  </div>;
}
