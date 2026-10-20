import assert from "node:assert/strict";
import test from "node:test";
import { accessPassword, accessAllowed, createAccessSession, verifyAccessSession, passwordMatches, safeReturnPath, SESSION_SECONDS } from "../lib/access/session.ts";
import { allowAccessAttempt } from "../lib/access/attempts.ts";
const password = "test-fixture-only-not-a-deployment-password";

test("sessions expire, reject tampering and future timestamps, and are invalidated by password rotation", async () => {
  const now = 1792510000000;
  const token = await createAccessSession(password, now);
  assert.equal(await verifyAccessSession(token, password, now), true);
  assert.equal(await verifyAccessSession(token, password, now + SESSION_SECONDS * 1000), false);
  assert.equal(await verifyAccessSession(token, password + "rotated", now), false);
  assert.equal(await verifyAccessSession(token.replace("v1.", "v2."), password, now), false);
  assert.equal(await verifyAccessSession(token.slice(0, -1) + (token.endsWith("0") ? "1" : "0"), password, now), false);
  assert.equal(await verifyAccessSession(await createAccessSession(password, now + 60000), password, now), false);
  assert.equal(await verifyAccessSession(undefined, password, now), false);
});

test("missing or weak configuration fails closed; requests require a valid cookie", async () => {
  const previous = process.env.AFTERBURN_ACCESS_PASSWORD;
  try {
    delete process.env.AFTERBURN_ACCESS_PASSWORD;
    assert.equal(accessPassword(), null);
    assert.equal(await accessAllowed(new Request("https://example.test/api/test")), false);
    process.env.AFTERBURN_ACCESS_PASSWORD = "short";
    assert.equal(accessPassword(), null);
    process.env.AFTERBURN_ACCESS_PASSWORD = password;
    assert.equal(await accessAllowed(new Request("https://example.test/api/test")), false);
    const cookie = "afterburn_access=" + await createAccessSession(password);
    assert.equal(await accessAllowed(new Request("https://example.test/api/test", { headers: { cookie } })), true);
  } finally { if (previous === undefined) delete process.env.AFTERBURN_ACCESS_PASSWORD; else process.env.AFTERBURN_ACCESS_PASSWORD = previous; }
});

test("password comparison is exact and return paths cannot redirect off-site", async () => {
  assert.equal(await passwordMatches(password, password), true);
  assert.equal(await passwordMatches(password + " ", password), false);
  for (const path of ["https://evil.test", "//evil.test", "/\\evil.test", "/%2f%2fevil.test", "/%5cevil.test", "/access", "/api/access", "/%0d%0aLocation:evil", "%%%"])
    assert.equal(safeReturnPath(path), "/overview", path);
  assert.equal(safeReturnPath("/exercises/new?step=2"), "/exercises/new?step=2");
});

test("per-instance attempt budget blocks excessive attempts and recovers after its window", () => {
  for (let i = 0; i < 10; i++) assert.equal(allowAccessAttempt("unit-test", 1000), true);
  assert.equal(allowAccessAttempt("unit-test", 1000), false);
  assert.equal(allowAccessAttempt("unit-test", 601001), true);
});
