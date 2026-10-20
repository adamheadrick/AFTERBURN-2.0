# Guided scenario studio — first review

The new `/exercises/new` experience replaces the disconnected setup form with a four-step concept workflow: training purpose, exercise frame, editable story, and linked objectives/injects/evidence. The existing scenario builder and other lifecycle modules are unchanged.

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

Local verification: six model/export/storage tests cover all 36 example combinations and invalid relationships; compiled route tests cover malformed requests, example generation, and exact edited-story handoff. TypeScript and production compilation pass. Next's bundled lint step reports an existing pnpm plugin-resolution issue; lint for the changed JavaScript/TypeScript files passes when `NODE_PATH` points to the installed `eslint-config-next` dependency directory. Browser interaction/visual QA and authenticated live-AI generation remain unverified in this environment.

## Next integration pass

Resolve exercise-specific data selection before saving concepts to shared tables. The current data loader reads several globally latest records, including scenario and mission assignment, so simply inserting a new exercise would not guarantee a coherent selected-exercise workspace. Connect the reviewed concept to persisted objectives/injects only after exercise selection and ownership are consistent. Then continue the same traceability into evaluator evidence, findings, improvement owners, and retests.
