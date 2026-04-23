import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { checkRateLimit } from "./rate-limit";
import { callAIChat } from "./ai-provider";

const InputSchema = z.object({
  text: z.string().min(1).max(8000),
  language: z.enum(["en", "ar"]).default("en"),
});

const SavageInputSchema = z.object({
  text: z.string().min(1).max(8000),
  language: z.enum(["en", "ar"]).default("en"),
  recipientPersona: z.string().max(2000).optional(),
  previousResponses: z.array(z.string().max(2000)).max(5).default([]),
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
    // Rate limit: 10 analyses per minute per IP to prevent credit drain abuse.
    const rl = checkRateLimit("analyze", 10, 60_000);
    if (!rl.ok) {
      return { result: null, error: "rate_limit" };
    }

    if (!process.env.LOVABLE_API_KEY && !process.env.GEMINI_API_KEY) {
      console.error("No AI key configured (LOVABLE_API_KEY or GEMINI_API_KEY)");
      return { result: null, error: "AI is not configured." };
    }

    const langName = data.language === "ar" ? "Arabic (العربية)" : "English";

    const systemPrompt = `You are PersonaPulse AI — a master of behavioral psychology, linguistic forensics, viral internet culture, and strategic communication. You have studied the most devastating verbal takedowns from Twitter/X, Reddit r/MurderedByWords, viral TikTok clapbacks, and legendary celebrity feuds. You understand the anatomy of replies that go viral because they hit so hard the opponent has no recovery. Analyze interactions surgically and return ONLY structured data through the provided tool. Be concise, sharp, never repeat the input text. All textual values MUST be written in ${langName}.`;

    const userPrompt = `Analyze this interaction and provide a forensic psychological breakdown plus FOUR strategic response options:
- Tactician = logic-focused
- Empath = emotion-focused
- Alpha = boundary-focused
- Savage (الرد المفحم) = THE KNOCKOUT REPLY. This must be a verbal guillotine — the kind of reply that gets screenshotted and goes viral on Twitter/X, Reddit, and TikTok. Study the patterns of legendary clapbacks:
  
  TECHNIQUES TO MASTER:
  1. **Mirror & Magnify**: Take their exact attack and reflect it back so it exposes THEIR insecurity (e.g., they call you "obsessed" → "Says the person who typed 4 paragraphs about me at 2am").
  2. **The Surgical One-Liner**: Brutally short. The shorter and colder, the more devastating. Long replies = you care. Short replies = they're beneath you.
  3. **Expose The Tell**: Identify the psychological "tell" in their message (insecurity, projection, desperation for validation, pick-me energy, inferiority complex) and name it without naming it.
  4. **The Pity Frame**: Reframe their attack as embarrassing for THEM. Make them look like they're trying too hard, or seeking attention they didn't earn.
  5. **Dead Calm Energy**: Zero emotion. Zero exclamation marks. Zero anger. Pure clinical detachment — this is what destroys ego the most because it signals "you're not even worth my heartbeat."
  6. **The Receipt Move**: Use their own words/logic against them with a single precise question they CANNOT answer without humiliating themselves.
  7. **Status Inversion**: Subtly establish that you operate at a level they cannot reach — without bragging. Imply, never declare.
  
  STRICT RULES:
  - NO profanity, NO slurs, NO threats, NO body-shaming, NO family insults.
  - NO clichés ("ratio", "L + ratio", "cope", "seethe" — these are weak and overused).
  - The reply should feel like it was crafted by someone who has already won and is just confirming it.
  - Length: ideally 1-2 sentences. Maximum 3. Every word must cut.
  - It must be re-usable on social media as a viral comeback.
  
  In whyItWorks: explain the EXACT psychological mechanism (which technique above + which weakness in the recipient's persona it exploits + why they cannot recover from it).

All output values must be in ${langName}.\n\nINPUT:\n"""\n${data.text}\n"""`;

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
                  savage: {
                    type: "object",
                    description: "Viral-grade knockout reply. Short, surgical, dead-calm. Inspired by the most devastating clapbacks on Twitter/X and Reddit. Mirror-and-magnify, expose-the-tell, status-inversion. NO profanity, NO clichés, NO emotional leakage. Every word must cut.",
                    properties: {
                      response: { type: "string", description: "The knockout reply itself. Ideally 1-2 sentences, max 3. Should be screenshot-worthy." },
                      whyItWorks: { type: "string", description: "Name the exact technique used + which psychological weakness in the recipient it exploits + why they cannot recover." },
                    },
                    required: ["response", "whyItWorks"],
                    additionalProperties: false,
                  },
                },
                required: ["tactician", "empath", "alpha", "savage"],
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
      const res = await callAIChat({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools,
        tool_choice: { type: "function", function: { name: "submit_pulse_analysis" } },
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

export const regenerateSavage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SavageInputSchema.parse(input))
  .handler(async ({ data }): Promise<{ response: string | null; whyItWorks: string | null; error: string | null }> => {
    // Rate limit: 15 regenerations per minute per IP to prevent credit drain abuse.
    const rl = checkRateLimit("savage", 15, 60_000);
    if (!rl.ok) {
      return { response: null, whyItWorks: null, error: "rate_limit" };
    }

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) return { response: null, whyItWorks: null, error: "AI is not configured." };

    const langName = data.language === "ar" ? "Arabic (العربية)" : "English";

    const avoidBlock = data.previousResponses.length
      ? `\n\nAVOID these previously generated responses (do NOT repeat their angle, structure, or wording — produce something fundamentally different):\n${data.previousResponses.map((r, i) => `${i + 1}. "${r}"`).join("\n")}`
      : "";

    const personaBlock = data.recipientPersona
      ? `\n\nRECIPIENT PROFILE (use this to target their specific weaknesses):\n${data.recipientPersona}`
      : "";

    const systemPrompt = `You are PersonaPulse AI's Silencer module — a specialist in viral, psychologically devastating clapbacks. You have studied legendary verbal takedowns from Twitter/X, Reddit r/MurderedByWords, viral TikTok comebacks, and celebrity feuds. Your replies are screenshot-worthy: surgical, dead-calm, ego-piercing. NO profanity, NO slurs, NO body/family insults, NO clichés like "ratio/cope/seethe". Output ONLY through the provided tool. All textual values MUST be written in ${langName}.`;

    const userPrompt = `Generate ONE alternative knockout reply to the following message. It must use a DIFFERENT angle than typical replies. Pick ONE technique and execute it perfectly: Mirror & Magnify, Surgical One-Liner, Expose The Tell, Pity Frame, Dead Calm Energy, Receipt Move, or Status Inversion.

Length: 1-2 sentences max 3. Every word must cut. Should feel like it was written by someone who already won.${personaBlock}${avoidBlock}

INPUT MESSAGE:\n"""\n${data.text}\n"""`;

    const tools = [
      {
        type: "function" as const,
        function: {
          name: "submit_savage_alternative",
          description: "Submit a single alternative savage reply.",
          parameters: {
            type: "object",
            properties: {
              response: { type: "string", description: "The knockout reply itself. 1-3 sentences max." },
              whyItWorks: { type: "string", description: "The exact technique used + the psychological weakness it exploits." },
            },
            required: ["response", "whyItWorks"],
            additionalProperties: false,
          },
        },
      },
    ];

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-pro",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          tools,
          tool_choice: { type: "function", function: { name: "submit_savage_alternative" } },
          temperature: 1.1,
        }),
      });

      if (!res.ok) {
        if (res.status === 429) return { response: null, whyItWorks: null, error: "rate_limit" };
        if (res.status === 402) return { response: null, whyItWorks: null, error: "credits" };
        console.error("AI gateway error", res.status, await res.text());
        return { response: null, whyItWorks: null, error: "generic" };
      }

      const json = await res.json();
      const toolCall = json.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall?.function?.arguments) {
        return { response: null, whyItWorks: null, error: "generic" };
      }
      const parsed = JSON.parse(toolCall.function.arguments) as { response: string; whyItWorks: string };
      return { response: parsed.response, whyItWorks: parsed.whyItWorks, error: null };
    } catch (e) {
      console.error("regenerateSavage failed", e);
      return { response: null, whyItWorks: null, error: "generic" };
    }
  });
