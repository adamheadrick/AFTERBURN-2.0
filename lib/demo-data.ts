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
  MissionAssignment,
  Objective,
  LessonsRepositoryItem,
  PoamItem,
  Scenario,
  SyncMatrixEntry,
  TrendInsight
} from "@/lib/types/database";

function daysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export const demoExercise: Exercise = {
  id: "00000000-0000-4000-8000-000000000101",
  user_id: "demo-user",
  name: "Exercise LIGHTNING STRIKE",
  date: daysFromNow(14),
  location: "Central River Valley Joint Operations Area",
  lead_org: "State Emergency Management Agency",
  supporting_orgs: [
    "National Guard",
    "Local law enforcement",
    "Fire services",
    "EMS",
    "Public works",
    "Emergency communications",
    "Volunteer organizations"
  ],
  exercise_type: "Domestic Operations Exercise",
  scenario_category: "Multi-Hazard Complex Incident",
  status: "exsum",
  created_at: daysFromNow(-10),
  updated_at: daysFromNow(-1)
};

export const demoExercises: Exercise[] = [
  demoExercise,
  {
    id: "00000000-0000-4000-8000-000000000102",
    user_id: "demo-user",
    name: "Cyber Infrastructure Coordination TTX",
    date: daysFromNow(38),
    location: "State Fusion Center",
    lead_org: "Homeland Security Office",
    supporting_orgs: ["National Guard cyber protection team", "Public utilities", "State CIO", "FBI field office"],
    exercise_type: "Cyber / Infrastructure Exercise",
    scenario_category: "Critical Infrastructure Disruption",
    status: "mission",
    created_at: daysFromNow(-6),
    updated_at: daysFromNow(-2)
  },
  {
    id: "00000000-0000-4000-8000-000000000103",
    user_id: "demo-user",
    name: "UAS Incident Response Drill",
    date: daysFromNow(-21),
    location: "Metro Stadium District",
    lead_org: "County Emergency Management",
    supporting_orgs: ["Law enforcement", "Fire services", "FAA liaison", "National Guard civil support team"],
    exercise_type: "Law Enforcement Support Exercise",
    scenario_category: "UAS / Drone Threat",
    status: "complete",
    created_at: daysFromNow(-45),
    updated_at: daysFromNow(-18)
  }
];

export const demoScenario: Scenario = {
  id: "00000000-0000-4000-8000-000000000201",
  exercise_id: demoExercise.id,
  situation:
    "A multi-day severe storm system has moved through the Central River Valley, producing flash flooding, wind damage, communications degradation, and cascading infrastructure impacts.",
  background:
    "The region includes dense urban neighborhoods, rural communities, rail corridors, a regional airport, two hospitals, and critical power and water infrastructure.",
  triggering_event:
    "A second storm cell causes additional flooding, collapses a bridge approach, damages a fiber aggregation site, and strands residents in multiple low-lying areas.",
  hazard_description:
    "Severe weather, flood response, search and rescue requirements, UAS support requests, public safety communications disruption, and transportation infrastructure damage.",
  operational_problem:
    "Civil authorities require coordinated support to restore situational awareness, prioritize life safety missions, allocate scarce high-water vehicles, and synchronize public messaging.",
  area_of_operations:
    "Three-county joint operations area centered on River City, North Fork Township, and the State Route 18 corridor.",
  affected_population:
    "Approximately 84,000 residents are affected, including hospital patients, assisted living facilities, schools, commuters, and isolated rural households.",
  infrastructure_impacts:
    "Power outages affect water pumping stations, cellular service is intermittent, the county 911 center is operating on backup systems, and two evacuation routes are degraded.",
  weather_terrain:
    "Saturated terrain, low visibility, swift-water hazards, blocked roads, and limited aviation windows complicate response operations.",
  civil_authority_request:
    "The State Emergency Management Agency requests National Guard support for high-water rescue, logistics movement, UAS reconnaissance, communications relay, and liaison support.",
  legal_policy_constraints:
    "All support must comply with state active duty authorities, DSCA principles, local incident command priorities, privacy constraints for UAS collection, and law enforcement support limitations.",
  communications_environment:
    "Responder radio interoperability is uneven, cellular backhaul is degraded, and agencies are using a mix of WebEOC, radio nets, mobile data terminals, and liaison phone trees.",
  interagency_complexity:
    "State, county, municipal, National Guard, law enforcement, fire, EMS, public works, voluntary agencies, utility providers, and private-sector infrastructure owners must coordinate under compressed timelines.",
  constraints:
    "Limited high-water vehicles, constrained aviation windows, incomplete common operating picture, competing local priorities, and degraded communications.",
  desired_end_state:
    "Life safety missions are prioritized, requested support is assigned through a clear mission assignment, responders share a common operating picture, and leaders identify corrective actions for future incidents.",
  generated_narrative:
    "Exercise LIGHTNING STRIKE places planners in a complex domestic operations environment following a severe weather outbreak across the Central River Valley. The incident combines flooding, infrastructure disruption, communications degradation, search and rescue demand, and requests for UAS-enabled reconnaissance. Civil authorities must establish priorities, request and assign support, maintain unity of effort across agencies, and communicate risk to affected communities. The planning focus is on mission assignment quality, interagency coordination, command and control, resource allocation, operational reporting, and the ability to convert field observations into actionable improvement plan items.",
  created_at: daysFromNow(-9),
  updated_at: daysFromNow(-1)
};

