import { NextResponse } from "next/server";
import { z } from "zod";
import { asPrompt, generateText } from "@/lib/ai/generate";

const schema = z.object({
  exercise: z.record(z.unknown()),
  scenario: z.record(z.unknown()).optional(),
  missionAssignment: z.record(z.unknown()).optional()
});

const fallback = `Objective recommendations will be generated here after exercise inputs are provided and OPENAI_API_KEY is configured.

Each recommended objective should include:
- Objective title
- Description
- Capability or functional area
- Associated organization
- Evaluation criteria
- Success indicators
- Related tasking / mission assignment task`;

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Exercise inputs are required." }, { status: 400 });
  }

  try {
    const text = await generateText({
      system:
        "You recommend practical exercise objectives for county emergency management, public safety, and interagency exercises. Make objectives measurable, observable, and useful for AAR findings.",
      prompt: `Recommend 6 to 8 exercise objectives based on the exercise, scenario, and tasking / mission assignment. Each objective should include title, description, capability or functional area, associated organization, evaluation criteria, success indicators, and related tasking. Use plain emergency management language and make the objectives easy for evaluators to observe.\n\n${asPrompt(parsed.data)}`,
      fallback
    });

    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Objective recommendation failed." }, { status: 500 });
  }
}
