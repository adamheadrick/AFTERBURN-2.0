"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { savedStudioSchema, studioStorageKey } from "@/lib/scenario-studio";

export type BrowserConcept = ReturnType<typeof savedStudioSchema.parse>;
export function useBrowserConcept() {
  const path = usePathname();
  const [concept, setConcept] = useState<BrowserConcept | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    function read() {
      try {
        const raw = localStorage.getItem(studioStorageKey);
        if (!raw) { setConcept(null); setUnavailable(false); }
        else {
          const result = savedStudioSchema.safeParse(JSON.parse(raw));
          setConcept(result.success ? result.data : null);
          setUnavailable(!result.success);
        }
      } catch { setConcept(null); setUnavailable(true); }
      setLoaded(true);
    }
    read();
    window.addEventListener("storage", read);
    window.addEventListener("afterburn:concept-updated", read);
    return () => {
      window.removeEventListener("storage", read);
      window.removeEventListener("afterburn:concept-updated", read);
    };
  }, [path]);
  return { concept, loaded, unavailable };
}
