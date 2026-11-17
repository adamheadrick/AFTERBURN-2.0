# Activate AFTERBURN AI

The code is deployed separately from account setup. Do not claim live generation is working until a signed-in end-to-end request succeeds.

## Owner setup

1. Create a Supabase project. Keep its database password private. For this browser-draft analysis feature, Supabase Auth is sufficient; shared exercise storage is a separate setup using the repository schema and reviewed access policies.
2. Configure Supabase Auth URL settings:
   - Site URL: `https://afterburn-2-0.vercel.app`
   - Allowed redirect: `https://afterburn-2-0.vercel.app/auth/callback`
   - Enable email sign-in. Configure mail delivery for the intended users. Test delivery before inviting the team.
3. Create an OpenAI API project, configure billing and available usage controls, and create a project API key. Do not paste this key into chat, source code, or AFTERBURN's Settings page.
4. In the AFTERBURN Vercel project, add these environment variables for Production:

| Setting | Source |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable/anon client key, never the service-role secret |
| `NEXT_PUBLIC_SITE_URL` | `https://afterburn-2-0.vercel.app` |
| `OPENAI_API_KEY` | Private OpenAI project key |
| `PLANNING_AI_ALLOWED_USERS` | Comma-separated email addresses or authenticated user IDs approved for AI use |
| `OPENAI_MODEL` | Optional compatible model; existing default is `gpt-4.1-mini` |

5. Redeploy. Settings checks whether configuration is present; it does not certify that credentials work.
6. Sign in using an approved email address at `/login`. Open `/planning-guide`, enter a short non-sensitive sample plan, expand **AI planning review**, inspect what will be sent, and request a review.
7. Verify a real response, source citations, keeping/dismissing suggestions, stale-review notice after editing, export, and unauthenticated denial. No live model response has been verified while setup is missing.

## Behavior and limits

- The server verifies the sign-in session and approved-user list before making paid calls. Existing shared generation and scenario-studio calls use these access checks too.
- AI reviews do not write into planning fields, approve decisions, or authorize execution. Team members edit the plan themselves after review.
- Current planning text and decision content are sent to OpenAI. Previous snapshots and decision attribution fields are omitted from the analysis request. Names or other information typed into ordinary planning fields are still included; inspect the preview before sending.
- Request size and output length are bounded. Exact citations must exist in the supplied input. Schema validation cannot guarantee correct reasoning.
- Review calls use no automatic retries and a 45-second provider timeout. A browser cancellation may not cancel work already started at the provider.
- Throttling is best-effort per server instance (20 requests/hour, at least 20 seconds apart). It is not a global billing cap and resets across instances/restarts. Keep the approved-user list small; configure provider spending controls. Add a durable shared quota before wider deployment.
- `store:false` is used. This does not promise zero provider retention; account data handling must match the organization's requirements.
- Browser drafts and AI reviews are saved only on the current browser/device. Export copies for retention.

Implementation reference: [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=chat).
