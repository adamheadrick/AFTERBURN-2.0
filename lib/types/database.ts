export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type ExerciseStatus = "draft" | "scenario" | "mission" | "feedback" | "analysis" | "exsum" | "complete";
export type Priority = "low" | "medium" | "high" | "critical";
export type ObservationType = "sustain" | "improve" | "general";
export type PoamStatus = "not_started" | "in_progress" | "complete" | "deferred";
export type DecisionPointStatus = "planned" | "pending" | "decided" | "missed";
export type EvidenceType = "observer_note" | "hotwash" | "sync_matrix" | "decision_point" | "photo" | "comms_log" | "document";
export type DropoffStatus =
  | "Received"
  | "AI Screening in Progress"
  | "Cleared for Review"
  | "Needs Human Review"
  | "Potential Sensitive Content"
  | "Rejected / Do Not Publish"
  | "Sanitization Required"
  | "Approved for Repository"
  | "Added to Repository";
export type DropoffRiskLevel = "Low" | "Medium" | "High" | "Critical";

export type Organization = {
  id: string;
  name: string;
  type: string;
  created_at: string;
};

export type Exercise = {
  id: string;
  user_id: string;
  name: string;
  date: string;
  location: string;
  lead_org: string;
  supporting_orgs: string[];
  exercise_type: string;
  scenario_category: string;
  status: ExerciseStatus;
  created_at: string;
  updated_at: string;
};

export type Scenario = {
  id: string;
  exercise_id: string;
  situation: string;
  background: string;
  triggering_event: string;
  hazard_description: string;
  operational_problem: string;
  area_of_operations: string;
  affected_population: string;
  infrastructure_impacts: string;
  weather_terrain: string;
  civil_authority_request: string;
  legal_policy_constraints: string;
  communications_environment: string;
  interagency_complexity: string;
  constraints: string;
  desired_end_state: string;
  generated_narrative: string;
  created_at: string;
  updated_at: string;
};

export type MissionAssignment = {
  id: string;
  exercise_id: string;
  mission_number: string;
  requesting_agency: string;
  supporting_agency: string;
  mission_statement: string;
  purpose: string;
  scope: string;
  tasks: string[];
  coordinating_instructions: string;
  timeline: string;
  resources_required: string;
  personnel_required: string;
  equipment_required: string;
  communications_requirements: string;
  reporting_requirements: string;
  sustainment_requirements: string;
  safety_considerations: string;
  legal_policy_considerations: string;
  command_control_structure: string;
  measures_of_performance: string[];
  measures_of_effectiveness: string[];
  deliverables: string[];
  created_at: string;
  updated_at: string;
};

export type Objective = {
  id: string;
  exercise_id: string;
  title: string;
  description: string;
  core_capability: string;
  associated_agency: string;
  evaluation_criteria: string;
  success_indicators: string;
  related_task: string;
  created_at: string;
};

export type Inject = {
  id: string;
  exercise_id: string;
  inject_number: string;
  inject_time: string;
  inject_type: string;
  description: string;
  delivered_to: string;
  expected_action: string;
  evaluation_focus: string;
  related_objective: string;
  related_task: string;
  created_at: string;
};

export type FeedbackEntry = {
  id: string;
  exercise_id: string;
  observer_name: string;
  organization: string;
  role: string;
  operational_lane: string;
  time_period: string;
  related_objective: string;
  what_happened: string;
  worked_well: string;
  did_not_work: string;
  friction: string;
  capability_gap: string;
  resource_shortfall: string;
  communication_issue: string;
  command_control_issue: string;
  interagency_issue: string;
  recommended_corrective_action: string;
  priority: Priority;
  observation_type: ObservationType;
  created_at: string;
};

export type AiAnalysis = {
  id: string;
  exercise_id: string;
  themes: string[];
  sustains: string[];
  improves: string[];
  gaps: string[];
  recommendations: string[];
  poam_recommendations: string[];
  created_at: string;
};