export const demoMissionAssignment: MissionAssignment = {
  id: "00000000-0000-4000-8000-000000000301",
  exercise_id: demoExercise.id,
  mission_number: "MA-LS-001",
  requesting_agency: "State Emergency Management Agency",
  supporting_agency: "State National Guard Joint Task Force",
  mission_statement:
    "On order, the State National Guard supports civil authorities in the Central River Valley by providing high-water rescue support, logistics movement, UAS reconnaissance, communications relay, and liaison capability in order to protect life, stabilize incident operations, and restore situational awareness.",
  purpose:
    "Provide time-sensitive capabilities requested by civil authorities while validating mission assignment development, command relationships, reporting requirements, and interagency coordination.",
  scope:
    "Support applies to the three-county joint operations area and includes planning, liaison, movement, reconnaissance, communications support, and mission tracking during the exercise period.",
  tasks: [
    "Establish National Guard liaison presence at the State EOC and affected county EOCs.",
    "Provide high-water vehicle teams for prioritized rescue and welfare check missions.",
    "Conduct UAS reconnaissance of damaged transportation corridors and isolated neighborhoods.",
    "Support logistics movement of water, generators, sandbags, and shelter commodities.",
    "Provide communications relay support where local public safety communications are degraded.",
    "Submit operational reports, mission status updates, and resource shortfall notifications through the agreed reporting cycle."
  ],
  coordinating_instructions:
    "All tasking will be validated through the State EOC mission assignment process. County requests will be prioritized by life safety, incident stabilization, and critical infrastructure protection.",
  timeline:
    "Initial capability available within 6 hours of mission approval; full task force package available within 18 hours; operational reporting every 4 hours.",
  resources_required:
    "High-water vehicles, liaison officers, UAS teams, tactical communications package, logistics vehicles, mission tracking support, and planning cell augmentation.",
  personnel_required:
    "Task force command element, liaison teams, vehicle operators, UAS pilots, communications specialists, logistics personnel, and safety officer.",
  equipment_required:
    "High-water vehicles, generators, UAS platforms, satellite communications kits, radios, laptops, fuel support, and personal protective equipment.",
  communications_requirements:
    "Primary coordination through State EOC battle rhythm, WebEOC mission tracker, interoperable radio channels, liaison phone bridge, and backup satellite communications.",
  reporting_requirements:
    "Submit SPOT reports for urgent incidents, situation reports every 4 hours, resource status updates every operational period, and final mission closeout report.",
  sustainment_requirements:
    "Fuel, meals, lodging, maintenance, battery charging, UAS data management, and crew rest plan for 72-hour support window.",
  safety_considerations:
    "Swift-water hazards, downed power lines, contaminated floodwater, UAS airspace coordination, fatigue, nighttime operations, and traffic control around damaged infrastructure.",
  legal_policy_considerations:
    "Mission execution must remain within state active duty authority, respect law enforcement limitations, protect privacy during UAS collection, and preserve civil authority lead.",
  command_control_structure:
    "State EOC retains mission assignment authority. National Guard Joint Task Force commands assigned Guard forces. County incident commanders prioritize local missions through emergency management channels.",
  measures_of_performance: [
    "Mission assignment approved with clear tasks, scope, and reporting requirements.",
    "Liaison officers embedded at required coordination nodes.",
    "Priority rescue and reconnaissance requests tracked to completion."
  ],
  measures_of_effectiveness: [
    "Civil authorities report improved situational awareness.",
    "Resource requests are prioritized consistently across counties.",
    "Operational reporting supports senior leader decisions."
  ],
  deliverables: [
    "Mission assignment package",
    "Resource status tracker",
    "UAS reconnaissance products",
    "Operational reports",
    "After-action findings and POA&M items"
  ],
  created_at: daysFromNow(-8),
  updated_at: daysFromNow(-1)
};

export const demoObjectives: Objective[] = [
  {
    id: "00000000-0000-4000-8000-000000000401",
    exercise_id: demoExercise.id,
    title: "Validate command and control structure",
    description: "Assess whether incident command, EOC, and National Guard task force command relationships are understood and executable.",
    core_capability: "Operational Coordination",
    associated_agency: "State Emergency Management Agency",
    evaluation_criteria: "Authorities, roles, reporting lines, and battle rhythm are stated and used during play.",
    success_indicators: "Decision owners are identified within 15 minutes of issue presentation.",
    related_task: "Establish National Guard liaison presence at State EOC and affected county EOCs.",
    created_at: daysFromNow(-8)
  },
  {
    id: "00000000-0000-4000-8000-000000000402",
    exercise_id: demoExercise.id,
    title: "Assess interagency communication",
    description: "Evaluate communication flow across emergency management, public safety, Guard liaison, public works, and volunteer organizations.",
    core_capability: "Operational Communications",
    associated_agency: "Emergency Communications Division",
    evaluation_criteria: "Agencies establish primary and backup communications and share critical updates in the common operating picture.",
    success_indicators: "Critical information reaches all represented agencies within one planning cycle.",
    related_task: "Provide communications relay support where local public safety communications are degraded.",
    created_at: daysFromNow(-8)
  },
  {
    id: "00000000-0000-4000-8000-000000000403",
    exercise_id: demoExercise.id,
    title: "Evaluate mission assignment execution",
    description: "Determine whether mission assignment tasks are specific, resourced, trackable, and aligned to civil authority priorities.",
    core_capability: "Logistics and Supply Chain Management",
    associated_agency: "National Guard Joint Task Force",
    evaluation_criteria: "Mission tasks include purpose, scope, timeline, reporting, and resource requirements.",
    success_indicators: "All mission tasks are assigned owners and status updates during the operational period.",
    related_task: "Support logistics movement and submit operational reports.",
    created_at: daysFromNow(-8)
  }
];

export const demoInjects: Inject[] = [
  {
    id: "00000000-0000-4000-8000-000000000501",
    exercise_id: demoExercise.id,
    inject_number: "001",
    inject_time: "09:15",
    inject_type: "Situation Update",
    description: "County EOC reports 43 residents stranded near a flooded mobile home park with limited responder access.",
    delivered_to: "State EOC Operations Section",
    expected_action: "Prioritize life safety mission, validate request, and assign high-water vehicle support.",
    evaluation_focus: "Mission request validation and resource prioritization",
    related_objective: "Evaluate mission assignment execution",
    related_task: "Provide high-water vehicle teams for prioritized rescue and welfare check missions.",
    created_at: daysFromNow(-7)
  },
  {
    id: "00000000-0000-4000-8000-000000000502",
    exercise_id: demoExercise.id,
    inject_number: "002",
    inject_time: "10:05",
    inject_type: "Communications Degradation",
    description: "Primary county radio repeater fails and cellular coverage becomes unreliable in the north sector.",
    delivered_to: "Communications Unit and Guard Liaison",
    expected_action: "Activate backup communications plan and request relay support.",
    evaluation_focus: "Interoperability and backup communications",
    related_objective: "Assess interagency communication",
    related_task: "Provide communications relay support where local public safety communications are degraded.",
    created_at: daysFromNow(-7)
  },
  {
    id: "00000000-0000-4000-8000-000000000503",
    exercise_id: demoExercise.id,
    inject_number: "003",
    inject_time: "11:20",
    inject_type: "UAS Request",
    description: "Public works requests UAS imagery of a damaged bridge approach before crews can enter the area.",
    delivered_to: "Planning Section and Air Operations Coordinator",
    expected_action: "Validate legal and airspace considerations, assign UAS team, and define product requirements.",
    evaluation_focus: "UAS request process and legal constraints",
    related_objective: "Validate command and control structure",
    related_task: "Conduct UAS reconnaissance of damaged transportation corridors.",
    created_at: daysFromNow(-7)
  },
  {
    id: "00000000-0000-4000-8000-000000000504",
    exercise_id: demoExercise.id,
    inject_number: "004",
    inject_time: "13:00",
    inject_type: "Public Information",
    description: "Conflicting evacuation information appears on social media while shelter capacity numbers are changing.",
    delivered_to: "Joint Information Center",
    expected_action: "Coordinate public messaging, validate shelter status, and synchronize release authority.",
    evaluation_focus: "Public information coordination",
    related_objective: "Assess interagency communication",
    related_task: "Submit operational reports and resource shortfall notifications.",
    created_at: daysFromNow(-7)
  }
];

