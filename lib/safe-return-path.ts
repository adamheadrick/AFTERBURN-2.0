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

