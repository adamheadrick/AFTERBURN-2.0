import { NextResponse } from "next/server";
import { z } from "zod";
import { asPrompt, generateText } from "@/lib/ai/generate";

const schema = z.object({
  question: z.string().min(4),
  exercisePackage: z.record(z.unknown())
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Ask a question and include the exercise package." }, { status: 400 });
  }

  try {
    const text = await generateText({
      system:
        "You answer questions about a single exercise record. Be concise, cite the relevant source type in plain language, and avoid inventing facts not present in the package.",
      prompt: `Question: ${parsed.data.question}\n\nAnswer using this exercise package. Include useful references such as feedback entries, rehearsal timeline / sync matrix rows, decision points, improvement plan / POA&M items, or executive summary sections when relevant.\n\n${asPrompt(parsed.data.exercisePackage)}`,
      fallback:
        "Ask AFTERBURN will answer from the active exercise record after exercise data and OPENAI_API_KEY are available. Add scenario, tasking, objectives, sync matrix rows, observations, evidence, findings, and POA&M items to make answers specific and traceable."
    });

    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Exercise question failed." }, { status: 500 });
  }
}