export const demoFeedbackEntries: FeedbackEntry[] = [
  {
    id: "00000000-0000-4000-8000-000000000601",
    exercise_id: demoExercise.id,
    observer_name: "COL Jordan Hayes",
    organization: "National Guard",
    role: "Senior observer/controller",
    operational_lane: "Mission Assignment",
    time_period: "Initial operational period",
    related_objective: "Evaluate mission assignment execution",
    what_happened: "Mission requests were validated, but several tasks lacked specific reporting requirements and completion criteria.",
    worked_well: "Guard liaison officers quickly clarified available capabilities and helped convert broad requests into executable support tasks.",
    did_not_work: "Mission assignment language did not initially distinguish between reconnaissance, rescue support, and logistics movement.",
    friction: "County requests arrived through multiple channels and created duplicate mission tracking entries.",
    capability_gap: "Mission tracking discipline was inconsistent across EOC sections.",
    resource_shortfall: "High-water vehicle demand exceeded the initial package by two teams.",
    communication_issue: "Radio degradation slowed updates from the north sector.",
    command_control_issue: "Task force reporting cadence was not aligned with the State EOC battle rhythm.",
    interagency_issue: "Public works and emergency management used different priority labels for infrastructure missions.",
    recommended_corrective_action: "Create a mission assignment checklist with required task, purpose, reporting, resource, and closeout fields.",
    priority: "high",
    observation_type: "improve",
    created_at: daysFromNow(-2)
  },
  {
    id: "00000000-0000-4000-8000-000000000602",
    exercise_id: demoExercise.id,
    observer_name: "Avery Stone",
    organization: "State Emergency Management Agency",
    role: "Planning section evaluator",
    operational_lane: "Common Operating Picture",
    time_period: "Midday update",
    related_objective: "Assess interagency communication",
    what_happened: "WebEOC boards were updated, but UAS products and radio outage reports were not displayed in a single operational view.",
    worked_well: "Agency representatives shared updates frequently and used plain language during briefings.",
    did_not_work: "Information products were stored in separate systems without a clear owner for COP integration.",
    friction: "The planning cell spent extra time reconciling map products, shelter status, and road closure data.",
    capability_gap: "COP manager role and product standards were not defined before exercise play.",
    resource_shortfall: "No dedicated GIS support was assigned to the exercise control cell.",
    communication_issue: "Briefing updates were not always pushed to field liaisons.",
    command_control_issue: "No single section owned COP quality control.",
    interagency_issue: "Volunteer organization shelter updates were delayed and entered after state-level briefings.",
    recommended_corrective_action: "Assign a COP manager and publish minimum information requirements for each operational period.",
    priority: "critical",
    observation_type: "improve",
    created_at: daysFromNow(-2)
  },
  {
    id: "00000000-0000-4000-8000-000000000603",
    exercise_id: demoExercise.id,
    observer_name: "Mika Torres",
    organization: "County Fire Services",
    role: "Participant evaluator",
    operational_lane: "Search and Rescue",
    time_period: "Initial rescue missions",
    related_objective: "Validate command and control structure",
    what_happened: "Rescue priorities were established quickly and field teams understood the life safety focus.",
    worked_well: "Fire, EMS, and Guard representatives aligned on high-water rescue priorities without prolonged debate.",
    did_not_work: "The process for requesting UAS support was not clear to local incident commanders.",
    friction: "Local incident commanders were unsure whether to request UAS support through the county EOC or Guard liaison.",
    capability_gap: "UAS request routing and product dissemination need rehearsal.",
    resource_shortfall: "Local SAR teams lacked enough transport for relief crews.",
    communication_issue: "Field teams did not always receive updated staging information.",
    command_control_issue: "UAS approval authority was understood at the State EOC but not at local ICPs.",
    interagency_issue: "Law enforcement airspace concerns were raised late in the request process.",
    recommended_corrective_action: "Publish a UAS request flow with approval authority, privacy review, airspace coordination, and product delivery steps.",
    priority: "medium",
    observation_type: "sustain",
    created_at: daysFromNow(-2)
  }
];

