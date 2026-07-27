import { createFileRoute } from "@tanstack/react-router";
import { PersonaWorkspace } from "@/components/persona/PersonaWorkspace";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PersonaPulse AI — Your Personal AI Reply Coach" },
      {
        name: "description",
        content:
          "Never wonder what to reply again. Paste any message, chat, or screenshot and get 4 AI-crafted replies in your chosen tone — romantic, bold, cold, smart, or firm — in under 10 seconds.",
      },
      { property: "og:title", content: "PersonaPulse AI — Craft the Perfect Reply, Every Time" },
      {
        property: "og:description",
        content:
          "The AI reply studio for modern conversations. Choose your tone, get 4 ready-to-send responses with clear reasoning, and know exactly why each one lands before you hit send.",
      },
      { property: "og:url", content: "https://person-plus-ai.lovable.app/" },
      { name: "twitter:title", content: "PersonaPulse AI — Craft the Perfect Reply, Every Time" },
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
