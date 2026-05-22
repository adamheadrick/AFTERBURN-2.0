import { NextResponse } from "next/server";
import { z } from "zod";
import { asPrompt, generateText } from "@/lib/ai/generate";

const schema = z.object({
  exercise: z.record(z.unknown()),
  scenario: z.record(z.unknown()),
  objectives: z.array(z.record(z.unknown()))
});

const fallback = `Injects / MSEL rows will be generated here after exercise inputs are provided and OPENAI_API_KEY is configured.

Each generated inject should include:
- Inject number
- Time
- Inject type
- Delivery method
- Target entity
- Expected action
- Training objective supported
- Controller notes
- Evaluation criteria`;

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Exercise, scenario, and objectives are required." }, { status: 400 });
  }

  try {
    const text = await generateText({
      system: "You create realistic inject lists / MSEL products for emergency management and interagency exercises. Use plain event-control language.",
      prompt: `Generate 8 to 12 realistic injects that test the exercise objectives. Each inject must include time, inject type, description, delivered to, expected action, evaluation focus, related objective, and related tasking / mission assignment task.\n\n${asPrompt(parsed.data)}`,
      fallback
    });

    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Inject generation failed." }, { status: 500 });
  }
}