export const demoSyncMatrixEntries: SyncMatrixEntry[] = [
  {
    id: "00000000-0000-4000-8000-000000001001",
    exercise_id: demoExercise.id,
    time_block: "0800-0900",
    external_effect: "Weather changes: heavy rainfall continues; low-water crossings begin to overtop.",
    inject_trigger: "Initial situation update and State EOC activation.",
    organization: "State Emergency Management Agency",
    task: "Activate State EOC, establish battle rhythm, validate county requests, and publish initial incident priorities.",
    purpose: "Create a shared command rhythm and life-safety prioritization framework before resource requests accelerate.",
    boots_on_ground: 34,
    equipment_assets: "State EOC, WebEOC boards, liaison phones, situation display",
    location_lane: "State EOC / Command and Control",
    supported_objective: "Validate command and control structure",
    supported_mission_task: "Establish National Guard liaison presence at the State EOC and affected county EOCs.",
    communications_reporting: "Initial SITREP and EOC battle rhythm briefing by 0845.",
    expected_output: "Initial priorities, EOC staffing posture, and validated request intake process.",
    status: "active",
    notes: "Lead assigned. Risk: county requests arrive through parallel channels.",
    created_at: daysFromNow(-1),
    updated_at: daysFromNow(-1)
  },
  {
    id: "00000000-0000-4000-8000-000000001002",
    exercise_id: demoExercise.id,
    time_block: "0900-1000",
    external_effect: "Civilian population impacts: stranded residents reported near flooded mobile home park.",
    inject_trigger: "Inject 001: 43 residents stranded with limited responder access.",
    organization: "National Guard",
    task: "Deploy high-water vehicle package and liaison team to support county rescue prioritization.",
    purpose: "Increase life-safety capacity while validating mission assignment tasking and reporting requirements.",
    boots_on_ground: 42,
    equipment_assets: "6 high-water vehicles, 2 liaison officers, mission tracker",
    location_lane: "North Fork Township / Search and Rescue",
    supported_objective: "Evaluate mission assignment execution",
    supported_mission_task: "Provide high-water vehicle teams for prioritized rescue and welfare check missions.",
    communications_reporting: "SPOT report for urgent rescues; mission status update every 30 minutes.",
    expected_output: "Tasked rescue support package with owner, location, reporting cadence, and completion criteria.",
    status: "active",
    notes: "Resource surge begins. Monitor whether vehicle demand exceeds available package.",
    created_at: daysFromNow(-1),
    updated_at: daysFromNow(-1)
  },
  {
    id: "00000000-0000-4000-8000-000000001003",
    exercise_id: demoExercise.id,
    time_block: "1000-1100",
    external_effect: "Communications disruption: county radio repeater fails and cellular coverage is unreliable in north sector.",
    inject_trigger: "Inject 002: primary county radio repeater failure.",
    organization: "Emergency communications",
    task: "Activate backup communications plan and coordinate National Guard relay support.",
    purpose: "Maintain operational reporting and field-to-EOC connectivity during communications degradation.",
    boots_on_ground: 18,
    equipment_assets: "Cache radios, satellite kit, mobile repeater, comms status board",
    location_lane: "North Sector / Communications",
    supported_objective: "Assess interagency communication",
    supported_mission_task: "Provide communications relay support where local public safety communications are degraded.",
    communications_reporting: "Comms status update to State EOC Planning and Operations every 30 minutes.",
    expected_output: "Backup channel plan, relay assignment, and field liaison notification loop.",
    status: "gap",
    notes: "Likely friction: field liaisons may not receive staging changes unless push notifications are assigned.",
    created_at: daysFromNow(-1),
    updated_at: daysFromNow(-1)
  },
  {
    id: "00000000-0000-4000-8000-000000001004",
    exercise_id: demoExercise.id,
    time_block: "1100-1200",
    external_effect: "Transportation disruption and UAS / airspace constraints: bridge approach damage restricts public works access.",
    inject_trigger: "Inject 003: public works requests UAS imagery before crews enter damaged area.",
    organization: "Public works",
    task: "Submit UAS reconnaissance request and define imagery requirements for bridge approach assessment.",
    purpose: "Support route clearance decisions while validating UAS request routing and product dissemination.",
    boots_on_ground: 11,
    equipment_assets: "Damage assessment team, route status map, bridge inspection checklist",
    location_lane: "State Route 18 / Infrastructure",
    supported_objective: "Validate command and control structure",
    supported_mission_task: "Conduct UAS reconnaissance of damaged transportation corridors and isolated neighborhoods.",
    communications_reporting: "Request routed through county EOC to State EOC with airspace and privacy review.",
    expected_output: "Validated UAS collection requirement and bridge access recommendation.",
    status: "planned",
    notes: "Possible weak alignment: local ICPs may not understand UAS approval authority.",
    created_at: daysFromNow(-1),
    updated_at: daysFromNow(-1)
  },
  {
    id: "00000000-0000-4000-8000-000000001005",
    exercise_id: demoExercise.id,
    time_block: "1200-1300",
    external_effect: "Resource shortfalls: high-water vehicle demand exceeds initial support package by two teams.",
    inject_trigger: "Resource status update from county EOCs and SAR branch.",
    organization: "County Emergency Management",
    task: "Reprioritize rescue and welfare check requests, identify unmet requirements, and request additional support.",
    purpose: "Prevent over-commitment and align scarce response assets to life-safety priorities.",
    boots_on_ground: 26,
    equipment_assets: "County EOC operations cell, resource tracker, SAR branch coordination board",
    location_lane: "County EOCs / Resource Management",
    supported_objective: "Evaluate resource request process",
    supported_mission_task: "Submit operational reports, mission status updates, and resource shortfall notifications.",
    communications_reporting: "Resource shortfall notification to State EOC by 1230.",
    expected_output: "Updated priority list and additional resource request with operational justification.",
    status: "gap",
    notes: "Resource surge and over-commitment period. Requires senior leader decision on prioritization.",
    created_at: daysFromNow(-1),
    updated_at: daysFromNow(-1)
  },
  {
    id: "00000000-0000-4000-8000-000000001006",
    exercise_id: demoExercise.id,
    time_block: "1300-1400",
    external_effect: "Media / public information pressure: conflicting evacuation and shelter information circulates online.",
    inject_trigger: "Inject 004: social media reports conflict with shelter capacity numbers.",
    organization: "Joint Information Center",
    task: "Coordinate public messaging, validate shelter status, and synchronize release authority.",
    purpose: "Reduce public confusion and ensure senior leaders communicate consistent protective action guidance.",
    boots_on_ground: 9,
    equipment_assets: "PIO team, social media monitoring dashboard, approved message templates",
    location_lane: "Joint Information Center / Public Information",
    supported_objective: "Assess interagency communication",
    supported_mission_task: "Submit operational reports, mission status updates, and resource shortfall notifications through the agreed reporting cycle.",
    communications_reporting: "Public information update approved by 1345 and pushed to county PIOs.",
    expected_output: "Unified public message and corrected shelter capacity information.",
    status: "planned",
    notes: "Potential friction: release authority and shelter numbers may not align before the briefing.",
    created_at: daysFromNow(-1),
    updated_at: daysFromNow(-1)
  },
  {
    id: "00000000-0000-4000-8000-000000001007",
    exercise_id: demoExercise.id,
    time_block: "1400-1500",
    external_effect: "Political / senior leader attention: Governor's staff requests a decision brief and resource posture.",
    inject_trigger: "Senior leader information request.",
    organization: "State Emergency Management Agency",
    task: "Prepare decision brief with mission status, unmet needs, COP gaps, and recommended resource priorities.",
    purpose: "Support senior leader decision-making and identify corrective actions before the final operational period.",
    boots_on_ground: 16,
    equipment_assets: "Decision brief template, COP products, mission tracker, resource status report",
    location_lane: "State EOC / Senior Leader Brief",
    supported_objective: "Assess operational reporting",
    supported_mission_task: "Submit operational reports, mission status updates, and resource shortfall notifications through the agreed reporting cycle.",
    communications_reporting: "Senior leader decision brief at 1445.",
    expected_output: "Decision-quality resource posture and prioritized unresolved issues.",
    status: "planned",
    notes: "Highlight unassigned COP quality-control owner.",
    created_at: daysFromNow(-1),
    updated_at: daysFromNow(-1)
  },
  {
    id: "00000000-0000-4000-8000-000000001008",
    exercise_id: demoExercise.id,
    time_block: "1500-1600",
    external_effect: "Safety incident: responder fatigue and contaminated floodwater exposure are reported during late operational period.",
    inject_trigger: "Safety officer update and end-of-day transition planning.",
    organization: "EMS",
    task: "Coordinate responder health monitoring, medical support, and safety messaging for sustained operations.",
    purpose: "Reduce responder risk and ensure safety considerations are integrated into ongoing mission assignment execution.",
    boots_on_ground: 14,
    equipment_assets: "EMS units, responder rehab kit, PPE cache, safety briefing checklist",
    location_lane: "Staging Area / Safety and Sustainment",
    supported_objective: "Identify capability gaps",
    supported_mission_task: "Support logistics movement of water, generators, sandbags, and shelter commodities.",
    communications_reporting: "Safety update included in final operational period SITREP.",
    expected_output: "Responder safety actions and sustainment shortfalls captured for AAR.",
    status: "complete",
    notes: "Good task/purpose alignment; track fatigue mitigation as sustainment issue.",
    created_at: daysFromNow(-1),
    updated_at: daysFromNow(-1)
  }
];

export const demoAnalysis: AiAnalysis = {
  id: "00000000-0000-4000-8000-000000000701",
  exercise_id: demoExercise.id,
  themes: [
    "Mission assignment quality improved when liaisons translated broad requests into taskable support.",
    "A single common operating picture owner was missing across EOC sections.",
    "Communications degradation exposed uneven backup procedures and field update loops."
  ],
  sustains: [
    "Senior leaders kept life safety as the organizing priority.",
    "Agency representatives used plain language and shared updates frequently.",
    "Guard liaison presence helped clarify available capabilities."
  ],
  improves: [
    "Standardize mission assignment fields and approval workflow.",
    "Define common operating picture ownership and product standards.",
    "Rehearse UAS request routing, privacy review, and airspace coordination."
  ],
  gaps: [
    "Mission tracking discipline varied across agencies.",
    "No dedicated GIS/COP manager was assigned.",
    "Backup communications did not consistently reach field liaisons.",
    "Resource shortfalls for high-water rescue were identified after tasking began."
  ],
  recommendations: [
    "Create a mission assignment checklist and use it for all support requests.",
    "Assign COP manager and GIS support to the planning cell.",
    "Publish a UAS support request flow for local ICPs and county EOCs.",
    "Align State EOC and task force reporting cycles before operations begin."
  ],
  poam_recommendations: [
    "LS-001: Implement mission assignment checklist.",
    "LS-002: Develop COP manager role description and minimum information requirements.",
    "LS-003: Build and exercise UAS request routing SOP.",
    "LS-004: Update backup communications and field liaison notification procedures."
  ],
  created_at: daysFromNow(-1)
};

