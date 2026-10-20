// Best-effort per-instance throttling, not a distributed rate limiter.
// A long random password is required; add hosting firewall limits for broader rollout.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const MAX_KEYS = 5000;
const attempts = new Map<string, { count: number; until: number }>();

export function allowAccessAttempt(key: string, now = Date.now()): boolean {
  for (const [id, entry] of attempts) if (entry.until <= now) attempts.delete(id);
  const entry = attempts.get(key);
  if (entry) {
    if (entry.count >= MAX_ATTEMPTS) return false;
    entry.count++;
    return true;
  }
  if (attempts.size >= MAX_KEYS) return false;
  attempts.set(key, { count: 1, until: now + WINDOW_MS });
  return true;
}
