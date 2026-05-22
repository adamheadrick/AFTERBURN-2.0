"use client";

import { useState } from "react";
import { Brain, Send } from "lucide-react";
import { Button } from "@/components/button";

const prompts = [
  "What were the top three communications issues?",
  "Which organization had the most unresolved friction?",
  "What decision points occurred between 1300 and 1500?",
  "What findings support a request for more UAS funding?",
  "Draft a senior leader summary.",
  "What should we fix before the next exercise?"
];

export function AskExerciseClient({ exercisePackage }: { exercisePackage: Record<string, unknown> }) {
  const [question, setQuestion] = useState(prompts[0]);
  const [answer, setAnswer] = useState("Ask a question about this exercise package. AFTERBURN will answer from the scenario, tasking, rehearsal timeline, feedback, decision points, evidence, executive summary, and improvement plan data.");
  const [status, setStatus] = useState("Ready");

  async function ask(nextQuestion = question) {
    setQuestion(nextQuestion);
    setStatus("Thinking...");

    try {
      const response = await fetch("/api/ask-exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: nextQuestion, exercisePackage })
      });
      const data = (await response.json()) as { text?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Question failed");
      }

      setAnswer(data.text ?? "");
      setStatus("Answered");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Question failed");
    }
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <input
          className="min-h-11 rounded-md border border-line bg-night px-3 py-2 text-sm font-semibold text-ink outline-none focus:border-flare focus:ring-2 focus:ring-flare/20"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
        />
        <Button variant="flame" type="button" onClick={() => ask()}>
          <Send size={17} />
          Ask
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            className="rounded-md border border-line bg-panel px-3 py-2 text-left text-xs font-bold text-ink hover:border-flare/60 hover:bg-field"
            type="button"
            onClick={() => ask(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>
      <div className="rounded-md border border-line bg-night p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-flare">
            <Brain size={15} />
            Exercise answer
          </span>
          <span className="text-xs font-semibold text-steel">{status}</span>
        </div>
        <pre className="whitespace-pre-wrap text-sm font-semibold leading-7 text-ink">{answer}</pre>
      </div>
    </div>
  );
}
