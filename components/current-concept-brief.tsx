"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { savedStudioSchema, studioStorageKey, type ScenarioBrief, type ScenarioDraft, type GenerationMode } from "@/lib/scenario-studio";
import { ExerciseBriefing } from "@/components/exercise-briefing";
import styles from "./scenario-studio.module.css";
export function CurrentConceptBrief({ children }: { children: React.ReactNode }) {
  const [concept, setConcept] = useState<{ brief: ScenarioBrief; draft: ScenarioDraft; mode: GenerationMode; dirty: boolean } | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    function read() {
      try {
        const saved = savedStudioSchema.parse(JSON.parse(localStorage.getItem(studioStorageKey) ?? "null"));
        setConcept(saved.draft ? { brief: saved.brief, draft: saved.draft, mode: saved.mode, dirty: saved.dirty } : null);
      } catch { setConcept(null); }
      setLoaded(true);
    }
    read(); window.addEventListener("storage", read);
    return () => window.removeEventListener("storage", read);
  }, []);
  if (!loaded) return <p role="status">Loading your briefing…</p>;
  if (!concept) return <><p className={styles.notice}>To create a briefing from a new concept, <Link href="/exercises/new" className="underline">open the guided planner</Link>. The existing workspace briefing is below.</p>{children}</>;
  return <div className={styles.studio}>
    <p className={styles.eyebrow}>Current browser concept</p><h1 className={styles.heading}>Your exercise planning brief</h1>
    <p className={styles.intro}>This briefing uses your saved concept. It has not been saved to the shared exercise database.</p>
    <Link href="/exercises/new" className={styles.secondary}>Edit the exercise plan</Link>
    {concept.dirty ? <p className={styles.notice}>Your setup or story has changed. Return to the guided planner and review the updated plan before generating the briefing.</p> : <ExerciseBriefing brief={concept.brief} draft={concept.draft} mode={concept.mode} initiallyOpen />}
  </div>;
}
