"use client";

import { useState } from "react";
import { Brain, Clipboard, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/button";

export function AiGenerator({
  endpoint,
  buttonLabel,
  payload,
  initialOutput,
  outputLabel = "Generated Output",
  large = false
}: {
  endpoint: string;
  buttonLabel: string;
  payload: Record<string, unknown>;
  initialOutput: string;
  outputLabel?: string;
  large?: boolean;
}) {
  const [output, setOutput] = useState(initialOutput);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("Ready");

  async function generate() {
    setIsLoading(true);
    setStatus("Generating...");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = (await response.json()) as { text?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Generation failed");
      }

      setOutput(data.text ?? initialOutput);
      setStatus("Generated");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Generation failed");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyToClipboard() {
    await navigator.clipboard.writeText(output);
    setStatus("Copied to clipboard");
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="flame" type="button" onClick={generate} disabled={isLoading}>
          <Brain size={18} />
          {isLoading ? "Generating..." : buttonLabel}
        </Button>
        <Button variant="subtle" type="button" onClick={generate} disabled={isLoading}>
          <RotateCcw size={17} />
          Regenerate
        </Button>
        <Button variant="ghost" type="button" onClick={copyToClipboard}>
          <Clipboard size={17} />
          Copy
        </Button>
        <Button variant="ghost" type="button">
          <Save size={17} />
          Save
        </Button>
        <span className="text-sm font-semibold text-steel">{status}</span>
      </div>
      <label className="grid gap-2 text-sm font-black text-ink">
        {outputLabel}
        <textarea
          className={`rounded-md border border-line bg-night p-4 text-sm leading-7 text-ink outline-none focus:border-flare focus:ring-2 focus:ring-flare/20 ${large ? "min-h-[620px]" : "min-h-[300px]"}`}
          value={output}
          onChange={(event) => setOutput(event.target.value)}
          placeholder="Generated content will appear here after you provide the required inputs and connect AI generation."
        />
      </label>
    </div>
  );
}
