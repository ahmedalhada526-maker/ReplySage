/**
 * AI provider selector.
 * - If GEMINI_API_KEY is set, calls Google Gemini directly.
 * - Falls back to Lovable AI Gateway on auth/quota/server failures, or when no
 *   Gemini key is configured.
 *
 * Both paths use the OpenAI-compatible chat/completions shape so callers don't change.
 */

const LOVABLE_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const GEMINI_OPENAI_BASE =
  "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

/** Default model when calling Lovable AI Gateway. */
const LOVABLE_DEFAULT_MODEL = "google/gemini-2.5-pro";
/**
 * Equivalent Gemini model name on Google's direct API.
 * NOTE: gemini-2.5-pro requires a paid plan on Google AI Studio (free tier
 * quota is 0). gemini-2.5-flash is available on the free tier and gives
 * very similar quality for chat/tool-calling, so we use it as the default
 * for direct Gemini calls.
 */
const GEMINI_DIRECT_MODEL = "gemini-2.5-flash";

export interface AIProviderInfo {
  provider: "gemini-direct" | "lovable";
  configured: boolean;
}

export function getAIProviderInfo(): AIProviderInfo {
  if (process.env.GEMINI_API_KEY) {
    return { provider: "gemini-direct", configured: true };
  }
  if (process.env.LOVABLE_API_KEY) {
    return { provider: "lovable", configured: true };
  }
  return { provider: "lovable", configured: false };
}

interface ChatPayload {
  messages: Array<{ role: string; content: string }>;
  tools?: unknown;
  tool_choice?: unknown;
  temperature?: number;
}

/** Status codes from Gemini that should trigger fallback to Lovable AI. */
function shouldFallback(status: number): boolean {
  // 401/403 = bad/unauthorized key, 404 = model unavailable for this key,
  // 429 = quota exceeded (e.g. free-tier daily cap on gemini-2.5-pro),
  // 5xx = upstream Google issue.
  return status === 401 || status === 403 || status === 404 || status === 429 || status >= 500;
}

async function callLovable(payload: ChatPayload): Promise<Response> {
  const lovableKey = process.env.LOVABLE_API_KEY;
  if (!lovableKey) {
    return new Response(JSON.stringify({ error: "no AI key configured" }), {
      status: 500,
    });
  }

  return fetch(LOVABLE_GATEWAY, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: LOVABLE_DEFAULT_MODEL,
      ...payload,
    }),
  });
}

/**
 * Sends a chat-completion request to whichever provider is active.
 * If the user's Gemini key fails with a recoverable error (quota, auth,
 * upstream), automatically retries through the Lovable AI Gateway.
 */
export async function callAIChat(payload: ChatPayload): Promise<Response> {
  const geminiKey = process.env.GEMINI_API_KEY;

  if (geminiKey) {
    // Try Gemini up to 3 times for transient errors (503/500) before falling back.
    const transientStatuses = new Set([500, 502, 503, 504]);
    const maxAttempts = 3;
    let lastRes: Response | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const res = await fetch(GEMINI_OPENAI_BASE, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${geminiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: GEMINI_DIRECT_MODEL,
            ...payload,
          }),
        });

        if (res.ok) return res;

        // Transient — retry with backoff before giving up.
        if (transientStatuses.has(res.status) && attempt < maxAttempts) {
          const errText = await res.text().catch(() => "");
          console.warn(
            `Gemini transient ${res.status} (attempt ${attempt}/${maxAttempts}); retrying. Body: ${errText.slice(0, 200)}`,
          );
          await new Promise((r) => setTimeout(r, 400 * attempt));
          continue;
        }

        lastRes = res;
        break;
      } catch (err) {
        console.warn(`Gemini direct threw (attempt ${attempt}/${maxAttempts}):`, err);
        if (attempt < maxAttempts) {
          await new Promise((r) => setTimeout(r, 400 * attempt));
          continue;
        }
        if (process.env.LOVABLE_API_KEY) return callLovable(payload);
        throw err;
      }
    }

    if (lastRes) {
      if (shouldFallback(lastRes.status) && process.env.LOVABLE_API_KEY) {
        const errText = await lastRes.text().catch(() => "");
        console.warn(
          `Gemini direct failed (${lastRes.status}) after ${maxAttempts} attempts; falling back to Lovable AI. Body: ${errText.slice(0, 300)}`,
        );
        return callLovable(payload);
      }
      return lastRes;
    }
  }

  return callLovable(payload);
}
