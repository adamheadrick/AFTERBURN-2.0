create extension if not exists pgcrypto;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  date date not null,
  location text not null,
  lead_org text not null,
  supporting_orgs text[] not null default '{}',
  exercise_type text not null,
  scenario_category text not null,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.scenarios (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  situation text not null default '',
  background text not null default '',
  triggering_event text not null default '',
  hazard_description text not null default '',
  operational_problem text not null default '',
  area_of_operations text not null default '',
  affected_population text not null default '',
  infrastructure_impacts text not null default '',
  weather_terrain text not null default '',
  civil_authority_request text not null default '',
  legal_policy_constraints text not null default '',
  communications_environment text not null default '',
  interagency_complexity text not null default '',
  constraints text not null default '',
  desired_end_state text not null default '',
  generated_narrative text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mission_assignments (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  mission_number text not null,
  requesting_agency text not null default '',
  supporting_agency text not null default '',
  mission_statement text not null default '',
  purpose text not null default '',
  scope text not null default '',
  tasks text[] not null default '{}',
  coordinating_instructions text not null default '',
  timeline text not null default '',
  resources_required text not null default '',
  personnel_required text not null default '',
  equipment_required text not null default '',
  communications_requirements text not null default '',
  reporting_requirements text not null default '',
  sustainment_requirements text not null default '',
  safety_considerations text not null default '',
  legal_policy_considerations text not null default '',
  command_control_structure text not null default '',
  measures_of_performance text[] not null default '{}',
  measures_of_effectiveness text[] not null default '{}',
  deliverables text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.objectives (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  title text not null,
  description text not null default '',
  core_capability text not null default '',
  associated_agency text not null default '',
  evaluation_criteria text not null default '',
  success_indicators text not null default '',
  related_task text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.injects (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  inject_number text not null,
  inject_time text not null,
  inject_type text not null,
  description text not null default '',
  delivered_to text not null default '',
  expected_action text not null default '',
  evaluation_focus text not null default '',
  related_objective text not null default '',
  related_task text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.sync_matrix_entries (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  time_block text not null,
  external_effect text not null default '',
  inject_trigger text not null default '',
  organization text not null default '',
  task text not null default '',
  purpose text not null default '',
  boots_on_ground integer not null default 0,
  equipment_assets text not null default '',
  location_lane text not null default '',
  supported_objective text not null default '',
  supported_mission_task text not null default '',
  communications_reporting text not null default '',
  expected_output text not null default '',
  status text not null default 'planned',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.feedback_entries (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  observer_name text not null,
  organization text not null default '',
  role text not null default '',
  operational_lane text not null default '',
  time_period text not null default '',
  related_objective text not null default '',
  what_happened text not null default '',
  worked_well text not null default '',
  did_not_work text not null default '',
  friction text not null default '',
  capability_gap text not null default '',
  resource_shortfall text not null default '',
  communication_issue text not null default '',
  command_control_issue text not null default '',
  interagency_issue text not null default '',
  recommended_corrective_action text not null default '',
  priority text not null default 'medium',
  observation_type text not null default 'general',
  created_at timestamptz not null default now()
);

create table if not exists public.exercise_readiness_scores (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  score integer not null default 0,
  label text not null default '',
  summary text not null default '',
  strengths text[] not null default '{}',
  friction_points text[] not null default '{}',
  missing_inputs text[] not null default '{}',
  recommendations text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.evaluator_assignments (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  evaluator_name text not null default '',
  assigned_lane text not null default '',
  assigned_entity text not null default '',
  time_block text not null default '',
  location text not null default '',
  objective_focus text not null default '',
  observation_focus text not null default '',
  collection_method text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.decision_points (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  decision_required text not null default '',
  decision_authority text not null default '',
  time_window text not null default '',
  information_available text not null default '',
  options_considered text[] not null default '{}',
  actual_decision text not null default '',
  outcome text not null default '',
  aar_relevance text not null default '',
  status text not null default 'planned',
  priority text not null default 'medium',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.capability_gaps (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  gap text not null default '',
  capability_area text not null default '',
  warfighting_function text not null default '',
  civilian_category text not null default '',
  recurrence_count integer not null default 1,
  affected_entities text[] not null default '{}',
  recommendation text not null default '',
  best_practice text not null default '',
  status text not null default 'not_started',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trend_insights (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  title text not null default '',
  category text not null default '',
  signal text not null default '',
  metric text not null default '',
  detail text not null default '',
  recommended_action text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.evidence_items (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  finding_id text not null default '',
  evidence_type text not null default 'observer_note',
  source_label text not null default '',
  linked_record text not null default '',
  summary text not null default '',
  relevance text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.dropoff_submissions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  body text not null default '',
  recommended_action text not null default '',
  exercise_id uuid references public.exercises(id) on delete set null,
  exercise_event text not null default '',
  module_context text not null default 'Planning',
  phase text not null default 'Planning',
  entity text not null default '',
  functional_area text not null default 'Operations',
  tags text[] not null default '{}',
  urgency text not null default 'Medium',
  visibility_recommendation text not null default 'Internal Review Only',
  submitted_by uuid references auth.users(id) on delete set null,
  submitted_at timestamptz not null default now(),
  status text not null default 'Received',
  ai_screening_status text not null default 'Received',
  ai_risk_level text not null default 'Low',
  ai_confidence numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dropoff_screening_reports (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.dropoff_submissions(id) on delete cascade,
  risk_level text not null default 'Low',
  sensitivity_categories text[] not null default '{}',
  flagged_terms text[] not null default '{}',
  flagged_sections text[] not null default '{}',
  recommended_handling text not null default '',
  suggested_sanitized_text text not null default '',
  suggested_repository_category text not null default '',
  suggested_tags text[] not null default '{}',
  confidence_score numeric not null default 0,
  model_used text not null default '',
  reviewer_notes text not null default '',
  review_required_boolean boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.dropoff_attachments (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.dropoff_submissions(id) on delete cascade,
  file_name text not null,
  file_type text not null default '',
  file_url text not null default '',
  file_size bigint not null default 0,
  uploaded_by uuid references auth.users(id) on delete set null,
  uploaded_at timestamptz not null default now(),
  screening_status text not null default 'Received',
  risk_level text not null default 'Low'
);

create table if not exists public.lessons_repository_items (
  id uuid primary key default gen_random_uuid(),
  source_submission_id uuid references public.dropoff_submissions(id) on delete set null,
  exercise_id uuid references public.exercises(id) on delete set null,
  title text not null,
  item_type text not null default 'Lesson Learned',
  summary text not null default '',
  approved_content text not null default '',
  functional_area text not null default '',
  phase text not null default '',
  entity text not null default '',
  tags text[] not null default '{}',
  recommended_action text not null default '',
  owner text not null default '',
  status text not null default 'Open',
  export_eligibility text not null default 'Internal Only',
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_analysis (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  themes text[] not null default '{}',
  sustains text[] not null default '{}',
  improves text[] not null default '{}',
  gaps text[] not null default '{}',
  recommendations text[] not null default '{}',
  poam_recommendations text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.exsums (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  title text not null default 'AFTERBURN Executive Summary',
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.poam_items (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  finding_id text not null,
  finding text not null default '',
  corrective_action text not null default '',
  responsible_office text not null default '',
  supporting_agencies text[] not null default '{}',
  priority text not null default 'medium',
  due_date date,
  status text not null default 'not_started',
  measure_of_success text not null default '',
  notes text not null default '',
  required_resources text not null default '',
  next_update_date date,
  escalation_flag boolean not null default false,
  completion_evidence text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.poam_items add column if not exists required_resources text not null default '';
alter table public.poam_items add column if not exists next_update_date date;
alter table public.poam_items add column if not exists escalation_flag boolean not null default false;
alter table public.poam_items add column if not exists completion_evidence text not null default '';

alter table public.exercises enable row level security;
alter table public.scenarios enable row level security;
alter table public.mission_assignments enable row level security;
alter table public.objectives enable row level security;
alter table public.injects enable row level security;
alter table public.sync_matrix_entries enable row level security;
alter table public.feedback_entries enable row level security;
alter table public.exercise_readiness_scores enable row level security;
alter table public.evaluator_assignments enable row level security;
alter table public.decision_points enable row level security;
alter table public.capability_gaps enable row level security;
alter table public.trend_insights enable row level security;
alter table public.evidence_items enable row level security;
alter table public.dropoff_submissions enable row level security;
alter table public.dropoff_screening_reports enable row level security;
alter table public.dropoff_attachments enable row level security;
alter table public.lessons_repository_items enable row level security;
alter table public.ai_analysis enable row level security;
alter table public.exsums enable row level security;
alter table public.poam_items enable row level security;

create policy "Users manage their exercises" on public.exercises
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage exercise scenarios" on public.scenarios
  for all using (exists (select 1 from public.exercises where exercises.id = scenarios.exercise_id and exercises.user_id = auth.uid()))
  with check (exists (select 1 from public.exercises where exercises.id = scenarios.exercise_id and exercises.user_id = auth.uid()));

create policy "Users manage mission assignments" on public.mission_assignments
  for all using (exists (select 1 from public.exercises where exercises.id = mission_assignments.exercise_id and exercises.user_id = auth.uid()))
  with check (exists (select 1 from public.exercises where exercises.id = mission_assignments.exercise_id and exercises.user_id = auth.uid()));

create policy "Users manage objectives" on public.objectives
  for all using (exists (select 1 from public.exercises where exercises.id = objectives.exercise_id and exercises.user_id = auth.uid()))
  with check (exists (select 1 from public.exercises where exercises.id = objectives.exercise_id and exercises.user_id = auth.uid()));

create policy "Users manage injects" on public.injects
  for all using (exists (select 1 from public.exercises where exercises.id = injects.exercise_id and exercises.user_id = auth.uid()))
  with check (exists (select 1 from public.exercises where exercises.id = injects.exercise_id and exercises.user_id = auth.uid()));

create policy "Users manage sync matrix" on public.sync_matrix_entries
  for all using (exists (select 1 from public.exercises where exercises.id = sync_matrix_entries.exercise_id and exercises.user_id = auth.uid()))
  with check (exists (select 1 from public.exercises where exercises.id = sync_matrix_entries.exercise_id and exercises.user_id = auth.uid()));

create policy "Users manage feedback" on public.feedback_entries
  for all using (exists (select 1 from public.exercises where exercises.id = feedback_entries.exercise_id and exercises.user_id = auth.uid()))
  with check (exists (select 1 from public.exercises where exercises.id = feedback_entries.exercise_id and exercises.user_id = auth.uid()));

create policy "Users manage readiness scores" on public.exercise_readiness_scores
  for all using (exists (select 1 from public.exercises where exercises.id = exercise_readiness_scores.exercise_id and exercises.user_id = auth.uid()))
  with check (exists (select 1 from public.exercises where exercises.id = exercise_readiness_scores.exercise_id and exercises.user_id = auth.uid()));

create policy "Users manage evaluator assignments" on public.evaluator_assignments
  for all using (exists (select 1 from public.exercises where exercises.id = evaluator_assignments.exercise_id and exercises.user_id = auth.uid()))
  with check (exists (select 1 from public.exercises where exercises.id = evaluator_assignments.exercise_id and exercises.user_id = auth.uid()));

create policy "Users manage decision points" on public.decision_points
  for all using (exists (select 1 from public.exercises where exercises.id = decision_points.exercise_id and exercises.user_id = auth.uid()))
  with check (exists (select 1 from public.exercises where exercises.id = decision_points.exercise_id and exercises.user_id = auth.uid()));

create policy "Users manage capability gaps" on public.capability_gaps
  for all using (exists (select 1 from public.exercises where exercises.id = capability_gaps.exercise_id and exercises.user_id = auth.uid()))
  with check (exists (select 1 from public.exercises where exercises.id = capability_gaps.exercise_id and exercises.user_id = auth.uid()));

create policy "Users manage trend insights" on public.trend_insights
  for all using (exists (select 1 from public.exercises where exercises.id = trend_insights.exercise_id and exercises.user_id = auth.uid()))
  with check (exists (select 1 from public.exercises where exercises.id = trend_insights.exercise_id and exercises.user_id = auth.uid()));

create policy "Users manage evidence items" on public.evidence_items
  for all using (exists (select 1 from public.exercises where exercises.id = evidence_items.exercise_id and exercises.user_id = auth.uid()))
  with check (exists (select 1 from public.exercises where exercises.id = evidence_items.exercise_id and exercises.user_id = auth.uid()));

create policy "Users manage dropoff submissions" on public.dropoff_submissions
  for all using (
    submitted_by = auth.uid()
    or exists (select 1 from public.exercises where exercises.id = dropoff_submissions.exercise_id and exercises.user_id = auth.uid())
  )
  with check (
    submitted_by = auth.uid()
    or exists (select 1 from public.exercises where exercises.id = dropoff_submissions.exercise_id and exercises.user_id = auth.uid())
  );

create policy "Users manage dropoff screening reports" on public.dropoff_screening_reports
  for all using (exists (
    select 1 from public.dropoff_submissions
    where dropoff_submissions.id = dropoff_screening_reports.submission_id
    and (
      dropoff_submissions.submitted_by = auth.uid()
      or exists (select 1 from public.exercises where exercises.id = dropoff_submissions.exercise_id and exercises.user_id = auth.uid())
    )
  ))
  with check (exists (
    select 1 from public.dropoff_submissions
    where dropoff_submissions.id = dropoff_screening_reports.submission_id
    and (
      dropoff_submissions.submitted_by = auth.uid()
      or exists (select 1 from public.exercises where exercises.id = dropoff_submissions.exercise_id and exercises.user_id = auth.uid())
    )
  ));

create policy "Users manage dropoff attachments" on public.dropoff_attachments
  for all using (exists (
    select 1 from public.dropoff_submissions
    where dropoff_submissions.id = dropoff_attachments.submission_id
    and (
      dropoff_submissions.submitted_by = auth.uid()
      or exists (select 1 from public.exercises where exercises.id = dropoff_submissions.exercise_id and exercises.user_id = auth.uid())
    )
  ))
  with check (exists (
    select 1 from public.dropoff_submissions
    where dropoff_submissions.id = dropoff_attachments.submission_id
    and (
      dropoff_submissions.submitted_by = auth.uid()
      or exists (select 1 from public.exercises where exercises.id = dropoff_submissions.exercise_id and exercises.user_id = auth.uid())
    )
  ));

create policy "Users manage lessons repository items" on public.lessons_repository_items
  for all using (
    exists (select 1 from public.exercises where exercises.id = lessons_repository_items.exercise_id and exercises.user_id = auth.uid())
    or exists (
      select 1 from public.dropoff_submissions
      where dropoff_submissions.id = lessons_repository_items.source_submission_id
      and dropoff_submissions.submitted_by = auth.uid()
    )
  )
  with check (
    exists (select 1 from public.exercises where exercises.id = lessons_repository_items.exercise_id and exercises.user_id = auth.uid())
    or exists (
      select 1 from public.dropoff_submissions
      where dropoff_submissions.id = lessons_repository_items.source_submission_id
      and dropoff_submissions.submitted_by = auth.uid()
    )
  );

create policy "Users manage analysis" on public.ai_analysis
  for all using (exists (select 1 from public.exercises where exercises.id = ai_analysis.exercise_id and exercises.user_id = auth.uid()))
  with check (exists (select 1 from public.exercises where exercises.id = ai_analysis.exercise_id and exercises.user_id = auth.uid()));

create policy "Users manage exsums" on public.exsums
  for all using (exists (select 1 from public.exercises where exercises.id = exsums.exercise_id and exercises.user_id = auth.uid()))
  with check (exists (select 1 from public.exercises where exercises.id = exsums.exercise_id and exercises.user_id = auth.uid()));

create policy "Users manage poam" on public.poam_items
  for all using (exists (select 1 from public.exercises where exercises.id = poam_items.exercise_id and exercises.user_id = auth.uid()))
  with check (exists (select 1 from public.exercises where exercises.id = poam_items.exercise_id and exercises.user_id = auth.uid()));
