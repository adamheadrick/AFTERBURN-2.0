import { NextResponse } from "next/server";
import { z } from "zod";
import { asPrompt, generateText } from "@/lib/ai/generate";

const schema = z.object({
  exercise: z.record(z.unknown()),
  scenario: z.record(z.unknown()),
  missionAssignment: z.record(z.unknown()),
  objectives: z.array(z.record(z.unknown())),
  injects: z.array(z.record(z.unknown())),
  syncMatrixEntries: z.array(z.record(z.unknown())),
  evaluatorAssignments: z.array(z.record(z.unknown())).optional(),
  decisionPoints: z.array(z.record(z.unknown())).optional()
});

const fallback = `# AI Exercise Check

## Overall Assessment
The exercise check will be generated after planning inputs and OPENAI_API_KEY are available.

## What This Check Will Review
- Unrealistic assumptions
- Missing organizations or roles
- Weak injects
- Underdeveloped decision points
- Safety gaps
- Communications vulnerabilities
- Legal or authority issues
- Evaluation blind spots
- Places where the exercise may not test the stated objectives

## Before Running
Add scenario, objectives, tasking, injects, sync matrix rows, evaluator coverage, decision points, communications plan, and safety/legal inputs.`;

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Exercise package is required for the AI exercise check." }, { status: 400 });
  }

  try {
    const text = await generateText({
      system:
        "You stress-test exercise design for county emergency managers, public safety partners, National Guard support, and interagency planners. Identify weak assumptions, missing realism, evaluation blind spots, and safety/authority/communications risks in plain language.",
      prompt: `Check this exercise. Review scenario, tasking / mission assignment, objectives, inject list / MSEL, rehearsal timeline / sync matrix, evaluator coverage, and decision points. Identify unrealistic assumptions, missing organizations, weak injects, underdeveloped decision points, safety gaps, communications vulnerabilities, authority issues, evaluation blind spots, and places where the exercise may not test the stated objectives. Provide concrete improvements.\n\n${asPrompt(parsed.data)}`,
      fallback
    });

    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Exercise check failed." }, { status: 500 });
  }
}
