# AFTERBURN Product Roadmap

Saved: 2026-05-13

This roadmap captures the next major product concepts for AFTERBURN beyond the current MVP. The product direction is to move from a single-event planning and AAR tool into a secure, role-based exercise lifecycle intelligence platform.

## Product Thesis

AFTERBURN should help planners move from concept, planning, execution, assessment, and corrective action into long-term organizational readiness improvement.

The core differentiator should be:

> AFTERBURN does not just write AARs. It identifies recurring organizational risk, improves exercise design before execution, and turns observations into defensible improvement action.

## Near-Term High-Value Additions

### 1. Exercise Readiness Score

Add an AI-generated Exercise Readiness Score before execution.

The score should evaluate whether the planner has provided enough detail across:

- Scenario clarity
- Objectives
- Participating entities
- Mission assignments
- Sync matrix completeness
- Communications plan
- Safety and risk controls
- Observer coverage
- Hotwash / AAR collection plan
- Graphic / map data
- Decision points

Example output:

```text
Readiness Score: 82% - Ready with Friction

AFTERBURN has sufficient detail to support event execution, but the communications plan,
observer assignments, and entity-specific task/purpose statements need refinement before
final rehearsal.
```

This should appear on the dashboard, overview page, and briefing mode.

### 2. Controller / Evaluator Assignment Manager

Add a planner-facing section for Observer / Controller / Evaluator coverage.

Suggested fields:

- Evaluator name
- Assigned lane
- Assigned entity
- Time block
- Location
- Objective being evaluated
- Required observation focus
- Collection method
- Notes

Purpose:

- Ensure every major objective has evaluator coverage.
- Prevent weak AARs caused by poor observation coverage.
- Feed the readiness score and AAR evidence binder.

### 3. Inject Builder / Master Scenario Events List

Expand the Inject Builder into a professional MSEL page.

Common inject types:

- Weather change
- Communications failure
- Media inquiry
- Civilian casualty
- Resource shortage
- UAS detection
- Law enforcement request
- Leadership decision point
- Conflicting information
- Public affairs issue
- Legal / authority question

Suggested fields:

- Inject time
- Delivery method
- Target entity
- Expected action
- Training objective supported
- Controller notes
- Evaluation criteria

This should remain part of the Event phase and support White Cell Assistant.

### 4. Decision Point Tracker

Create a dedicated Decision Point Tracker.

Suggested fields:

- Decision required
- Decision authority
- Time-sensitive window
- Information available
- Options considered
- Actual decision made
- Outcome
- AAR relevance

Purpose:

- Improve command-post exercise evaluation.
- Capture leadership friction.
- Strengthen executive summaries with evidence-based decision analysis.

### 5. Capability Gap Library

Build a reusable Capability Gap Library across exercises.

Recurring gaps may include:

- Communications interoperability
- Airspace coordination
- UAS policy limitations
- Common operating picture adoption
- Sustainment gaps
- Lack of trained operators
- Legal authority confusion
- Insufficient observer coverage
- Incomplete mission assignment language

Purpose:

- Make AFTERBURN a strategic planning database.
- Show recurring organizational risk across exercises.
- Support future subscription value and enterprise reporting.

### 6. Trends / Insights Page

Add a future-facing analytics page called `Insights` or `Trends`.

It should show:

- Most common AAR categories
- Repeated frictions by entity
- Repeated gaps by capability
- Improvement items still open
- Objectives most often underperformed
- Time blocks where friction clusters
- Entities that frequently need more coordination
- Gaps that persist across multiple exercises

This feature turns AFTERBURN into a long-term readiness improvement tool.

### 7. Red Team This Exercise

Add an AI button:

```text
Red Team This Exercise
```

The AI review should analyze the scenario, objectives, sync matrix, injects, and mission assignments to identify:

- Unrealistic assumptions
- Missing entities
- Weak injects
- Underdeveloped decision points
- Safety gaps
- Communications vulnerabilities
- Legal / authority issues
- Evaluation blind spots
- Places where the exercise may not test the stated objectives

