# AFTERBURN Checkpoint

Saved: 2026-05-19 18:09 CDT

Current local site:
- http://127.0.0.1:3001
- User was last viewing: http://127.0.0.1:3001/overview

Workspace note:
- The substantive AFTERBURN MVP files are in `/Users/adam.headrick/Documents/Codex/2026-05-12/build-the-afterburn-mvp-using-next`.
- `/Users/adam.headrick/Documents/Codex/2026-05-19/afterburn` exists but is empty as of this checkpoint.

Companion roadmap:
- See `AFTERBURN_PRODUCT_ROADMAP.md` for the next major product concepts captured on 2026-05-13.

Current product direction:
- AFTERBURN should flow logically from pre-event planning, to event execution, to post-event analysis.
- The Sync Matrix is the hour-by-hour timeline page for the event execution phase.
- The Command Center should now behave like an issue-first exercise placemat: quick briefable status, risk, next actions, metrics, and print/export before deeper workspace navigation.
- Keep the interface streamlined: phase-based navigation, clear next steps, quick-scan views first, detailed editing second.
- Preserve strong branding without visual redundancy: sidebar carries flame + wordmark; main masthead carries larger AFTERBURN type treatment.
- Build toward an Exercise Archive plus a separate Lessons Learned repository for approved, categorized, non-sensitive lessons.
- Primary navigation is now consolidated into seven product workspaces: Command Center, Plan, Execute, Review, Improve, Library, and Admin.
- Existing tools remain available as nested workspace cards, not as separate top-level menu items.
- Command Center is the home page after login/demo entry at `/overview`.
- Keep AFTERBURN exercise-oriented for now, while allowing positioning language to leave room for future real-world operation documentation.
- Admin/configuration should be role-limited in a live product, not fully outward-facing.
- Dropoff reinforces the core value proposition: raw observations and references become screened, structured, traceable, actionable lessons and improvements.

Completed or mostly completed:
- Next.js / React / Tailwind MVP scaffold.
- Dark operational dashboard style.
- High-contrast type treatment across the app.
- Demo-mode auth so the app can be used without Supabase credentials.
- Dashboard, exercise creation, scenario builder, mission assignment, objectives, injects, feedback, AI analysis, EXSUM, POA&M, settings.
- Demo exercise data for `Exercise LIGHTNING STRIKE`, using the available multi-hazard domestic operations scenario package.
- Server API route examples for scenario, mission assignment, injects, feedback analysis, EXSUM, and POA&M generation.
- Supabase schema starter for core tables.

Latest updates captured on 2026-05-19:
- Command Center / Overview was refocused into a concise placemat-style dashboard:
  - Shows active exercise status, readiness, updated time, location, agencies, operational summary, next best action, priority issues, metrics, and workflow status.
  - Includes `Export Placemat` via browser print.
  - Handles the no-active-exercise state with instructional next actions rather than carrying over old exercise content.
  - Keeps detailed planning/execution/review/improvement tools behind `Open Full Workspace`.
- Plan page now works like a readiness gate:
  - Workstreams cover exercise overview, objectives/evaluation criteria, scenario/MSEL/injects, participants/agencies/roles, timeline, communications/COP, UAS/airspace, safety/legal authorities, and planning readiness.
  - Planning issues are action-oriented and point to the right module for follow-up.
  - Language is aimed at county emergency managers while preserving formal terms where useful.
- Sync Matrix was advanced into a rehearsal timeline/script surface:
  - Primary views are `Script`, `Timeline`, `Gaps`, `Resources`, and `Details`.
  - Each time block can show organization-specific task, purpose, personnel, location, equipment/assets, reporting, and expected output.
  - Planners can add missing organizations to a time block and filter by organization, objective, tasking, or lane.
  - Personnel totals, peak window, resource surges, visible rows, visible segments, and review-needed counts are surfaced.
  - AI timeline generation remains wired through `/api/generate-sync-matrix`; CSV/PDF export buttons are visible but still placeholders.
- AI generation UI was hardened for planner use:
  - Shared generator now supports generate, regenerate, copy, editable output, status messaging, and visible save affordance.
  - The save control is a UI placeholder until persistence is wired.
- White Cell / Exercise Control page now has a live-play support shape:
  - Shows next inject and active/gap timeline rows in a control snapshot.
  - Generates event-control guidance for next injects, delayed inject adjustment, friction capture, decision reminders, observer prompts, hotwash questions, and end-of-phase notes.
