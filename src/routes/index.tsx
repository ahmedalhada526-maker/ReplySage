import { createFileRoute } from "@tanstack/react-router";
import { PersonaWorkspace } from "@/components/persona/PersonaWorkspace";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Reply Generator — Smart Response Writer for Any Message | PersonaPulse AI" },
      {
        name: "description",
        content:
          "Free AI reply generator: paste any message, chat, or screenshot and get 4 smart, ready-to-send responses in seconds. Choose your tone — romantic, bold, cold, smart, or firm. Arabic & English.",
      },
      { name: "keywords", content: "AI reply generator, smart reply, response writer, message reply AI, chat reply generator, WhatsApp reply AI, صياغة الردود بالذكاء الاصطناعي, مولد ردود ذكية, مساعد ردود واتساب" },
      { property: "og:title", content: "AI Reply Generator — Smart Response Writer for Any Message" },
      {
        property: "og:description",
        content:
          "Paste any message and get 4 AI-crafted replies in your chosen tone in under 10 seconds. The smart response writer trusted for chats, DMs, and email.",
      },
      { property: "og:url", content: "https://person-plus-ai.lovable.app/" },
      { name: "twitter:title", content: "AI Reply Generator — Smart Response Writer for Any Message" },
      {
        name: "twitter:description",
        content:
          "Paste any message. Get 4 AI-crafted replies tuned to your tone in seconds. Arabic · English native.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://person-plus-ai.lovable.app/" },
    ],
  }),

  component: PersonaWorkspace,
});
