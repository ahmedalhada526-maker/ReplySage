import { createFileRoute } from "@tanstack/react-router";
import { PersonaWorkspace } from "@/components/persona/PersonaWorkspace";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PersonaPulse AI — Decode Any Conversation in Seconds" },
      {
        name: "description",
        content:
          "Forensic AI that reads between the lines. Detect manipulation, expose hidden intent, profile personality, and craft the perfect reply — trusted by negotiators, founders, and creators worldwide.",
      },
      { property: "og:title", content: "PersonaPulse AI — Read Between the Lines" },
      {
        property: "og:description",
        content:
          "Paste any message. Uncover manipulation tactics, psychological triggers, and hidden motives — then get four surgically crafted responses in seconds.",
      },
      { property: "og:url", content: "https://person-plus-ai.lovable.app/" },
    ],
    links: [
      { rel: "canonical", href: "https://person-plus-ai.lovable.app/" },
    ],
  }),
  component: PersonaWorkspace,
});
