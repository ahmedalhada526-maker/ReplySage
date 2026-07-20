import { createFileRoute } from "@tanstack/react-router";
import { PersonaWorkspace } from "@/components/persona/PersonaWorkspace";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PersonaPulse AI — Master the subtext of human interaction" },
      {
        name: "description",
        content:
          "Forensic AI for behavioral psychology. Decode hidden intentions, personality traits, and architect strategic responses that bypass resistance.",
      },
      { property: "og:title", content: "PersonaPulse AI — The Unfair Advantage" },
      {
        property: "og:description",
        content:
          "Linguistic forensics, subtext decoding, and strategic response architecture, powered by AI.",
      },
      { property: "og:url", content: "https://person-plus-ai.lovable.app/" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://person-plus-ai.lovable.app/" },
    ],
  }),
  component: PersonaWorkspace,
});
