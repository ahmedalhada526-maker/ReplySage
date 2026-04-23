/**
 * AI provider selector.
 * - If GEMINI_API_KEY is set, calls Google Gemini directly.
 * - Otherwise, falls back to the Lovable AI Gateway with LOVABLE_API_KEY.
 *
 * Both paths use OpenAI-compatible chat/completions shape so callers don't change.
 */

const LOVABLE_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const GEMINI_OPENAI_BASE =
  "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

/** Default model when calling Lovable AI Gateway. */
const LOVABLE_DEFAULT_MODEL = "google/gemini-2.5-pro";
/** Equivalent Gemini model name on Google's direct API. */
const GEMINI_DIRECT_MODEL = "gemini-2.5-pro";

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

/**
 * Sends a chat-completion request to whichever provider is active.
 * Caller passes the Lovable model name; we map it to Gemini if needed.
 */
export async function callAIChat(
  payload: ChatPayload,
): Promise<Response> {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    return fetch(GEMINI_OPENAI_BASE, {
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
  }

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
