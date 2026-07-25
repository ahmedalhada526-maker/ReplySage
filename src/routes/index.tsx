import { createFileRoute } from "@tanstack/react-router";
import { PersonaWorkspace } from "@/components/persona/PersonaWorkspace";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PersonaPulse AI — Craft the Perfect Reply to Any Message" },
      {
        name: "description",
        content:
          "AI reply coach that writes the perfect response to any message, chat, or screenshot. Choose your tone, get 4 ready-to-send replies, and know exactly why each one works.",
      },
      { property: "og:title", content: "PersonaPulse AI — Never Wonder What to Reply Again" },
      {
        property: "og:description",
        content:
          "Paste any message. Get 4 AI-crafted replies tuned to your tone — romantic, bold, cold, smart, or firm — with clear reasoning before you send.",
      },
      { property: "og:url", content: "https://person-plus-ai.lovable.app/" },
    ],
    links: [
      { rel: "canonical", href: "https://person-plus-ai.lovable.app/" },
    ],
  }),

  component: PersonaWorkspace,
});
