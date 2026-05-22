import { NextResponse } from "next/server";
import { z } from "zod";
import { asPrompt, generateText } from "@/lib/ai/generate";

const schema = z.object({
  exercise: z.record(z.unknown()),
  scenario: z.record(z.unknown()),
  missionAssignment: z.record(z.unknown()).optional()
});

const fallback = `Tasking / Mission Assignment will be generated here after planner inputs are provided and OPENAI_API_KEY is configured.

Use this section to produce:
- Requesting organization
- Supporting organization
- Mission statement
- Purpose
- Scope
- Tasks
- Coordinating instructions
- Timeline
- Resources, personnel, and equipment
- Communications and reporting requirements
- Safety, authority, and policy considerations
- Coordination structure
- Measures of performance and effectiveness
- Expected deliverables`;

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Exercise and scenario inputs are required." }, { status: 400 });
  }

  try {
    const text = await generateText({
      system:
        "You generate clear professional tasking and mission assignment products for county emergency managers, public safety partners, National Guard support to civil authorities, homeland defense, and interagency exercises. Use plain emergency management language and define formal terms when needed.",
      prompt: `Generate a detailed tasking / mission assignment product. Include mission assignment number if available, requesting organization, supporting organization, mission statement, purpose, scope, tasks, coordinating instructions, timeline, resources, personnel, equipment, communications, reporting, sustainment, safety, authority/policy considerations, coordination structure, measures of performance, measures of effectiveness, and expected deliverables. Make it useful to a county emergency manager with no military background.\n\n${asPrompt(parsed.data)}`,
      fallback
    });

    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Mission assignment generation failed." }, { status: 500 });
  }
}
