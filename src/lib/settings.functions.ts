import { createServerFn } from "@tanstack/react-start";
import { getAIProviderInfo } from "./ai-provider.server";
import { checkRateLimit } from "./rate-limit.server";

/**
 * Returns the active AI provider WITHOUT exposing any key value.
 * Safe to call from the client.
 */
export const getAIStatus = createServerFn({ method: "GET" }).handler(
  async (): Promise<{
    provider: "gemini-direct" | "lovable";
    geminiConfigured: boolean;
    lovableConfigured: boolean;
  }> => {
    const info = getAIProviderInfo();
    return {
      provider: info.provider,
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      lovableConfigured: Boolean(process.env.LOVABLE_API_KEY),
    };
  },
);

/**
 * Sends a tiny test prompt to Google Gemini using GEMINI_API_KEY.
 * Returns success + reply OR the exact upstream error message.
 * Never returns the API key itself.
 */
export const testGeminiKey = createServerFn({ method: "POST" }).handler(
  async (): Promise<{
    ok: boolean;
    status?: number;
    reply?: string;
    error?: string;
    latencyMs?: number;
  }> => {
    // Guard against abuse: max 5 tests per minute per IP.
    const rl = checkRateLimit("test-gemini", 5, 60_000);
    if (!rl.ok) {
      return { ok: false, error: `Rate limited. Try again in ${rl.retryAfter}s.` };
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return { ok: false, error: "GEMINI_API_KEY is not configured on the server." };
    }

    const started = Date.now();
    try {
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gemini-2.5-flash",
            messages: [{ role: "user", content: "Reply with exactly the word: pong" }],
            max_tokens: 10,
          }),
        },
      );

      const latencyMs = Date.now() - started;
      const text = await res.text();

      if (!res.ok) {
        // Try to surface the upstream error message verbatim.
        let upstream = text;
        try {
          const parsed = JSON.parse(text);
          upstream = parsed?.error?.message ?? parsed?.message ?? text;
        } catch {
          // keep raw text
        }
        return {
          ok: false,
          status: res.status,
          latencyMs,
          error: `HTTP ${res.status}: ${upstream.slice(0, 500)}`,
        };
      }

      let reply = "(no content)";
      try {
        const json = JSON.parse(text);
        reply = json?.choices?.[0]?.message?.content?.trim() || reply;
      } catch {
        reply = text.slice(0, 200);
      }

      return { ok: true, status: res.status, latencyMs, reply };
    } catch (e) {
      return {
        ok: false,
        error: e instanceof Error ? e.message : "Unknown network error",
      };
    }
  },
);
