import { NextResponse } from "next/server";
import { z } from "zod";
import { asPrompt, generateText } from "@/lib/ai/generate";

const schema = z.object({
  exercise: z.record(z.unknown()),
  scenario: z.record(z.unknown()),
  injects: z.array(z.record(z.unknown())),
  syncMatrixEntries: z.array(z.record(z.unknown())),
  evaluatorAssignments: z.array(z.record(z.unknown())).optional(),
  decisionPoints: z.array(z.record(z.unknown())).optional(),
  currentTimeBlock: z.string().optional()
});

const fallback = `# Exercise Control / White Cell Assistant

White Cell Assistant guidance will be generated after execution inputs and OPENAI_API_KEY are available.

## Inputs Needed
- Current time block
- Active inject
- Sync matrix status
- Open issues or frictions
- Evaluator coverage
- Decision points
- Recent observations

## Output Will Include
- Next inject recommendation
- Controller prompts
- Decision reminders
- Observer prompts
- Hotwash questions
- End-of-phase summary notes`;

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Exercise control package is required." }, { status: 400 });
  }

  try {
    const text = await generateText({
      system:
        "You are an exercise control / white cell assistant for exercise controllers. You help manage inject timing, controller prompts, decision reminders, observation prompts, and end-of-phase notes without taking over exercise control.",
      prompt: `Support the exercise control team during exercise execution. Suggest the next inject, any delayed inject adjustment, friction capture prompts, decision point reminders, observer prompts, hotwash questions, and end-of-phase summary notes. Keep advice practical, plain-language, and time-aware.\n\n${asPrompt(parsed.data)}`,
      fallback
    });

    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "White cell assistance failed." }, { status: 500 });
  }
}