export const demoExsum: Exsum = {
  id: "00000000-0000-4000-8000-000000000801",
  exercise_id: demoExercise.id,
  title: "AFTERBURN Executive Summary",
  content: `# AFTERBURN Executive Summary

## 1. Executive Overview
Exercise LIGHTNING STRIKE assessed the ability of state, local, National Guard, public safety, public works, emergency communications, and voluntary agency partners to coordinate a multi-hazard domestic operations response. The exercise created a credible environment involving severe storms, infrastructure disruption, search and rescue requirements, UAS support, degraded communications, and interagency coordination challenges.

The exercise demonstrated strong commitment to life safety, effective liaison participation, and constructive senior-leader engagement. It also revealed capability gaps in mission assignment standardization, common operating picture ownership, backup communications, UAS request routing, and resource status reporting.

## 2. Exercise Purpose
The purpose of the exercise was to validate mission assignment development, interagency coordination, operational reporting, and feedback collection processes in a complex incident environment.

## 3. Scenario Summary
The scenario centered on a severe storm system affecting the Central River Valley. Flooding, damaged infrastructure, intermittent communications, isolated populations, and competing county priorities required planners to develop a clear mission assignment and synchronize support across agencies.

## 4. Mission Assignment Overview
Mission Assignment MA-LS-001 directed National Guard support to civil authorities through high-water rescue, logistics movement, UAS reconnaissance, communications relay, and liaison support.

## 5. Participating Organizations
Participating organizations included the State Emergency Management Agency, National Guard, local law enforcement, fire services, EMS, public works, emergency communications, and volunteer organizations.

## 6. Operational Objectives
Objectives focused on command and control, interagency communication, resource request processes, common operating picture development, operational reporting, capability gap identification, and mission assignment execution.

## 7. Major Events and Exercise Flow
Exercise play moved from initial incident assessment to mission request validation, communications degradation, UAS support coordination, public messaging friction, and improvement plan development.

## 8. Key Sustains
- Leaders preserved life safety as the primary decision lens.
- Liaison officers helped translate civil authority needs into executable support tasks.
- Agencies used plain language during coordination briefings.

## 9. Key Improves
- Mission assignment fields need to be standardized.
- COP ownership and product standards should be assigned before activation.
- UAS request routing needs clearer approval, privacy, and airspace coordination steps.

## 10. Major Capability Gaps
The most significant gaps involved mission tracking discipline, GIS/COP integration, backup communications to field liaisons, and high-water rescue resource forecasting.

## 11. Command and Control / ICS Findings
Command relationships were generally understood, but reporting cadence and COP quality control ownership were not aligned across the EOC, county representatives, and task force elements.

## 12. Communications Findings
Radio degradation and uneven backup communications procedures slowed operational updates from the field. Field liaisons did not always receive updated staging and priority information.

## 13. Interagency Coordination Findings
Public works, emergency management, and volunteer organizations used different priority labels and update cycles, creating friction in the common operating picture.

## 14. Resource and Sustainment Findings
High-water vehicle demand exceeded the initial support package. Sustainment requirements for extended operations require earlier forecasting.

## 15. Mission Assignment Execution Assessment
The mission assignment was operationally useful, but it needs clearer required fields, task ownership, reporting requirements, and closeout criteria.

## 16. Time-Phased Execution and Synchronization Matrix Assessment
The hour-by-hour sync matrix showed strong initial alignment around life safety, mission validation, and senior leader reporting. Personnel and asset surges occurred between 0900 and 1300 as high-water rescue demand, communications degradation, UAS reconnaissance, and resource shortfalls overlapped. External effects changed operational requirements most sharply during the 1000-1300 window, when communications failure and unmet high-water vehicle demand increased coordination friction.

Task and purpose alignment was strongest for National Guard rescue support and State EOC senior leader brief preparation. Alignment was weaker for UAS request routing and common operating picture quality control because approval authority, product ownership, and field dissemination responsibilities were not fully assigned. Boots-on-ground estimates generally matched mission requirements in early periods, but the 1200-1300 resource surge indicated over-commitment risk and a need for earlier force package forecasting.

Recommended improvements include assigning a sync matrix owner in the planning section, using the matrix during each operational period briefing, linking every time block to a lead organization, and flagging unassigned mission tasks before exercise play begins.

## 17. Observer Feedback Summary
Observers identified repeated friction around mission tracking, COP integration, and communications degradation.

## 18. Participant Feedback Summary
Participants valued the interagency coordination environment and recommended clearer UAS request flow, more realistic communications constraints, and earlier resource forecasting.

## 19. Category / Functional Area AAR Breakouts
Mission assignment execution, operational communications, common operating picture development, UAS request routing, and resource/sustainment forecasting should each receive a focused lane-level review. Each category should identify what worked, what created friction, which objective was affected, and which corrective actions require owner assignment.

## 20. Entity / Echelon AAR Breakouts
State Emergency Management should review mission validation, battle rhythm, and COP ownership. The National Guard task force should review force package sizing, liaison reporting, and high-water rescue support. Emergency communications should review backup communications procedures. Public works and local response agencies should review how infrastructure impacts, route status, and field priorities are reported into the common operating picture.

## 21. Priority Corrective Actions
Priority actions include implementing a mission assignment checklist, assigning a COP manager, publishing UAS request flow, and aligning reporting cycles.

## 22. POA&M / Improvement Plan
The improvement plan should assign responsible offices, due dates, and measures of success for each corrective action.

## 23. Recommended Next Steps
Conduct a focused mission assignment workshop, update SOPs, and run a follow-on communications and COP drill within 90 days.

## 24. Conclusion
Exercise LIGHTNING STRIKE provided credible insight into domestic operations readiness and produced actionable improvements for future multi-agency response operations.`,
  created_at: daysFromNow(-1),
  updated_at: daysFromNow(-1)
};

