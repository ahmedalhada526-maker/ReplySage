import { getRequestHeader } from "@tanstack/react-start/server";

// In-memory token bucket per identifier (IP). Resets on worker restart, which
// is acceptable for abuse mitigation — limits are short-window.
const buckets = new Map<string, { count: number; resetAt: number }>();

// Periodic cleanup to prevent unbounded growth.
function sweep(now: number) {
  if (buckets.size < 1000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * Resolve the caller IP from trusted sources only.
 *
 * We deliberately IGNORE `X-Forwarded-For` because it is fully client-controlled
 * on Cloudflare Workers and can be rotated to bypass per-IP limits. Only
 * `CF-Connecting-IP` (set by Cloudflare's edge and stripped from incoming
 * requests) is trusted. When absent, callers share a single "unknown" bucket
 * with an aggressive limit applied by the caller.
 */
function getClientId(): string {
  try {
    const cf = getRequestHeader("cf-connecting-ip");
    if (cf) return cf.trim();
  } catch {
    // ignore
  }
  return "unknown";
}

/**
 * Fixed-window rate limiter.
 * @param scope     namespace (e.g. "analyze", "savage")
 * @param limit     max requests per window
 * @param windowMs  window length in ms
 * @returns { ok: true } or { ok: false, retryAfter: seconds }
 */
export function checkRateLimit(
  scope: string,
  limit: number,
  windowMs: number,
): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  sweep(now);

  const id = getClientId();
  // When we can't identify the caller, apply a very tight shared limit to the
  // "unknown" bucket so spoofed / missing headers can't drain AI credits.
  const effectiveLimit = id === "unknown" ? Math.min(limit, 1) : limit;

  const key = `${scope}:${id}`;
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (bucket.count >= effectiveLimit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { ok: true };
}
