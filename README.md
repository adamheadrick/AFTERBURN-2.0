# AFTERBURN MVP

AFTERBURN is an AI-assisted exercise lifecycle intelligence platform for emergency management, public safety, National Guard, homeland defense, and interagency exercise planners. It supports concept development, scenario planning, partner tasking / mission assignment, event synchronization, observation collection, feedback analysis, executive summaries, AARs, and improvement plan / POA&M tracking.

## Included

- Next.js App Router, React, and Tailwind CSS
- Dark operational dashboard aesthetic
- Supabase-ready auth, schema, and RLS policies
- OpenAI-backed API routes with demo fallbacks
- Optional Mapbox-style placeholder surface for future geospatial views
- Demo exercise: `Exercise LIGHTNING STRIKE`
- Global Dropoff intake for screened lessons, observations, documents, recommendations, and doctrine references
- Full workflow pages:
  - Landing page
  - Dashboard
  - Exercises
  - Exercise creation
  - Scenario Builder
  - Tasking / Mission Assignment
  - Objectives
  - Injects
  - Rehearsal Timeline / Sync Matrix
  - Feedback
  - AI Analysis
  - Executive Summary / AAR
  - Improvement Plan / POA&M
  - Settings
  - Dropoff Review Queue

## Environment

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4.1-mini"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

When Supabase or OpenAI keys are absent, the app runs in local demo mode with mock data and deterministic AI outputs.

## Database

Run `supabase/schema.sql` in the Supabase SQL editor. It creates:

- `organizations`
- `exercises`
- `scenarios`
- `mission_assignments`
- `objectives`
- `injects`
- `sync_matrix_entries`
- `feedback_entries`
- `ai_analysis`
- `exsums`
- `poam_items`
- `dropoff_submissions`
- `dropoff_screening_reports`
- `dropoff_attachments`
- `lessons_repository_items`

Row-level security is enabled for exercise-owned tables.

## AI Routes

Each route accepts JSON, validates required fields, calls OpenAI when `OPENAI_API_KEY` is configured, and returns demo output otherwise.

- `POST /api/generate-scenario`
- `POST /api/generate-mission-assignment`
- `POST /api/generate-injects`
- `POST /api/generate-sync-matrix`
- `POST /api/analyze-feedback`
- `POST /api/generate-exsum`
- `POST /api/generate-poam`
- `POST /api/dropoff/submit`

## Dropoff Intake

The global `Dropoff` button is available in the application header from every workspace. It opens a secure intake drawer where users can submit observations, lessons, capability gaps, best practices, recommended improvements, doctrine references, and attachment metadata without leaving their current workflow.

Each submission follows this lifecycle:

`Dropoff → Screening → Review → Sanitization → Repository / Library → AAR, EXSUM, POA&M, or future exercise input`

Dropoff screening is AI-assisted when `OPENAI_API_KEY` is configured and falls back to deterministic local screening in demo mode. AI screening is advisory only; items are never auto-published to the repository.

## Run Locally

```bash
pnpm install
pnpm dev
```

Then open `http://localhost:3000`.