export const demoPoamItems: PoamItem[] = [
  {
    id: "00000000-0000-4000-8000-000000000901",
    exercise_id: demoExercise.id,
    finding_id: "LS-001",
    finding: "Mission assignment language lacked consistent reporting and closeout criteria.",
    corrective_action: "Develop and adopt a mission assignment checklist for domestic operations support requests.",
    responsible_office: "State EOC Operations Section",
    supporting_agencies: ["National Guard Joint Task Force", "County Emergency Management"],
    priority: "high",
    due_date: daysFromNow(45),
    status: "in_progress",
    measure_of_success: "All exercise mission assignments include task, purpose, scope, resources, reporting, and closeout fields.",
    required_resources: "Planning cell review time and approved mission assignment template.",
    next_update_date: daysFromNow(14),
    escalation_flag: false,
    completion_evidence: "Signed checklist and sample mission assignment package.",
    notes: "Draft checklist under review by planning cell.",
    created_at: daysFromNow(-1),
    updated_at: daysFromNow(-1)
  },
  {
    id: "00000000-0000-4000-8000-000000000902",
    exercise_id: demoExercise.id,
    finding_id: "LS-002",
    finding: "No single owner was assigned for COP quality control.",
    corrective_action: "Assign COP manager role and define minimum information requirements for each operational period.",
    responsible_office: "State EOC Planning Section",
    supporting_agencies: ["GIS Unit", "County EOCs", "Public works"],
    priority: "critical",
    due_date: daysFromNow(30),
    status: "not_started",
    measure_of_success: "COP manager identified in incident organization chart and COP products updated before each briefing.",
    required_resources: "GIS staffing decision and COP product owner assignment.",
    next_update_date: daysFromNow(7),
    escalation_flag: true,
    completion_evidence: "Updated incident organization chart and COP battle rhythm.",
    notes: "Requires GIS staffing decision.",
    created_at: daysFromNow(-1),
    updated_at: daysFromNow(-1)
  },
  {
    id: "00000000-0000-4000-8000-000000000903",
    exercise_id: demoExercise.id,
    finding_id: "LS-003",
    finding: "UAS request routing was unclear to local incident commanders.",
    corrective_action: "Publish a UAS request SOP covering approval authority, privacy review, airspace coordination, and product dissemination.",
    responsible_office: "Air Operations Coordinator",
    supporting_agencies: ["Law enforcement", "National Guard UAS team", "State legal counsel"],
    priority: "medium",
    due_date: daysFromNow(60),
    status: "in_progress",
    measure_of_success: "Local ICPs can submit UAS requests through a single validated process during the next exercise.",
    required_resources: "Air operations, legal, law enforcement, and Guard UAS coordination workshop.",
    next_update_date: daysFromNow(21),
    escalation_flag: false,
    completion_evidence: "Published UAS request SOP and rehearsal record.",
    notes: "Use stadium UAS drill lessons as input.",
    created_at: daysFromNow(-1),
    updated_at: daysFromNow(-1)
  }
];

export const demoReadinessScore: ExerciseReadinessScore = {
  id: "00000000-0000-4000-8000-000000001101",
  exercise_id: demoExercise.id,
  score: 82,
  label: "Ready with Friction",
  summary:
    "AFTERBURN has sufficient detail to support event execution, but the communications plan, observer assignments, and entity-specific task/purpose statements need refinement before final rehearsal.",
  strengths: [
    "Scenario, mission assignment, objectives, and sync matrix are coherent and mutually reinforcing.",
    "Major participating entities are identified and tied to realistic time-phased tasks.",
    "EXSUM and POA&M structure already support leader-level findings."
  ],
  friction_points: [
    "Backup communications procedures are not fully assigned to field liaisons.",
    "Observer coverage is uneven across COP, UAS, and resource management lanes.",
    "Several decision points need explicit authority and time-sensitive windows."
  ],
  missing_inputs: [
    "Detailed communications plan annex",
    "Evaluator assignments by lane and time block",
    "Hotwash collection plan by entity",
    "Decision authority matrix"
  ],
  recommendations: [
    "Assign evaluator coverage for every objective before final rehearsal.",
    "Use the sync matrix to brief task, purpose, personnel, assets, location, and reporting by entity.",
    "Red-team the exercise before execution to identify blind spots and unrealistic assumptions."
  ],
  created_at: daysFromNow(-1),
  updated_at: daysFromNow(-1)
};

export const demoEvaluatorAssignments: EvaluatorAssignment[] = [
  {
    id: "00000000-0000-4000-8000-000000001201",
    exercise_id: demoExercise.id,
    evaluator_name: "COL Jordan Hayes",
    assigned_lane: "Mission Assignment",
    assigned_entity: "National Guard Joint Task Force",
    time_block: "0900-1300",
    location: "State EOC / County EOC bridge",
    objective_focus: "Evaluate mission assignment execution",
    observation_focus: "Task clarity, reporting cadence, resource status, and closeout criteria.",
    collection_method: "Structured observer notes and controller hotwash prompts",
    notes: "Primary focus is whether high-water rescue and UAS taskings are translated into executable support packages.",
    created_at: daysFromNow(-2),
    updated_at: daysFromNow(-1)
  },
  {
    id: "00000000-0000-4000-8000-000000001202",
    exercise_id: demoExercise.id,
    evaluator_name: "Avery Stone",
    assigned_lane: "Common Operating Picture",
    assigned_entity: "State EOC Planning Section",
    time_block: "1000-1500",
    location: "Planning cell / situation display",
    objective_focus: "Assess interagency communication",
    observation_focus: "COP ownership, update flow, map product integration, and field liaison dissemination.",
    collection_method: "COP product review, sync matrix notes, and end-of-phase interview",
    notes: "Flag any data source that does not have an assigned owner or update rhythm.",
    created_at: daysFromNow(-2),
    updated_at: daysFromNow(-1)
  },
  {
    id: "00000000-0000-4000-8000-000000001203",
    exercise_id: demoExercise.id,
    evaluator_name: "Mika Torres",
    assigned_lane: "Search and Rescue",
    assigned_entity: "County Fire / EMS",
    time_block: "0900-1200",
    location: "North Fork Township lane",
    objective_focus: "Validate command and control structure",
    observation_focus: "Life-safety prioritization, UAS request routing, and staging updates.",
    collection_method: "Lane evaluator form and participant hotwash",
    notes: "Capture whether local ICPs understand UAS approval authority and product delivery path.",
    created_at: daysFromNow(-2),
    updated_at: daysFromNow(-1)
  }
];

export const demoDecisionPoints: DecisionPoint[] = [
  {
    id: "00000000-0000-4000-8000-000000001301",
    exercise_id: demoExercise.id,
    decision_required: "Prioritize high-water rescue support when requests exceed the initial vehicle package.",
    decision_authority: "State EOC Operations Chief with County EOC concurrence",
    time_window: "1200-1230",
    information_available: "County rescue request list, vehicle availability, SAR branch risk assessment, and mission tracker status.",
    options_considered: ["Prioritize life-safety calls only", "Request additional Guard package", "Delay welfare checks until comms relay is established"],
    actual_decision: "Prioritize life-safety calls and submit an additional support request for two high-water teams.",
    outcome: "Resource shortfall was identified and elevated, but the request needed clearer operational justification.",
    aar_relevance: "Shows whether leaders can make resource prioritization decisions under scarcity.",
    status: "decided",
    priority: "high",
    created_at: daysFromNow(-1),
    updated_at: daysFromNow(-1)
  },
  {
    id: "00000000-0000-4000-8000-000000001302",
    exercise_id: demoExercise.id,
    decision_required: "Approve UAS reconnaissance near damaged bridge approach with law enforcement airspace concerns.",
    decision_authority: "Air Operations Coordinator with legal and law enforcement input",
    time_window: "1115-1145",
    information_available: "Public works imagery request, privacy constraints, airspace status, and bridge access risk.",
    options_considered: ["Approve UAS collection", "Delay until law enforcement deconfliction", "Use ground assessment only"],
    actual_decision: "Approve UAS collection after deconfliction and privacy review.",
    outcome: "Decision was sound, but local ICPs were unclear on the routing process.",
    aar_relevance: "Highlights legal/authority friction and UAS support process maturity.",
    status: "decided",
    priority: "medium",
    created_at: daysFromNow(-1),
    updated_at: daysFromNow(-1)
  },
  {
    id: "00000000-0000-4000-8000-000000001303",
    exercise_id: demoExercise.id,
    decision_required: "Select the authoritative public message when shelter capacity and evacuation information conflict.",
    decision_authority: "Joint Information Center lead with State EOC Director approval",
    time_window: "1300-1345",
    information_available: "County shelter status, social media monitoring, evacuation advisory language, and volunteer organization update.",
    options_considered: ["Hold message until all data reconciled", "Release state-level correction", "Push county-specific updates only"],
    actual_decision: "Release a corrected state-level message and push county-specific shelter updates.",
    outcome: "Message was approved, but validation took longer than desired.",
    aar_relevance: "Useful for assessing public information coordination and release authority.",
    status: "pending",
    priority: "high",
    created_at: daysFromNow(-1),
    updated_at: daysFromNow(-1)
  }
];

