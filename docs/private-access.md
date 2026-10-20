# Shared password access

The app now requires a shared password on every deployment containing this change. It fails closed when the password is missing or shorter than 20 characters. There is no default password or public bypass switch.

## Activate in Vercel

1. Open the AFTERBURN project's Environment Variables page.
2. Add AFTERBURN_ACCESS_PASSWORD as a server-only variable (never NEXT_PUBLIC_).
3. Use a password manager to generate at least 20 random characters; maximum 256. Do not paste the password into chat, source code, issues, or PRs.
4. Select Production and Preview. Save the variable. If Vercel offers a Sensitive setting, enable it.
5. Redeploy the latest guided-scenario-studio branch deployment so it receives the variable.
6. Test in a private browser window: the preview must display the password page; a wrong password must fail; the correct password must open the workspace. Lock workspace must return to the gate.
7. Production main must receive this code in a separate deployment before the main site is protected. Setting the variable alone does not protect older code. Existing deployment URLs built before this gate remain separate deployments; remove unneeded public legacy deployments or protect them at the hosting layer.

Keep Vercel Authentication off if reviewers should only need the shared password. The Vercel paid Password Protection add-on is not used by this feature.

## Behavior and scope

- HMAC-SHA256 signed, HttpOnly, Secure (production), SameSite=Lax, host-only session cookie; 12-hour expiry.
- Rotating AFTERBURN_ACCESS_PASSWORD and redeploying invalidates old sessions on the new deployment. Old deployments keep their old configuration until redeployed or removed.
- Middleware protects navigation and API traffic; API handlers, data access, and server actions independently enforce access.
- Password POST and logout require same-origin requests. Return paths are restricted to this site. Protected responses use no-store caching.
- Login attempts are bounded to ten per ten-minute window per IP per server instance. This is best-effort throttling; serverless instances do not share counters. It is not distributed brute-force protection. Use a random password and add hosting firewall rate limits before a broader rollout.
- The shared password permits entry to the preview; existing Supabase account authorization is still required for operations that already require it. It does not create individual reviewer accounts or audit identities.
- Lock workspace clears the session, not the browser's locally saved exercise draft. Export or clear drafts separately on shared devices.
- This protects app access, not public GitHub source, shipped static client bundles, downloaded documents, or old deployments. It is a private-preview gate, not a replacement for per-user authorization or a deployment suitable for restricted exercise information.

## Verification

Unit tests cover expiry, tampering, password rotation, fail-closed config, same-site return paths, exact password comparison, and throttle windows. HTTP tests exercise signed-out routes, every existing API endpoint, forged middleware-bypass headers, direct API access, wrong-password/origin behavior, successful login, cookie flags, logout, expired sessions, and throttling.

For local testing only, start the built app on port 3118 using the test fixture password documented in tests/access-gate-http.test.mjs. Never use that public test fixture as a deployment password.