export type Exsum = {
  id: string;
  exercise_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type PoamItem = {
  id: string;
  exercise_id: string;
  finding_id: string;
  finding: string;
  corrective_action: string;
  responsible_office: string;
  supporting_agencies: string[];
  priority: Priority;
  due_date: string;
  status: PoamStatus;
  measure_of_success: string;
  notes: string;
  required_resources?: string;
  next_update_date?: string;
  escalation_flag?: boolean;
  completion_evidence?: string;
  created_at: string;
  updated_at: string;
};

export type SyncMatrixStatus = "planned" | "active" | "complete" | "gap" | "unassigned";

export type SyncMatrixEntry = {
  id: string;
  exercise_id: string;
  time_block: string;
  external_effect: string;
  inject_trigger: string;
  organization: string;
  task: string;
  purpose: string;
  boots_on_ground: number;
  equipment_assets: string;
  location_lane: string;
  supported_objective: string;
  supported_mission_task: string;
  communications_reporting: string;
  expected_output: string;
  status: SyncMatrixStatus;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type ExerciseReadinessScore = {
  id: string;
  exercise_id: string;
  score: number;
  label: string;
  summary: string;
  strengths: string[];
  friction_points: string[];
  missing_inputs: string[];
  recommendations: string[];
  created_at: string;
  updated_at: string;
};

export type EvaluatorAssignment = {
  id: string;
  exercise_id: string;
  evaluator_name: string;
  assigned_lane: string;
  assigned_entity: string;
  time_block: string;
  location: string;
  objective_focus: string;
  observation_focus: string;
  collection_method: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type DecisionPoint = {
  id: string;
  exercise_id: string;
  decision_required: string;
  decision_authority: string;
  time_window: string;
  information_available: string;
  options_considered: string[];
  actual_decision: string;
  outcome: string;
  aar_relevance: string;
  status: DecisionPointStatus;
  priority: Priority;
  created_at: string;
  updated_at: string;
};

export type CapabilityGap = {
  id: string;
  exercise_id: string;
  gap: string;
  capability_area: string;
  warfighting_function: string;
  civilian_category: string;
  recurrence_count: number;
  affected_entities: string[];
  recommendation: string;
  best_practice: string;
  status: PoamStatus;
  created_at: string;
  updated_at: string;
};

export type TrendInsight = {
  id: string;
  exercise_id: string;
  title: string;
  category: string;
  signal: string;
  metric: string;
  detail: string;
  recommended_action: string;
  created_at: string;
};

export type EvidenceItem = {
  id: string;
  exercise_id: string;
  finding_id: string;
  evidence_type: EvidenceType;
  source_label: string;
  linked_record: string;
  summary: string;
  relevance: string;
  created_at: string;
};

export type DropoffSubmission = {
  id: string;
  title: string;
  category: string;
  body: string;
  recommended_action: string;
  exercise_id: string | null;
  exercise_event: string;
  module_context: string;
  phase: string;
  entity: string;
  functional_area: string;
  tags: string[];
  urgency: string;
  visibility_recommendation: string;
  submitted_by: string | null;
  submitted_at: string;
  status: DropoffStatus;
  ai_screening_status: DropoffStatus;
  ai_risk_level: DropoffRiskLevel;
  ai_confidence: number;
  created_at: string;
  updated_at: string;
};

export type DropoffScreeningReport = {
  id: string;
  submission_id: string;
  risk_level: DropoffRiskLevel;
  sensitivity_categories: string[];
  flagged_terms: string[];
  flagged_sections: string[];
  recommended_handling: string;
  suggested_sanitized_text: string;
  suggested_repository_category: string;
  suggested_tags: string[];
  confidence_score: number;
  model_used: string;
  reviewer_notes: string;
  review_required_boolean: boolean;
  created_at: string;
};

export type DropoffAttachment = {
  id: string;
  submission_id: string;
  file_name: string;
  file_type: string;
  file_url: string;
  file_size: number;
  uploaded_by: string | null;
  uploaded_at: string;
  screening_status: DropoffStatus;
  risk_level: DropoffRiskLevel;
};

export type LessonsRepositoryItem = {
  id: string;
  source_submission_id: string | null;
  exercise_id: string | null;
  title: string;
  item_type: string;
  summary: string;
  approved_content: string;
  functional_area: string;
  phase: string;
  entity: string;
  tags: string[];
  recommended_action: string;
  owner: string;
  status: string;
  export_eligibility: string;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
};

type Table<Row, Insert = Omit<Row, "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string }> = {
  Row: Row;
  Insert: Insert;
  Update: Partial<Insert>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      organizations: Table<Organization, Omit<Organization, "id" | "created_at"> & { id?: string; created_at?: string }>;
      exercises: Table<Exercise>;
      scenarios: Table<Scenario>;
      mission_assignments: Table<MissionAssignment>;
      objectives: Table<Objective, Omit<Objective, "id" | "created_at"> & { id?: string; created_at?: string }>;
      injects: Table<Inject, Omit<Inject, "id" | "created_at"> & { id?: string; created_at?: string }>;
      feedback_entries: Table<FeedbackEntry, Omit<FeedbackEntry, "id" | "created_at"> & { id?: string; created_at?: string }>;
      ai_analysis: Table<AiAnalysis, Omit<AiAnalysis, "id" | "created_at"> & { id?: string; created_at?: string }>;
      exsums: Table<Exsum>;
      poam_items: Table<PoamItem>;
      sync_matrix_entries: Table<SyncMatrixEntry>;
      exercise_readiness_scores: Table<ExerciseReadinessScore>;
      evaluator_assignments: Table<EvaluatorAssignment>;
      decision_points: Table<DecisionPoint>;
      capability_gaps: Table<CapabilityGap>;
      trend_insights: Table<TrendInsight, Omit<TrendInsight, "id" | "created_at"> & { id?: string; created_at?: string }>;
      evidence_items: Table<EvidenceItem, Omit<EvidenceItem, "id" | "created_at"> & { id?: string; created_at?: string }>;
      dropoff_submissions: Table<DropoffSubmission>;
      dropoff_screening_reports: Table<DropoffScreeningReport, Omit<DropoffScreeningReport, "id" | "created_at"> & { id?: string; created_at?: string }>;
      dropoff_attachments: Table<DropoffAttachment, Omit<DropoffAttachment, "id"> & { id?: string }>;
      lessons_repository_items: Table<LessonsRepositoryItem>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