export const demoCapabilityGaps: CapabilityGap[] = [
  {
    id: "00000000-0000-4000-8000-000000001401",
    exercise_id: demoExercise.id,
    gap: "Communications interoperability degraded field-to-EOC coordination.",
    capability_area: "Operational Communications",
    warfighting_function: "Command and Control",
    civilian_category: "Communications",
    recurrence_count: 4,
    affected_entities: ["Emergency communications", "County Fire Services", "National Guard"],
    recommendation: "Update backup communications plan and assign field liaison notification responsibilities.",
    best_practice: "Publish a primary, alternate, contingency, and emergency communications card for each lane before start exercise.",
    status: "in_progress",
    created_at: daysFromNow(-1),
    updated_at: daysFromNow(-1)
  },
  {
    id: "00000000-0000-4000-8000-000000001402",
    exercise_id: demoExercise.id,
    gap: "Common operating picture ownership was not assigned before play.",
    capability_area: "Situational Assessment",
    warfighting_function: "Intelligence",
    civilian_category: "Situational Awareness / Intelligence",
    recurrence_count: 3,
    affected_entities: ["State EOC Planning Section", "GIS Unit", "County EOCs"],
    recommendation: "Designate a COP manager and define minimum information requirements for each operational period.",
    best_practice: "Use a COP checklist that names the owner, update cycle, source system, and release authority for each product.",
    status: "not_started",
    created_at: daysFromNow(-1),
    updated_at: daysFromNow(-1)
  },
  {
    id: "00000000-0000-4000-8000-000000001403",
    exercise_id: demoExercise.id,
    gap: "UAS request routing and legal review are not understood at local ICP level.",
    capability_area: "Operational Coordination",
    warfighting_function: "Protection",
    civilian_category: "Legal / Policy",
    recurrence_count: 2,
    affected_entities: ["Public works", "Law enforcement", "National Guard UAS team"],
    recommendation: "Publish and rehearse a UAS request flow covering approval, privacy, airspace, and product dissemination.",
    best_practice: "Include a UAS request card in the participant portal for local incident commanders.",
    status: "in_progress",
    created_at: daysFromNow(-1),
    updated_at: daysFromNow(-1)
  }
];

export const demoTrendInsights: TrendInsight[] = [
  {
    id: "00000000-0000-4000-8000-000000001501",
    exercise_id: demoExercise.id,
    title: "Communications issues recur across severe weather and UAS exercises",
    category: "Repeated friction",
    signal: "4 of 6 recent high-priority observations reference backup communications or field update loops.",
    metric: "67% recurrence",
    detail: "Communications degradation appears during both field execution and EOC reporting, especially when staging locations change.",
    recommended_action: "Create an organization-wide communications exercise series focused on lane-level reporting and backup notification paths.",
    created_at: daysFromNow(-1)
  },
  {
    id: "00000000-0000-4000-8000-000000001502",
    exercise_id: demoExercise.id,
    title: "Resource surges cluster between 0900 and 1300",
    category: "Time block friction",
    signal: "Sync matrix boots-on-ground totals and resource shortfalls peak during the first half of event play.",
    metric: "101 personnel committed by 1300",
    detail: "The rescue, communications, and UAS lanes overlap before sustainment and reporting rhythms stabilize.",
    recommended_action: "Use the readiness score to flag over-commitment periods before final rehearsal.",
    created_at: daysFromNow(-1)
  },
  {
    id: "00000000-0000-4000-8000-000000001503",
    exercise_id: demoExercise.id,
    title: "Mission assignment language drives downstream AAR quality",
    category: "Planning quality",
    signal: "Findings with clear task, purpose, owner, and reporting evidence produced stronger corrective actions.",
    metric: "3 priority POA&M items tied to mission assignment structure",
    detail: "When mission tasks include reporting and closeout fields, evaluators can connect observations to defensible findings.",
    recommended_action: "Make the mission assignment checklist a required pre-execution gate.",
    created_at: daysFromNow(-1)
  }
];

export const demoEvidenceItems: EvidenceItem[] = [
  {
    id: "00000000-0000-4000-8000-000000001601",
    exercise_id: demoExercise.id,
    finding_id: "LS-001",
    evidence_type: "observer_note",
    source_label: "Observer note #14",
    linked_record: "COL Jordan Hayes / Mission Assignment lane",
    summary: "Several tasks lacked specific reporting requirements and completion criteria.",
    relevance: "Directly supports the mission assignment checklist corrective action.",
    created_at: daysFromNow(-1)
  },
  {
    id: "00000000-0000-4000-8000-000000001602",
    exercise_id: demoExercise.id,
    finding_id: "LS-002",
    evidence_type: "sync_matrix",
    source_label: "Sync matrix 1000-1100",
    linked_record: "Emergency communications gap row",
    summary: "Backup communications plan did not consistently push updates to field liaisons.",
    relevance: "Shows time-phased friction and operational impact.",
    created_at: daysFromNow(-1)
  },
  {
    id: "00000000-0000-4000-8000-000000001603",
    exercise_id: demoExercise.id,
    finding_id: "LS-003",
    evidence_type: "decision_point",
    source_label: "Decision point 1115-1145",
    linked_record: "UAS reconnaissance approval",
    summary: "UAS approval was sound at the State EOC, but local ICPs were unclear on routing and authority.",
    relevance: "Connects legal/authority friction to a concrete command decision.",
    created_at: daysFromNow(-1)
  }
];

