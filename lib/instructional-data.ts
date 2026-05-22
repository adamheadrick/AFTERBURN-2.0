import type {
  AiAnalysis,
  CapabilityGap,
  DecisionPoint,
  DropoffScreeningReport,
  DropoffSubmission,
  EvaluatorAssignment,
  EvidenceItem,
  Exercise,
  ExerciseReadinessScore,
  Exsum,
  FeedbackEntry,
  Inject,
  LessonsRepositoryItem,
  MissionAssignment,
  Objective,
  PoamItem,
  Scenario,
  SyncMatrixEntry,
  TrendInsight
} from "@/lib/types/database";

const now = new Date().toISOString();

export const instructionalExercise: Exercise = {
  id: "instructional-exercise",
  user_id: "local-preview",
  name: "No active exercise",
  date: now,
  location: "",
  lead_org: "",
  supporting_orgs: [],
  exercise_type: "",
  scenario_category: "",
  status: "draft",
  created_at: now,
  updated_at: now
};

export const instructionalScenario: Scenario = {
  id: "instructional-scenario",
  exercise_id: instructionalExercise.id,
  situation: "",
  background: "",
  triggering_event: "",
  hazard_description: "",
  operational_problem: "",
  area_of_operations: "",
  affected_population: "",
  infrastructure_impacts: "",
  weather_terrain: "",
  civil_authority_request: "",
  legal_policy_constraints: "",
  communications_environment: "",
  interagency_complexity: "",
  constraints: "",
  desired_end_state: "",
  generated_narrative: "",
  created_at: now,
  updated_at: now
};

export const instructionalMissionAssignment: MissionAssignment = {
  id: "instructional-mission-assignment",
  exercise_id: instructionalExercise.id,
  mission_number: "",
  requesting_agency: "",
  supporting_agency: "",
  mission_statement: "",
  purpose: "",
  scope: "",
  tasks: [],
  coordinating_instructions: "",
  timeline: "",
  resources_required: "",
  personnel_required: "",
  equipment_required: "",
  communications_requirements: "",
  reporting_requirements: "",
  sustainment_requirements: "",
  safety_considerations: "",
  legal_policy_considerations: "",
  command_control_structure: "",
  measures_of_performance: [],
  measures_of_effectiveness: [],
  deliverables: [],
  created_at: now,
  updated_at: now
};

export const instructionalAnalysis: AiAnalysis = {
  id: "instructional-analysis",
  exercise_id: instructionalExercise.id,
  themes: [],
  sustains: [],
  improves: [],
  gaps: [],
  recommendations: [],
  poam_recommendations: [],
  created_at: now
};

export const instructionalExsum: Exsum = {
  id: "instructional-exsum",
  exercise_id: instructionalExercise.id,
  title: "AFTERBURN Executive Summary",
  content: "",
  created_at: now,
  updated_at: now
};

export const instructionalReadinessScore: ExerciseReadinessScore = {
  id: "instructional-readiness",
  exercise_id: instructionalExercise.id,
  score: 0,
  label: "Not started",
  summary: "Create or open an exercise to begin readiness assessment. AFTERBURN will summarize status once planning inputs, participants, objectives, tasking, timeline, communications, evaluator coverage, and risk controls are captured.",
  strengths: [],
  friction_points: [],
  missing_inputs: [
    "Exercise overview",
    "Scenario and objectives",
    "Participating organizations",
    "Tasking and timeline",
    "Communications and evaluator coverage"
  ],
  recommendations: [
    "Start with the exercise setup form.",
    "Add a scenario, objectives, and participating organizations.",
    "Use the readiness gate once planning products are drafted."
  ],
  created_at: now,
  updated_at: now
};

export const instructionalAfterburnData = {
  exercises: [] as Exercise[],
  exercise: instructionalExercise,
  scenario: instructionalScenario,
  missionAssignment: instructionalMissionAssignment,
  objectives: [] as Objective[],
  injects: [] as Inject[],
  syncMatrixEntries: [] as SyncMatrixEntry[],
  feedbackEntries: [] as FeedbackEntry[],
  analysis: instructionalAnalysis,
  exsum: instructionalExsum,
  poamItems: [] as PoamItem[],
  readinessScore: instructionalReadinessScore,
  evaluatorAssignments: [] as EvaluatorAssignment[],
  decisionPoints: [] as DecisionPoint[],
  capabilityGaps: [] as CapabilityGap[],
  trendInsights: [] as TrendInsight[],
  evidenceItems: [] as EvidenceItem[],
  dropoffSubmissions: [] as DropoffSubmission[],
  dropoffScreeningReports: [] as DropoffScreeningReport[],
  lessonsRepositoryItems: [] as LessonsRepositoryItem[]
};
