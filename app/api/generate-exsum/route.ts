import { NextResponse } from "next/server";
import { z } from "zod";
import { asPrompt, generateText } from "@/lib/ai/generate";

const schema = z.object({
  exercise: z.record(z.unknown()),
  scenario: z.record(z.unknown()),
  missionAssignment: z.record(z.unknown()),
  objectives: z.array(z.record(z.unknown())),
  injects: z.array(z.record(z.unknown())),
  syncMatrixEntries: z.array(z.record(z.unknown())).optional(),
  readinessScore: z.record(z.unknown()).optional(),
  evaluatorAssignments: z.array(z.record(z.unknown())).optional(),
  decisionPoints: z.array(z.record(z.unknown())).optional(),
  feedbackEntries: z.array(z.record(z.unknown())),
  analysis: z.record(z.unknown()),
  poamItems: z.array(z.record(z.unknown())),
  evidenceItems: z.array(z.record(z.unknown())).optional()
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Full exercise package is required." }, { status: 400 });
  }

  try {
    const text = await generateText({
      system:
        "You write comprehensive executive summaries and AAR foundations for emergency managers, senior leaders, and interagency planners. Your writing is clear, detailed, credible, action-oriented, and accessible to non-military users.",
      prompt: `Generate a long-form professional executive summary titled AFTERBURN Executive Summary. Use plain emergency management language while keeping formal terms where useful. Include exactly these sections: 1. Executive Overview, 2. Exercise Purpose, 3. Scenario Summary, 4. Tasking / Mission Assignment Overview, 5. Participating Organizations, 6. Operational Objectives, 7. Exercise Readiness and Pre-Execution Risk, 8. Inject List / MSEL Execution, 9. Major Events and Exercise Flow, 10. Key Strengths / Sustains, 11. Key Improves, 12. Major Capability Gaps, 13. Coordination / ICS Findings, 14. Communications Findings, 15. Interagency Coordination Findings, 16. Resource and Sustainment Findings, 17. Tasking / Mission Assignment Execution Assessment, 18. Time-Phased Execution and Rehearsal Timeline / Sync Matrix Assessment, 19. Decision Point Assessment, 20. Observer / Evaluator Coverage Assessment, 21. Observer Feedback Summary, 22. Participant Feedback Summary, 23. Category / Functional Area AAR Breakouts, 24. Organization-Specific AAR Breakouts, 25. Evidence Binder Summary, 26. Priority Corrective Actions, 27. Improvement Plan / POA&M, 28. Recommended Next Steps, 29. Conclusion. In the timeline assessment, summarize how well organizations synchronized by hour, where personnel or asset surges occurred, where external effects changed operational requirements, where task/purpose alignment was strong or weak, which time blocks created the most friction, whether personnel estimates matched requirements, and recommended improvements for future synchronization. The decision point assessment should identify decision quality, available information, authority clarity, and AAR relevance. The evaluator coverage section should assess whether objectives had sufficient observer/evaluator coverage. The evidence binder section should connect findings to supporting evidence. Synthesize comments into leader-level insight, not a comment summary.\n\n${asPrompt(parsed.data)}`,
      fallback: "The executive summary will be generated here after exercise data, observations, analysis, and OPENAI_API_KEY are available. Capture scenario, tasking, objectives, injects, sync matrix data, evaluator notes, feedback, findings, recommendations, and POA&M items before generating the final product."
    });

    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Executive summary generation failed." }, { status: 500 });
  }
}