This should be treated as a flagship intelligence feature.

### 8. White Cell Assistant

Create an event-control mode for exercise controllers.

The White Cell Assistant should suggest:

- Next inject
- Delayed inject adjustment
- Friction capture prompts
- Decision point reminders
- Observer prompts
- Hotwash questions
- End-of-phase summary notes

This should support live execution when planners are busy and conditions are moving quickly.

### 9. Participant Portal

Add a lightweight participant-facing portal separate from the planner/admin side.

Participants should only see:

- Exercise overview
- Their assigned entity tasks
- Relevant sync matrix rows
- Rehearsal script excerpts
- Feedback forms
- Hotwash prompts
- Final EXSUM / AAR products released to them

Purpose:

- Improve role-based access.
- Keep sensitive planner/admin data separated.
- Support multi-organization exercise participation.

### 10. AAR Evidence Binder

Each final AAR finding should link back to supporting evidence.

Example finding:

```text
Communications interoperability degraded coordination between field teams and the command post.
```

Linked evidence could include:

- Observer note
- Hotwash comment
- Sync matrix delay
- Decision point log
- Screenshot / photo reference
- Radio / comms note

Purpose:

- Make AAR findings defensible.
- Support senior leader review.
- Reduce the risk of unsupported conclusions.

### 11. Improvement Plan Owner Notifications

Every POA&M item should be designed around ownership and follow-up rhythm.

Suggested fields:

- Responsible owner
- Due date
- Status
- Required resources
- Next update date
- Escalation flag
- Completion evidence

For MVP, build the data structure and UI around ownership. Later, add notifications and reminders.

### 12. Briefing Mode

Create a presentation-style leadership view.

Pre-event briefing mode should show:

- Scenario overview
- Map / graphic depiction
- Key objectives
- Major participating entities
- Current readiness score
- Major risks
- Event timeline
- Expected outputs

Post-event briefing mode should show:

- Key outcomes
- Top five sustains
- Top five improves
- Major capability gaps
- Recommended decisions
- POA&M status

Purpose:

- Reduce PowerPoint burden.
- Give leaders a clean command-level view.

### 13. Exercise Package Generator

Add a final `Exercise Package` section that bundles:

- Scenario
- Mission assignments
- Graphic overview
- Sync matrix
- Rehearsal script
- MSEL / inject list
- Observation plan
- Hotwash results
- EXSUM
- AAR
- Entity reviews
- POA&M

Purpose:

- Give users a satisfying final product.
- Support real-world staff workflow.
- Make export/package generation a premium feature candidate.

### 14. Ask the Exercise Chat

Add an exercise-specific chat assistant that can answer questions against that exercise record.

Example questions:

- What were the top three communications issues?
- Which entity had the most unresolved friction?
- Generate a summary for law enforcement only.
- What decision points occurred between 1300 and 1500?
- What findings support a request for more UAS funding?
- Draft a TAG-level summary.
- What should we fix before Lightning Strike 2.0?

Purpose:

- Make AFTERBURN feel like a living knowledge base.
- Help users retrieve and synthesize exercise intelligence quickly.
- Support future archive and lessons learned workflows.

## Suggested Navigation Evolution

Current navigation should remain streamlined, but future navigation may evolve toward:

- Overview
- Dashboard
- Exercises
- Scenario
- Graphic Overview
- Mission
- Objectives
- MSEL / Injects
- Sync Matrix
- Evaluators
- Decision Points
- Feedback
- Analysis
- EXSUM / AAR
- POA&M
- Lessons Learned
- Insights
- Briefing Mode
- Exercise Package
- Settings

To avoid overwhelming users, these should be grouped by lifecycle phase and exposed progressively.

## Security Implication

Several roadmap features increase sensitivity:

- Participant portal
- AAR evidence binder
- Capability gap library
- Trends across exercises
- Ask the Exercise chat
- Shared lessons learned

These features require strong organization isolation, role-based permissions, MFA, audit logging, and clear controls over what can be shared outside an organization.
