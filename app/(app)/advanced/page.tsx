import { BarChart3, ClipboardCheck, FileText, RadioTower, Route } from "lucide-react";
import { PageTitle } from "@/components/page-title";
import { WorkflowStepCard } from "@/components/workflow-step-card";

const workspaceGroups = [
  {
    title: "Plan",
    eyebrow: "1.0 Workspace",
    description: "Build the exercise concept, scenario, tasking, objectives, graphic overview, AI checks, and leadership brief.",
    href: "/plan",
    action: "Open plan tools",
    icon: Route,
    links: [
      { label: "Scenario Builder", href: "/scenario-builder", note: "Situation, hazard, constraints, and generated narrative" },
      { label: "Mission Assignment", href: "/mission-assignment", note: "Tasking language, resources, command, and reporting" },
      { label: "Objectives", href: "/objectives", note: "Capabilities, criteria, and measurable outcomes" },
      { label: "Graphic Overview", href: "/graphic-overview", note: "Operational picture and map planning view" }
    ]
  },
  {
    title: "Execute",
    eyebrow: "1.0 Workspace",
    description: "Control the event using the MSEL, sync matrix, evaluator coverage, decisions, partner access, and feedback collection.",
    href: "/execute",
    action: "Open execute tools",
    icon: RadioTower,
    links: [
      { label: "MSEL / Injects", href: "/injects", note: "Sequence events, triggers, and expected actions" },
      { label: "Sync Matrix", href: "/sync-matrix", note: "Entity task, purpose, personnel, location, and status by phase" },
      { label: "Evaluator Coverage", href: "/evaluators", note: "Assign observer/controller/evaluator coverage" },
      { label: "Feedback Collection", href: "/feedback", note: "Capture observations, hotwash input, and friction" }
    ]
  },
  {
    title: "Review",
    eyebrow: "1.0 Workspace",
    description: "Turn observations, decisions, evidence, and feedback into analysis, summaries, AAR products, and export packages.",
    href: "/review",
    action: "Open review tools",
    icon: FileText,
    links: [
      { label: "Feedback Analysis", href: "/analysis", note: "Themes, sustains, improves, and gaps" },
      { label: "Evidence Map", href: "/evidence", note: "Trace findings back to source observations" },
      { label: "EXSUM / AAR", href: "/exsum", note: "Generate executive-ready after action products" },
      { label: "Ask Exercise", href: "/ask-exercise", note: "Query the current exercise record" }
    ]
  },
  {
    title: "Improve",
    eyebrow: "1.0 Workspace",
    description: "Convert lessons, capability gaps, and recommendations into owner-tracked corrective actions and future planning inputs.",
    href: "/improve",
    action: "Open improve tools",
    icon: ClipboardCheck,
    links: [
      { label: "POA&M Tracker", href: "/poam", note: "Owners, suspense dates, status, and measures of success" },
      { label: "Lessons Learned", href: "/lessons", note: "Reusable lessons, best practices, and gaps" },
      { label: "Trend Analysis", href: "/insights", note: "Recurring friction and capability patterns" },
      { label: "Exercise Package", href: "/exercise-package", note: "Bundle products into a staff-ready package" }
    ]
  }
];

export default function AdvancedWorkspacePage() {
  return (
    <div>
      <PageTitle
        eyebrow="AFTERBURN 1.0"
        title="Advanced Workspace"
        description="The detailed planning, execution, review, and improvement workspace remains available here. The 2.0 Command Center summarizes what matters now; this is the engine room for building and maintaining the exercise record."
      />

      <div className="grid gap-3 xl:grid-cols-2">
        {workspaceGroups.map((group) => (
          <WorkflowStepCard key={group.title} {...group} />
        ))}
      </div>

      <section className="mt-4 rounded-md border border-line bg-panel p-4">
        <div className="flex items-start gap-3">
          <BarChart3 className="mt-0.5 text-steel" size={18} />
          <div>
            <h2 className="text-base font-semibold text-ink">2.0 stays briefable; 1.0 stays complete.</h2>
            <p className="mt-1 text-sm font-semibold leading-6 text-steel">
              Use Command Center for the exercise status board and one-page brief export. Use Advanced Workspace when a planner needs to adjust the scenario, sync matrix, MSEL, evaluator plan, analysis, EXSUM, POA&M, library, or administration details.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
