# Workspace consistency pass

## Product model
Overview is the single workspace entry point. Plan includes conception; Execute captures the event; Review assesses performance; Improve owns follow-through. Library supports reuse without adding a competing lifecycle phase.

The sidebar, breadcrumb, tool titles, phase landing pages, and landing-page lifecycle share lib/workspace-navigation.ts. Each tool has one navigation owner even when linked from multiple phases. Dashboard and Advanced URLs redirect to Overview; their underlying tools remain available within phases.

Phase home pages present one starting action, three core tools, and expandable specialist tools. They no longer infer approval from counts or present fixed issues and completion states as a live exercise assessment.

The overview reads the saved browser concept. Workspace context explicitly distinguishes the guided planner/briefing from separate demonstration or database records. This pass does NOT migrate browser drafts into Supabase or unify historical database records. Cross-exercise query scoping still requires a separate data-model pass before multi-exercise production use.

## Interface
Shared dark palette, amber primary actions, 44px shared buttons and form controls, consistent headings/panels, visible keyboard focus, skip link, current navigation state, full breadcrumbs, reduced-motion support, and mobile menu reset on navigation. Tailwind's ink token now matches the dark theme; conflicting global color overrides were removed.

Legacy generator Save is now an actual text download. Timeline CSV downloads visible rows and neutralizes leading spreadsheet formula characters. Unimplemented package and timeline PDF exports are explicitly unavailable. No PowerPoint export is added.

## Access protection
Application middleware currently permits public access. This commit does not enable or claim password protection.

Recommended development access control: in the AFTERBURN Vercel project, open Security > Deployment Protection, enable Vercel Authentication, select All Deployments, and save. This protects production and preview URLs. Vercel announced this is free on all plans on September 9, 2026:
https://vercel.com/changelog/protect-production-deployments-for-free-on-every-plan

Password Protection is an alternative for reviewers who should not need Vercel accounts; check the project's available plan and pricing before enabling paid protection. Do not commit passwords or bypass tokens.

After activation, use a signed-out/private browser to confirm both production and preview pages AND direct API requests are blocked. Review protection exceptions and shared bypass links. Hosting protection does not change public GitHub repository visibility or replace per-user authorization and Supabase policies.

Vercel settings were not accessible in this session. Activation and signed-out verification are pending.

## Reference material
User supplied Lightning Strike 1.0 Executive Summary (PDF) during this pass. Review is pending because the local execution/file-reading environment was unavailable. Do not claim the changes reflect that document's contents. It should inform evidence-to-finding-to-action traceability and carry-forward into LS 2.0 planning; do not bundle private source documents in the public repository.

## Verification
Local execution and browser automation unavailable during this pass. Navigation ownership checks (10 representative routes) and CSV escaping/formula neutralization checks (6 cases) passed in the available JavaScript runtime. Vercel deployment build is the compile gate; browser visual, keyboard, mobile, download, and print acceptance remain pending.
