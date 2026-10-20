// Run against the built app started with AFTERBURN_ACCESS_PASSWORD set to this test fixture.
import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync } from "node:fs";
import { createAccessSession, SESSION_SECONDS } from "../lib/access/session.ts";
const base = process.env.GATE_TEST_BASE_URL ?? "http://localhost:3118";
const password = "test-fixture-only-not-a-deployment-password";
const request = (path, options = {}) => fetch(base + path, { redirect: "manual", ...options });
const login = (passwordValue = password, extra = {}) => request("/api/access", {
  method: "POST", headers: { origin: base, "content-type": "application/x-www-form-urlencoded", "x-forwarded-for": "integration-login", ...extra.headers },
  body: new URLSearchParams({ password: passwordValue, returnTo: extra.returnTo ?? "/overview" }).toString()
});

function apiPaths(directory = new URL("../app/api/", import.meta.url), prefix = "/api") {
  const paths = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) paths.push(...apiPaths(new URL(entry.name + "/", directory), prefix + "/" + entry.name));
    else if (entry.name === "route.ts" && !prefix.startsWith("/api/access")) paths.push(prefix);
  }
  return paths;
}

test("signed-out pages redirect, all existing APIs reject, and the access page stays usable", async () => {
  for (const path of ["/", "/overview", "/exercises/new", "/exercises/example", "/briefing", "/login", "/admin", "/plan?_rsc=check"]) {
    const response = await request(path, { headers: { "x-middleware-subrequest": "middleware:middleware:middleware:middleware:middleware" } });
    assert.equal(response.status, 307, path);
    assert.match(response.headers.get("location"), /\/access/);
    assert.match(response.headers.get("cache-control"), /no-store/);
  }
  for (const path of apiPaths()) {
    const response = await request(path, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
    assert.equal(response.status, 401, path);
    assert.equal((await response.json()).accessRequired, true, path);
  }
  assert.equal((await request("/api/scenario-studio/fake.png", { method: "POST" })).status, 401);
  const page = await request("/access");
  assert.equal(page.status, 200);
  assert.match(await page.text(), /No account is needed/);
});

test("login rejects wrong passwords and foreign origins; valid login sets a secure cookie and unlocks", async () => {
  const wrong = await login("wrong");
  assert.equal(wrong.status, 303); assert.match(wrong.headers.get("location"), /error=incorrect/);
  assert.equal(wrong.headers.get("set-cookie"), null);
  assert.equal((await login(password, { headers: { origin: "https://foreign.test" } })).status, 403);
  const signedIn = await login(password, { returnTo: "//foreign.test" });
  assert.equal(signedIn.status, 303); assert.equal(signedIn.headers.get("location"), base + "/overview");
  const cookie = signedIn.headers.get("set-cookie");
  for (const flag of [/HttpOnly/i, /Secure/i, /SameSite=lax/i, /Path=\//i, /Max-Age=43200/i]) assert.match(cookie, flag);
  const headers = { cookie: cookie.split(";")[0] };
  assert.equal((await request("/overview", { headers })).status, 200);
  // A malformed payload returning 400 confirms the gate let the request reach the handler.
  assert.equal((await request("/api/scenario-studio", { method: "POST", headers: { ...headers, "content-type": "application/json" }, body: "{}" })).status, 400);
  const locked = await request("/api/access/logout", { method: "POST", headers: { ...headers, origin: base } });
  assert.equal(locked.status, 303); assert.match(locked.headers.get("set-cookie"), /Max-Age=0/i);
});

test("expired and tampered cookies cannot open API endpoints", async () => {
  const expired = await createAccessSession(password, Date.now() - (SESSION_SECONDS + 10) * 1000);
  for (const value of [expired, "forged-session-value"]) {
    assert.equal((await request("/api/scenario-studio", { method: "POST", headers: { cookie: "afterburn_access=" + value }, body: "{}" })).status, 401);
  }
});

test("login throttles excessive attempts on one instance", async () => {
  for (let i = 0; i < 10; i++) assert.equal((await login("wrong", { headers: { "x-forwarded-for": "integration-throttle" } })).status, 303);
  const response = await login("wrong", { headers: { "x-forwarded-for": "integration-throttle" } });
  assert.equal(response.status, 429); assert.equal(response.headers.get("retry-after"), "600");
});
