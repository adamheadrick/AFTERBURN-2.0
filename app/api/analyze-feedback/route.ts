import { NextResponse } from "next/server";
import { z } from "zod";
import { asPrompt, generateText } from "@/lib/ai/generate";

const schema = z.object({
  exercise: z.record(z.unknown()),
  scenario: z.record(z.unknown()),
  missionAssignment: z.record(z.unknown()),
  objectives: z.array(z.record(z.unknown())),
  injects: z.array(z.record(z.unknown())),
  feedbackEntries: z.array(z.record(z.unknown()))
});

const fallback = `Feedback analysis will be generated here after observations, hotwash notes, evidence, and OPENAI_API_KEY are available.

The analysis should identify:
- Top themes
- Repeated friction points
- Sustains
- Improves
- Capability gaps
- Interagency coordination issues
- Communications issues
- Resource issues
- Coordination/leadership issues
- Recommended corrective actions
- Draft improvement plan / POA&M items`;

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Scenario, tasking / mission assignment, objectives, injects, and feedback are required." }, { status: 400 });
  }

  try {
    const text = await generateText({
      system:
        "You analyze exercise evaluator and participant feedback for emergency managers and interagency planners. Synthesize leader-level insight in clear, plain language.",
      prompt: `Analyze all feedback entries. Identify top themes, repeated friction points, high-priority gaps, strengths to sustain, issues to improve, contradictions or divergent perspectives, interagency coordination gaps, communications gaps, resource gaps, coordination/leadership gaps, training gaps, policy/authority gaps, recommended corrective actions, and draft improvement plan / POA&M items. Make the output useful to a county emergency manager preparing an AAR and corrective action plan.\n\n${asPrompt(parsed.data)}`,
      fallback
    });

    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Feedback analysis failed." }, { status: 500 });
  }
}