export const demoDropoffSubmissions: DropoffSubmission[] = [
  {
    id: "00000000-0000-4000-8000-000000001701",
    title: "Backup communications update loop needs review",
    category: "Operational Friction",
    body: "Field liaisons reported that backup communications updates were delayed during the 1000-1100 time block. This may affect how quickly staging area changes are pushed to responders.",
    recommended_action: "Create a written backup communications update rhythm and assign one owner to confirm field receipt.",
    exercise_id: demoExercise.id,
    exercise_event: demoExercise.name,
    module_context: "Sync Matrix",
    phase: "Execution",
    entity: "Emergency communications",
    functional_area: "Communications",
    tags: ["communications", "field updates", "sync matrix"],
    urgency: "High",
    visibility_recommendation: "Exercise Team",
    submitted_by: "demo-user",
    submitted_at: daysFromNow(-1),
    status: "Needs Human Review",
    ai_screening_status: "Needs Human Review",
    ai_risk_level: "Medium",
    ai_confidence: 0.84,
    created_at: daysFromNow(-1),
    updated_at: daysFromNow(-1)
  },
  {
    id: "00000000-0000-4000-8000-000000001702",
    title: "Public works damage assessment process worked well",
    category: "Best Practice",
    body: "Public works used a simple status board to separate confirmed damage from unverified reports. The approach helped the EOC prioritize resource requests without waiting for perfect information.",
    recommended_action: "Capture the status board format as a reusable template for future severe weather exercises.",
    exercise_id: demoExercise.id,
    exercise_event: demoExercise.name,
    module_context: "AAR",
    phase: "AAR",
    entity: "Public works",
    functional_area: "Operations",
    tags: ["public works", "damage assessment", "best practice"],
    urgency: "Medium",
    visibility_recommendation: "Interagency Library Candidate",
    submitted_by: "demo-user",
    submitted_at: daysFromNow(-2),
    status: "Cleared for Review",
    ai_screening_status: "Cleared for Review",
    ai_risk_level: "Low",
    ai_confidence: 0.78,
    created_at: daysFromNow(-2),
    updated_at: daysFromNow(-2)
  },
  {
    id: "00000000-0000-4000-8000-000000001703",
    title: "Review sensitive facility detail before sharing",
    category: "Capability Gap",
    body: "The observation references a specific facility vulnerability and should be sanitized before any interagency library use.",
    recommended_action: "Remove specific vulnerability language and convert the item into a general facility security planning consideration.",
    exercise_id: demoExercise.id,
    exercise_event: demoExercise.name,
    module_context: "Doctrine / Library",
    phase: "Doctrine / Library",
    entity: "Exercise staff",
    functional_area: "Safety",
    tags: ["facility security", "sensitive review"],
    urgency: "Critical",
    visibility_recommendation: "Internal Review Only",
    submitted_by: "demo-user",
    submitted_at: daysFromNow(-3),
    status: "Sanitization Required",
    ai_screening_status: "Sanitization Required",
    ai_risk_level: "High",
    ai_confidence: 0.91,
    created_at: daysFromNow(-3),
    updated_at: daysFromNow(-3)
  }
];

export const demoDropoffScreeningReports: DropoffScreeningReport[] = [
  {
    id: "00000000-0000-4000-8000-000000001801",
    submission_id: demoDropoffSubmissions[0].id,
    risk_level: "Medium",
    sensitivity_categories: ["OPSEC-sensitive operational detail"],
    flagged_terms: ["staging area"],
    flagged_sections: ["This may affect how quickly staging area changes are pushed to responders."],
    recommended_handling: "Review for operational sensitivity, remove unnecessary location details, and approve for exercise-team distribution only if needed.",
    suggested_sanitized_text: "Field liaisons reported that backup communications updates were delayed during the 1000-1100 time block. This may affect how quickly operational changes are pushed to responders.",
    suggested_repository_category: "Recommended Improvement",
    suggested_tags: ["communications", "field updates", "sync matrix"],
    confidence_score: 0.84,
    model_used: "deterministic-local-screening",
    reviewer_notes: "",
    review_required_boolean: true,
    created_at: daysFromNow(-1)
  },
  {
    id: "00000000-0000-4000-8000-000000001802",
    submission_id: demoDropoffSubmissions[1].id,
    risk_level: "Low",
    sensitivity_categories: [],
    flagged_terms: [],
    flagged_sections: [],
    recommended_handling: "Route to normal human review before repository conversion.",
    suggested_sanitized_text: demoDropoffSubmissions[1].body,
    suggested_repository_category: "Best Practice",
    suggested_tags: ["public works", "damage assessment", "best practice"],
    confidence_score: 0.78,
    model_used: "deterministic-local-screening",
    reviewer_notes: "",
    review_required_boolean: false,
    created_at: daysFromNow(-2)
  },
  {
    id: "00000000-0000-4000-8000-000000001803",
    submission_id: demoDropoffSubmissions[2].id,
    risk_level: "High",
    sensitivity_categories: ["Critical infrastructure vulnerability or exact weak point"],
    flagged_terms: ["specific facility vulnerability"],
    flagged_sections: ["The observation references a specific facility vulnerability and should be sanitized before any interagency library use."],
    recommended_handling: "Keep internal until a reviewer removes exploitable details and approves the sanitized version.",
    suggested_sanitized_text: "The observation references a facility security planning concern and should be sanitized before any interagency library use.",
    suggested_repository_category: "Planning Consideration",
    suggested_tags: ["facility security", "sensitive review"],
    confidence_score: 0.91,
    model_used: "deterministic-local-screening",
    reviewer_notes: "",
    review_required_boolean: true,
    created_at: daysFromNow(-3)
  }
];

export const demoLessonsRepositoryItems: LessonsRepositoryItem[] = [
  {
    id: "00000000-0000-4000-8000-000000001901",
    source_submission_id: demoDropoffSubmissions[1].id,
    exercise_id: demoExercise.id,
    title: "Use a simple status board for damage assessment triage",
    item_type: "Best Practice",
    summary: "Public works separated confirmed damage from unverified reports, helping the EOC prioritize resources without waiting for perfect information.",
    approved_content: demoDropoffSubmissions[1].body,
    functional_area: "Operations",
    phase: "AAR",
    entity: "Public works",
    tags: ["public works", "damage assessment", "best practice"],
    recommended_action: demoDropoffSubmissions[1].recommended_action,
    owner: "Exercise staff",
    status: "Under Review",
    export_eligibility: "Interagency Shareable",
    approved_by: "demo-reviewer",
    approved_at: daysFromNow(-1),
    created_at: daysFromNow(-1),
    updated_at: daysFromNow(-1)
  }
];

export const demoAfterburnData = {
  exercises: demoExercises,
  exercise: demoExercise,
  scenario: demoScenario,
  missionAssignment: demoMissionAssignment,
  objectives: demoObjectives,
  injects: demoInjects,
  syncMatrixEntries: demoSyncMatrixEntries,
  feedbackEntries: demoFeedbackEntries,
  analysis: demoAnalysis,
  exsum: demoExsum,
  poamItems: demoPoamItems,
  readinessScore: demoReadinessScore,
  evaluatorAssignments: demoEvaluatorAssignments,
  decisionPoints: demoDecisionPoints,
  capabilityGaps: demoCapabilityGaps,
  trendInsights: demoTrendInsights,
  evidenceItems: demoEvidenceItems,
  dropoffSubmissions: demoDropoffSubmissions,
  dropoffScreeningReports: demoDropoffScreeningReports,
  lessonsRepositoryItems: demoLessonsRepositoryItems
};
