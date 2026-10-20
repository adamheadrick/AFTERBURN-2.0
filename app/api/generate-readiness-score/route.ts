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

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Exercise planning package is required." }, { status: 400 });
  }

  try {
    const text = await generateText({
      system:
        "You are an exercise readiness assessor for emergency management, National Guard, homeland defense, law enforcement, and interagency exercises. Be direct, practical, and operationally credible.",
      prompt: `Generate a pre-execution Exercise Readiness Score. Evaluate scenario clarity, objectives, participating organizations, tasking / mission assignments, rehearsal timeline / sync matrix completeness, communications plan, safety/risk controls, observer/evaluator coverage, hotwash/AAR collection plan, graphic/map data, and decision points. Return a score, readiness label, concise summary, strengths, friction points, missing inputs, and recommendations in plain language useful to a county emergency manager.\n\n${asPrompt(parsed.data)}`,
      fallback: `Readiness score will be generated here after exercise planning inputs and OPENAI_API_KEY are available.

Required inputs:
- Exercise overview
- Scenario narrative
- Objectives and evaluation criteria
- Participating organizations
- Tasking / mission assignment
- Sync matrix or rehearsal timeline
- Communications plan
- Safety and legal considerations
- Evaluator coverage
- Hotwash / AAR collection plan
- Decision points`
    });

    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Readiness scoring failed." }, { status: 500 });
  }
}