- Exercise Package page now tracks package completion across:
  - Scenario, tasking/mission assignment, graphic overview, rehearsal timeline/sync matrix, rehearsal script, inject list/MSEL, observation plan, decision point log, hotwash/feedback, EXSUM/AAR, organization reviews, POA&M, and evidence binder.
  - Export PDF/Word controls are visible but still need real document generation.
- Several pages and helpers were touched to support the updated lifecycle, empty-state, AI generation, and no-carryover demo direction:
  - `app/page.tsx`, login, data helpers, Supabase server helper, AI helper, plan/overview/advanced/admin/feedback/graphic overview/mission assignment/settings/scenario/evaluators/decision points/participant portal/exercise package/white cell pages.

Completed since last checkpoint:
- Added global Dropoff intake:
  - Omnipresent `Dropoff` button in the app header.
  - Slide-over intake tray available from any module without navigation.
  - Intake supports title, category, exercise/event association, module/phase, entity, functional area, body, recommended action, tags, urgency, visibility recommendation, and attachment metadata.
  - Confirmation says `Received for screening`, not published.
  - Includes clear no-classified-information warning.
- Added Dropoff AI-assisted screening:
  - New `/api/dropoff/submit` route.
  - `lib/dropoff-screening.ts` performs OpenAI-backed screening when configured and deterministic local screening in demo mode.
  - Screening output includes risk level, sensitivity categories, flagged terms/sections, recommended handling, suggested sanitized version, repository category, tags, confidence, and review-required boolean.
  - AI screening is advisory only and never auto-publishes.
- Added Dropoff review workflow:
  - New `/admin/dropoff` review queue.
  - Filters by category, status, risk, and functional area.
  - Shows AI screening report, sanitized text, reviewer notes, and reviewer actions.
  - Supports clear for review, sanitize, reject, and convert to repository in the MVP UI.
  - Admin page now has a Dropoff Review Queue card.
  - Library now has a Screened Dropoff Repository card.
- Added Dropoff data model:
  - `dropoff_submissions`
  - `dropoff_screening_reports`
  - `dropoff_attachments`
  - `lessons_repository_items`
  - Supabase schema and TypeScript database types updated.
  - README updated with Dropoff lifecycle.
- Updated the flame mark:
  - Removed the internal hole/cutout.
  - Shared `BrandMark` now renders as a solid flame shape across the app.
- Supporting Organizations on Create Exercise:
  - Replaced free-text textarea with dropdown add/remove picker.
  - Includes common emergency management partners plus custom add.
  - Still submits to existing `supporting_orgs` data shape.
- Graphic Overview was simplified:
  - Removed low-value stat boxes and passive context blocks.
  - Refocused on interactive/high-value map questions, layers, facilities, affected infrastructure, routes, decision points, and operating areas.
- Objectives and Injects:
  - Added AI recommended objectives springboard.
  - Injects now presents recommended inject generation as a springboard.
  - Manual fields use instructional placeholders rather than prior-event carryover text.
- Feedback page:
  - Removed stats boxes.
  - Added reporting/impacted organization and function fields so AAR outputs can break down by organization, individual, function, lane, and ownership.
- Create Exercise page:
  - Instructional placeholder copy now replaces carryover/default event copy.
- Sidebar and visual cleanup:
  - Collapsed sidebar icon text previews were fixed.
  - Header/sidebar wording aligned around `Exercise lifecycle intelligence`.
  - High-contrast type and non-white hover states remain a priority.
- Tooling status:
  - Typecheck passes as of this checkpoint.
  - ESLint passes as of this checkpoint after ignoring generated `.next` output.
