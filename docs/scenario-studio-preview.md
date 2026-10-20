# Guided scenario studio — first review

The new `/exercises/new` experience replaces the disconnected setup form with a four-step concept workflow: training purpose, exercise frame, editable story, and linked objectives/injects/evidence. The existing scenario builder is unchanged. The briefing route now prefers the current browser concept, while other lifecycle modules retain their existing behavior.

## Review path

1. Open `/exercises/new`. Choose a starting goal or describe your own.
2. Enter a fictional setting and participating teams; choose hazard, format, and duration.
3. Generate and edit the title and story. Confirm the assumptions.
4. Review the plan. Each inject references an objective; objectives have proposed criteria and evidence to capture.
5. Edit a success criterion and export the concept as Markdown. Refresh to check draft recovery.

## Behavior and boundaries

- Inputs, generated drafts, story edits, criteria, and current step are retained in browser storage. This is a single local draft, not a shared database exercise. Export before starting another concept.
- With no `OPENAI_API_KEY`, explicitly labeled deterministic examples adapt to the selected frame. They do not interpret custom training goals beyond including them, or adapt objectives/injects to free-form story edits.
- With an AI key, Supabase configuration and an authenticated user are required. AI can refine the whole concept and derive a plan from the edited story. The exact title and story are retained during plan generation.
- If live generation is unavailable or requires sign-in, the planner can explicitly choose an illustrative example. Further edits to that example stay in example mode.
- Generation output is validated for structure, unique IDs, objective coverage, chronological injects, and session duration. Failed generation leaves the previous draft intact.
- Live AI calls were not exercised without credentials. This branch does not change the public demonstration's broader authentication middleware or add shared saving.
- Functional/full-scale options produce initial concepts, not complete execution packages. Detailed authorities, roles, safety, staffing, simulation, and evaluation standards still need planner review.

## Validation

Use Node 24+ for the dependency-free test runner:

```sh
node --test tests/scenario-studio.test.mjs
node node_modules/typescript/bin/tsc --noEmit
node node_modules/next/dist/bin/next build
node --test tests/scenario-studio-api.test.mjs
```

The existing `pnpm-workspace.yaml` contains unresolved build-script approval placeholders for `sharp` and `unrs-resolver`. Installed dependency binaries can run these checks without executing those optional installation scripts; the placeholders are unchanged in this branch.

Local verification: six model/export/storage tests cover all 36 example combinations and invalid relationships; three compiled route tests cover malformed requests, example generation, exact edited-story handoff, and explicit example selection without paid calls. TypeScript, lint, and production compilation pass when `NODE_PATH` points to the installed `eslint-config-next` dependency directory (needed to resolve the repository's existing pnpm lint-plugin layout). Browser interaction/visual QA and authenticated live-AI generation remain unverified in this environment.

## Next integration pass

Resolve exercise-specific data selection before saving concepts to shared tables. The current data loader reads several globally latest records, including scenario and mission assignment, so simply inserting a new exercise would not guarantee a coherent selected-exercise workspace. Connect the reviewed concept to persisted objectives/injects only after exercise selection and ownership are consistent. Then continue the same traceability into evaluator evidence, findings, improvement owners, and retests.


## Document import and briefing generation

The same concept now supports starting from scratch or reviewing an existing PPTX, DOCX, TXT, or Markdown file. The parser runs in the browser and extracts text and speaker notes with source labels. It does not upload the original file. Supported limits are 8 MB, 100 slides, and 160,000 extracted characters. Images, charts, and image-only pages require manual review; PDF import is not implemented.

Extraction is deterministic and intentionally conservative. It recognizes common exercise headings, individual lane descriptions, day labels, and requested decisions. It is not a general semantic interpretation of arbitrary slides. The planner reviews suggestions before applying them; absent fields remain blank, draft standards remain draft, and lane leads start proposed. Only reviewed fields travel to the AI endpoint when the planner chooses AI generation. A source-based, non-AI draft remains available.

Concepts support up to six lanes and seven days with a daily activity window. Each lane has a problem, draft standard, proposed or confirmed lead, evaluator, evidence method, source reference, and dependencies. Editable decisions/RFIs track ownership, due dates, and status. Each objective and inject references a valid lane; every lane is covered. The deterministic source path copies reviewed narrative and standards and clearly labels generated controller prompts as proposed scaffolding.

The planning brief is derived from the current concept rather than maintained as a second copy. It includes purpose, scenario, lanes, standards and evidence, schedule, assumptions, and open decisions with owners. The briefing route uses the saved browser concept when available and blocks a stale brief when setup/story edits need regeneration. Without a local concept, the existing workspace briefing remains available.

Review the brief in the planner or at `/briefing`. Print/save as PDF from a separate print window, or download a self-contained HTML briefing. Controller annexes and injects are excluded by default and can be included explicitly. Editable PowerPoint export and shared database saving remain future integration work.

Validation uses synthetic fixtures for slide order, speaker notes, draft status, multi-day lane coverage, missing fields, malicious XML, HTML escaping, and live updates to briefing content. The supplied reference deck was used locally to verify extraction of 39 slides, five proposed lanes, a three-day schedule, and source-linked standards. Its contents and file are not committed to this public repository. Browser visual/interaction QA and authenticated live AI remain unverified.
