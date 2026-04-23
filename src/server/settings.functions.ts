import { createServerFn } from "@tanstack/react-start";
import { getAIProviderInfo } from "./ai-provider";

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
