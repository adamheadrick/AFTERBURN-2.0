export type WorkspaceId = "overview" | "plan" | "execute" | "review" | "improve" | "library";
export type WorkspaceTool = { href: string; label: string; description: string };
export type WorkspaceSection = {
  id: WorkspaceId; label: string; href: string; description: string;
  outcome: string; primary: WorkspaceTool; tools: WorkspaceTool[]; more: WorkspaceTool[];
};
const tool = (href: string, label: string, description: string): WorkspaceTool => ({ href, label, description });

export const workspaceSections: WorkspaceSection[] = [
  { id: "overview", label: "Overview", href: "/overview",
    description: "Choose your next step and keep the exercise in view.",
    outcome: "A clear purpose, a shared plan, and evidence of improvement.",
    primary: tool("/exercises/new", "Open guided planner", "Build or continue your exercise concept."),
    tools: [], more: [] },
  { id: "plan", label: "Plan", href: "/plan",
    description: "Turn a training need into a scenario, measurable objectives, and a brief your team can use.",
    outcome: "An agreed exercise plan with objectives, responsibilities, and decisions to resolve.",
    primary: tool("/exercises/new", "Open guided planner", "Start with a few essentials, or import a planning document."),
    tools: [
      tool("/exercises/new", "Guided planner", "Define the purpose, shape the story, and review objectives and proposed events."),
      tool("/briefing", "Planning brief", "Build a briefing from your browser draft, with open decisions and responsibilities."),
      tool("/readiness", "Readiness review", "Check the workspace plan for gaps before committing to execution.")
    ],
    more: [
      tool("/scenario-builder", "Scenario detail", "Explore the workspace scenario fields and narrative."),
      tool("/objectives", "Objectives", "Review measurable outcomes and evaluation criteria."),
      tool("/mission-assignment", "Roles & tasks", "Define responsibilities, resources, communications, and reporting."),
      tool("/graphic-overview", "Exercise map", "Arrange the operational picture and lane overview."),
      tool("/red-team", "Plan challenge", "Explore assumptions, dependencies, and potential weaknesses.")
    ] },
  { id: "execute", label: "Execute", href: "/execute",
    description: "Coordinate exercise play and capture what teams actually do.",
    outcome: "An event record that connects observations and decisions to exercise objectives.",
    primary: tool("/feedback", "Capture an observation", "Record what happened, the objective, and supporting evidence."),
    tools: [
      tool("/sync-matrix", "Exercise timeline", "Coordinate timing, tasks, organizations, and dependencies."),
      tool("/injects", "Injects", "Review scenario events, recipients, and expected actions."),
      tool("/feedback", "Observations", "Capture performance, friction, and evidence during exercise play.")
    ],
    more: [
      tool("/evaluators", "Evaluator coverage", "Check who observes each objective and when."),
      tool("/decision-points", "Decision log", "Record decision authority, information, and outcomes."),
      tool("/white-cell", "Exercise control", "Support controllers as the scenario develops."),
      tool("/participant-portal", "Participant view", "Explore information for participating teams.")
    ] },
  { id: "review", label: "Review", href: "/review",
    description: "Assess performance against objectives and turn evidence into defensible findings.",
    outcome: "Reviewed findings and an after-action report that distinguish evidence from assumptions.",
    primary: tool("/analysis", "Review observations", "Examine patterns, strengths, and areas for improvement."),
    tools: [
      tool("/analysis", "Findings", "Analyze observations and review the proposed findings."),
      tool("/evidence", "Evidence", "Check the support for each finding and recommendation."),
      tool("/exsum", "After-action report", "Draft the assessment narrative and executive summary.")
    ],
    more: [
      tool("/ask-exercise", "Ask AFTERBURN", "Ask questions about the workspace exercise."),
      tool("/exercise-package", "Exercise package", "Review available products and export availability.")
    ] },
  { id: "improve", label: "Improve", href: "/improve",
    description: "Turn findings into owned actions, then carry the learning into the next exercise.",
    outcome: "Actions with owners, due dates, and evidence that the improvement worked.",
    primary: tool("/poam", "Open improvement plan", "Review actions, responsibilities, and completion evidence."),
    tools: [
      tool("/poam", "Improvement plan", "Track corrective actions and what counts as completion."),
      tool("/lessons", "Lessons", "Review what should be retained and reused."),
      tool("/insights", "Trends", "Explore recurring gaps across exercise records.")
    ], more: [] },
  { id: "library", label: "Library", href: "/library",
    description: "Find exercise records and lessons to inform your next plan.",
    outcome: "Reusable experience with its source and review status intact.",
    primary: tool("/exercises", "Browse exercises", "Open available exercise records."),
    tools: [
      tool("/exercises", "Exercise records", "Browse saved workspace exercises."),
      tool("/lessons", "Lessons", "Find lessons and their supporting context."),
      tool("/ask-exercise", "Ask AFTERBURN", "Explore the current workspace exercise; cross-exercise search is not yet connected.")
    ], more: [] }
];

export function workspaceForPath(path: string): WorkspaceSection | undefined {
  if (path === "/dashboard" || path === "/advanced") return workspaceSections[0];
  if (path.startsWith("/exercises/new")) return workspaceSections[1];
  if (path.startsWith("/exercises/")) return workspaceSections[5];
  if (path.startsWith("/summaries/")) return workspaceSections[3];
  if (path === "/observations/new") return workspaceSections[2];
  // First ownership wins for tools reused from Library or another phase.
  return workspaceSections.find(section => section.href === path ||
    [...section.tools, ...section.more].some(item => item.href === path));
}

export function toolForPath(path: string): WorkspaceTool | undefined {
  return workspaceSections.flatMap(section => [...section.tools, ...section.more]).find(item => item.href === path);
}

export function pathsForWorkspace(id: WorkspaceId): string[] {
  const section = workspaceSections.find(item => item.id === id)!;
  const paths = [section.href, ...section.tools.map(item => item.href), ...section.more.map(item => item.href)]
    .filter(path => workspaceForPath(path)?.id === id);
  if (id === "overview") paths.push("/dashboard", "/advanced");
  if (id === "execute") paths.push("/observations/new");
  if (id === "review") paths.push("/summaries");
  return [...new Set(paths)];
}
