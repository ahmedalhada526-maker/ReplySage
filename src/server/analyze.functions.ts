import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  text: z.string().min(1).max(8000),
  language: z.enum(["en", "ar"]).default("en"),
});

export interface AnalysisResult {
  pulse: {
    recipientPersona: string;
    currentDynamic: string;
    hiddenNeeds: string;
    advancedInsights: string;
    personalityTraits: {
      mbti?: string;
      bigFive?: string;
      enneagram?: string;
    };
  };
  strategies: {
    tactician: { response: string; whyItWorks: string };
    empath: { response: string; whyItWorks: string };
    alpha: { response: string; whyItWorks: string };
    savage: { response: string; whyItWorks: string };
  };
}

export const analyzeInteraction = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<{ result: AnalysisResult | null; error: string | null }> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      console.error("LOVABLE_API_KEY missing");
      return { result: null, error: "AI is not configured." };
    }

    const langName = data.language === "ar" ? "Arabic (العربية)" : "English";

    const systemPrompt = `You are PersonaPulse AI — a master of behavioral psychology, linguistic forensics, and strategic communication. Analyze text-based human interactions surgically and return ONLY structured data through the provided tool. Be concise, sharp, and never repeat the input text. All textual values MUST be written in ${langName}.`;

    const userPrompt = `Analyze this interaction and provide a forensic psychological breakdown plus three strategic response options (Tactician = logic-focused, Empath = emotion-focused, Alpha = boundary-focused). All output values must be in ${langName}.\n\nINPUT:\n"""\n${data.text}\n"""`;

    const tools = [
      {
        type: "function" as const,
        function: {
          name: "submit_pulse_analysis",
          description: "Submit the forensic psychological analysis and three strategic responses.",
          parameters: {
            type: "object",
            properties: {
              pulse: {
                type: "object",
                properties: {
                  recipientPersona: { type: "string", description: "2-sentence psychological profile" },
                  currentDynamic: { type: "string", description: "Description of the power dynamic, plea, conflict, etc." },
                  hiddenNeeds: { type: "string", description: "What they actually want but aren't saying" },
                  advancedInsights: { type: "string", description: "Deep manipulation tactics or vulnerabilities (Pro tier)" },
                  personalityTraits: {
                    type: "object",
                    properties: {
                      mbti: { type: "string", description: "Likely MBTI type, e.g. ENTJ" },
                      bigFive: { type: "string", description: "Key Big Five traits, e.g. High N, Low A" },
                      enneagram: { type: "string", description: "Likely Enneagram type, e.g. Type 8" },
                    },
                    required: ["mbti", "bigFive", "enneagram"],
                    additionalProperties: false,
                  },
                },
                required: [
                  "recipientPersona",
                  "currentDynamic",
                  "hiddenNeeds",
                  "advancedInsights",
                  "personalityTraits",
                ],
                additionalProperties: false,
              },
              strategies: {
                type: "object",
                properties: {
                  tactician: {
                    type: "object",
                    properties: {
                      response: { type: "string" },
                      whyItWorks: { type: "string" },
                    },
                    required: ["response", "whyItWorks"],
                    additionalProperties: false,
                  },
                  empath: {
                    type: "object",
                    properties: {
                      response: { type: "string" },
                      whyItWorks: { type: "string" },
                    },
                    required: ["response", "whyItWorks"],
                    additionalProperties: false,
                  },
                  alpha: {
                    type: "object",
                    properties: {
                      response: { type: "string" },
                      whyItWorks: { type: "string" },
                    },
                    required: ["response", "whyItWorks"],
                    additionalProperties: false,
                  },
                },
                required: ["tactician", "empath", "alpha"],
                additionalProperties: false,
              },
            },
            required: ["pulse", "strategies"],
            additionalProperties: false,
          },
        },
      },
    ];

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          tools,
          tool_choice: { type: "function", function: { name: "submit_pulse_analysis" } },
        }),
      });

      if (!res.ok) {
        if (res.status === 429) return { result: null, error: "rate_limit" };
        if (res.status === 402) return { result: null, error: "credits" };
        const txt = await res.text();
        console.error("AI gateway error", res.status, txt);
        return { result: null, error: "generic" };
      }

      const json = await res.json();
      const toolCall = json.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall?.function?.arguments) {
        console.error("No tool call in response", JSON.stringify(json).slice(0, 500));
        return { result: null, error: "generic" };
      }

      const parsed = JSON.parse(toolCall.function.arguments) as AnalysisResult;
      return { result: parsed, error: null };
    } catch (e) {
      console.error("analyzeInteraction failed", e);
      return { result: null, error: "generic" };
    }
  });
