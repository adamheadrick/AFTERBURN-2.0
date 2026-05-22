"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/button";

export function PlacematExportButton() {
  return (
    <Button type="button" variant="subtle" className="print-hidden" onClick={() => window.print()}>
      <Download size={14} />
      Export Placemat
    </Button>
  );
}
