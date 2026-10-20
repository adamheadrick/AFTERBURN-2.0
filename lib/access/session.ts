// Server/Edge only. Never import this module into a client component.
export const ACCESS_COOKIE = "afterburn_access";
export const SESSION_SECONDS = 12 * 60 * 60;
const encoder = new TextEncoder();

export function accessPassword(): string | null {
  const value = process.env.AFTERBURN_ACCESS_PASSWORD;
  return value && value.length >= 20 && value.length <= 256 ? value : null;
}

function hex(bytes: ArrayBuffer) {
  return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, "0")).join("");
}

async function signingKey(password: string) {
  return crypto.subtle.importKey("raw", encoder.encode("afterburn:access:v1:" + password), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function passwordMatches(candidate: string, password: string): Promise<boolean> {
  const [actual, expected] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(candidate)),
    crypto.subtle.digest("SHA-256", encoder.encode(password))
  ]);
  const left = new Uint8Array(actual), right = new Uint8Array(expected);
  let difference = 0;
  for (let i = 0; i < left.length; i++) difference |= left[i] ^ right[i];
  return difference === 0;
}

export async function createAccessSession(password: string, now = Date.now()): Promise<string> {
  const issued = Math.floor(now / 1000);
  const random = crypto.getRandomValues(new Uint8Array(16));
  const nonce = Array.from(random, byte => byte.toString(16).padStart(2, "0")).join("");
  const payload = `v1.${issued}.${issued + SESSION_SECONDS}.${nonce}`;
  const signature = await crypto.subtle.sign("HMAC", await signingKey(password), encoder.encode(payload));
  return `${payload}.${hex(signature)}`;
}

export async function verifyAccessSession(token: string | undefined, password: string, now = Date.now()): Promise<boolean> {
  if (!token || token.length > 200) return false;
  const match = /^v1\.(\d{10})\.(\d{10})\.([a-f0-9]{32})\.([a-f0-9]{64})$/.exec(token);
  if (!match) return false;
  const issued = Number(match[1]), expires = Number(match[2]), seconds = Math.floor(now / 1000);
  if (issued > seconds + 30 || expires <= seconds || expires - issued !== SESSION_SECONDS) return false;
  const signature = Uint8Array.from(match[4].match(/../g)!, byte => parseInt(byte, 16));
  return crypto.subtle.verify("HMAC", await signingKey(password), signature, encoder.encode(token.slice(0, token.lastIndexOf("."))));
}

export function cookieFromRequest(request: Request): string | undefined {
  return request.headers.get("cookie")?.split(";").map(part => part.trim()).find(part => part.startsWith(ACCESS_COOKIE + "="))?.slice(ACCESS_COOKIE.length + 1);
}

export function safeReturnPath(value: string | null | undefined): string {
  if (!value || value.length > 2000 || !value.startsWith("/") || value.startsWith("//")) return "/overview";
  try {
    const decoded = decodeURIComponent(value);
    if (decoded.startsWith("//") || /[\\\x00-\x1f]/.test(decoded)) return "/overview";
    const url = new URL(value, "https://afterburn.invalid");
    if (url.origin !== "https://afterburn.invalid" || url.pathname === "/access" || url.pathname.startsWith("/api/access")) return "/overview";
    return url.pathname + url.search;
  } catch { return "/overview"; }
}

export async function accessAllowed(request: Request): Promise<boolean> {
  const password = accessPassword();
  return !!password && verifyAccessSession(cookieFromRequest(request), password);
}

export async function denyApiAccess(request: Request): Promise<Response | null> {
  if (await accessAllowed(request)) return null;
  return Response.json({ error: "Unlock AFTERBURN to continue.", accessRequired: true }, {
    status: 401, headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" }
  });
}

// Compare the browser Origin with the actual Host, not Next's internal server URL.
export function verifiedRequestOrigin(request: Request): string | null {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return null;
  try {
    const url = new URL(origin);
    const local = url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "[::1]";
    if (url.origin !== origin || url.host !== host || (url.protocol !== "https:" && !(local && url.protocol === "http:"))) return null;
    return url.origin;
  } catch { return null; }
}
