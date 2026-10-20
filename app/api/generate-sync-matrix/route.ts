import { NextResponse } from "next/server";
import { z } from "zod";
import { asPrompt, generateText } from "@/lib/ai/generate";

const schema = z.object({
  exercise: z.record(z.unknown()),
  scenario: z.record(z.unknown()),
  missionAssignment: z.record(z.unknown()),
  objectives: z.array(z.record(z.unknown())),
  injects: z.array(z.record(z.unknown())),
  syncMatrixEntries: z.array(z.record(z.unknown())).optional()
});

const fallback = `Sync matrix rows will be generated here after scenario, tasking, objectives, injects, participating organizations, and OPENAI_API_KEY are available.

Each row should include:
- Time block
- External effect / scenario condition
- Inject or trigger
- Organization
- Task
- Purpose
- Personnel committed
- Equipment / assets
- Location / lane
- Supported objective
- Supported tasking
- Communications / reporting
- Expected output
- Likely friction point`;

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Exercise, scenario, tasking / mission assignment, objectives, and injects are required." }, { status: 400 });
  }

  try {
    const text = await generateText({
      system:
        "You create hour-by-hour rehearsal timelines and synchronization matrices for county emergency management, public safety, homeland defense, National Guard support, and interagency exercises.",
      prompt: `Generate a detailed hour-by-hour rehearsal timeline / synchronization matrix for this exercise. Use the scenario, tasking / mission assignment, objectives, injects, participating organizations, and available resources. For each time block, create briefable rows for participating organizations so each partner has a rehearsal script. Each row must identify external effects, injects/triggers, organization task, purpose, personnel committed, equipment/assets, location/lane, supported objective, supported tasking / mission task, communications requirement, expected output, and likely friction point. Highlight resource surges, unassigned tasks, time blocks with no lead, and likely over-commitment periods.\n\n${asPrompt(parsed.data)}`,
      fallback
    });

    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Sync matrix generation failed." }, { status: 500 });
  }
}