- Sidebar navigation is consolidated into the seven primary workspaces: Command Center, Plan, Execute, Review, Improve, Library, and Admin.
- Dashboard now presents the workflow as Build the exercise, Run the event, Generate the AAR.
- Dedicated Sync Matrix / timeline page is available at `/sync-matrix`.
- Reusable Sync Matrix client UI includes quick timeline view, filters, metrics, detailed editable matrix, and AI generation button.
- `/api/generate-sync-matrix` has been added.
- `sync_matrix_entries` has been added to the Supabase schema and typed database model.
- EXSUM generation now includes the Time-Phased Execution and Synchronization Matrix Assessment section.
- Overview page simplified around five lifecycle phases: Concept, Plan, Execute, Assess, Improve.
- Overview action row now includes Open Current Exercise, Start New Exercise, and View Exercise Archive.
- Sidebar is collapsible. When collapsed, it stays collapsed on hover and shows only text previews for icons.
- Sidebar tagline under the logo was removed.
- Header masthead now shows larger AFTERBURN type over Exercise lifecycle intelligence.
- The longer concept/planning/execution/assessment/corrective action summary now lives in the Overview body.
- Flame mark is standalone and currently renders as a solid flame without an internal hole.
- Hover states have been adjusted away from white-on-white failures.
- Sync Matrix has been updated toward entity-by-time-block input for rehearsal use.
- Feedback and AAR direction includes filtering/breakouts by organization, individual, function, category, and entity/echelon.
- Graphic Overview page exists as the scenario visual layer, with a map/geospatial placeholder for later Google Maps, Mapbox, or ArcGIS integration.
- Typecheck and ESLint pass as of this checkpoint.
- Product roadmap features now have working MVP surfaces in the app:
  - `/readiness` Exercise Readiness Score with AI generation route.
  - `/evaluators` Controller / Observer / Evaluator Assignment Manager.
  - `/injects` reframed as MSEL / Inject Builder.
  - `/decision-points` Decision Point Tracker.
  - `/lessons` Lessons Learned / Capability Gap Library.
  - `/insights` Trends / Insights page.
  - `/red-team` Red Team This Exercise AI review.
  - `/white-cell` White Cell Assistant.
  - `/participant-portal` role-based participant view.
  - `/evidence` AAR Evidence Binder.
  - `/briefing` Briefing Mode.
  - `/exercise-package` Exercise Package checklist/export placeholder.
  - `/ask-exercise` Ask the Exercise chat surface.
- Supabase schema and TypeScript database types now include readiness scores, evaluator assignments, decision points, capability gaps, trend insights, and evidence items.
- POA&M tracker now includes owner-notification-oriented fields: required resources, next update date, escalation flag, and completion evidence.
- Dashboard and Overview now surface readiness, evaluator coverage, decision points, MSEL, and package readiness signals.
- Command Center now acts as the primary landing dashboard after login/demo entry.
- New hub pages added:
  - `/plan` nests Scenario, Graphic Overview, Mission, Objectives, Red Team, and Briefing Mode.
  - `/execute` nests MSEL, Sync Matrix, Entity Tasks, Evaluators, Decisions, White Cell, Participant Portal, and Feedback.
  - `/review` nests Analysis, Themes/Sustains/Improves, Evidence, EXSUM/AAR, Package, and contextual Ask Exercise.
  - `/improve` nests POA&M, Lessons, Capability Gaps, Best Practices, Recommendations, Future Exercise Inputs, and Trends.
  - `/library` provides reusable archive/search/template access for scenarios, MSELs, sync matrix examples, AAR packages, lessons, and entity profiles.
  - `/admin` provides placeholders for settings, users, organizations, roles, integrations, and subscription/licensing.
- Sidebar now exposes only the seven primary workspaces.
- Login/demo redirects now target `/overview` instead of `/dashboard`.
- Added a county emergency manager / non-military planner language pass:
  - Command Center now includes a start-to-finish planner path from Define to Improve.
  - Primary workflow language now leads with plain terms: tasking, inject list, rehearsal timeline, organization, executive summary, AAR, and improvement plan.
  - Formal terms remain paired where useful: Mission Assignment, MSEL, Sync Matrix, EXSUM/AAR, and POA&M.
  - Feedback form now supports reporting organization, impacted organization, impacted function, and likely responsible/supporting organization.
  - AI prompts now ask for plain emergency management language suitable for county planners.

Next work to resume:
- If the original Lightning Strike EXSUM/source packet is available outside this workspace, paste or import it so the demo data can be made exact.
- Continue simplifying the longest forms with progressive disclosure and task-focused sectioning.
- Wire real persistence for create/edit actions once Supabase credentials are configured.
- Decide whether to add a dedicated Exercise Archive page separate from the existing exercise register.
- Add a Lessons Learned repository with redundancy screening, best-practice cards, and optional Army warfighting function tags alongside civilian-friendly categories.
- If desired, continue refining the flame mark so the outer silhouette subtly implies an `a` without relying on holes or an obvious letter cutout.
- Consider replacing the `<<` / `>>` sidebar control with a panel-collapse icon only if it proves more intuitive than the current arrows.
- Next implementation pass should deepen the MVP surfaces with persistence, better create/edit flows, and role-based access rather than adding more top-level features.

Restart note:
- The app files are saved on disk in this folder.
- If the computer shuts down, the local dev server will stop and can be restarted later from this project folder.
- The app is intended to run locally at `http://127.0.0.1:3001` when the dev server is running.
- This folder is not currently a git repository, so there is no git commit associated with this checkpoint.
