import { NextResponse } from "next/server";
import { z } from "zod";
import { asPrompt, generateText } from "@/lib/ai/generate";

const schema = z.object({
  exercise: z.record(z.unknown()),
  scenario: z.record(z.unknown())
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Exercise and scenario inputs are required." }, { status: 400 });
  }

  try {
    const text = await generateText({
      system:
        "You generate realistic, operationally credible exercise scenario narratives for military, National Guard, emergency management, law enforcement, homeland defense, and interagency planners.",
      prompt: `Use the planner inputs to generate a polished scenario narrative. Include situation overview, operational context, key risks, mission need, affected stakeholders, command and coordination challenge, and desired planning focus.\n\n${asPrompt(parsed.data)}`,
      fallback: "Scenario narrative will be generated here after planner inputs are provided and OPENAI_API_KEY is configured. Add situation, background, triggering event, hazard, affected population, infrastructure impacts, coordination challenges, constraints, and desired end state."
    });

    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Scenario generation failed." }, { status: 500 });
  }
}
