import { NextResponse } from "next/server";
import { z } from "zod";
import { asPrompt, generateText } from "@/lib/ai/generate";

const schema = z.object({
  exercise: z.record(z.unknown()),
  analysis: z.record(z.unknown()),
  exsum: z.record(z.unknown())
});

const fallback = `Improvement plan / POA&M items will be generated here after validated findings, recommendations, and OPENAI_API_KEY are available.

Each item should include:
- Source finding
- Corrective action
- Owner
- Supporting organization
- Due date
- Priority
- Resources required
- Status
- Milestones
- Evidence of completion
- Risk if not completed
- Related capability
- Related future exercise`;

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Exercise, analysis, and executive summary inputs are required." }, { status: 400 });
  }

  try {
    const text = await generateText({
      system: "You convert after-action findings into structured improvement plans and POA&M items for emergency management and interagency organizations.",
      prompt: `Convert findings and recommendations into improvement plan / POA&M items. Include finding ID, finding/gap, corrective action, responsible office or organization, supporting agencies, priority, status, due date, measure of success, required resources when known, follow-up notes, and completion evidence. Use plain action-oriented language that a county emergency manager can assign and track.\n\n${asPrompt(parsed.data)}`,
      fallback
    });

    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Improvement plan generation failed." }, { status: 500 });
  }
}
