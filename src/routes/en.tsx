import { createFileRoute } from "@tanstack/react-router";
import { I18nextProvider } from "react-i18next";
import { PersonaWorkspace } from "@/components/persona/PersonaWorkspace";
import { getI18nForLang } from "@/lib/i18n";

const SITE = "https://replysage.lovable.app";

export const Route = createFileRoute("/en")({
  head: () => ({
    meta: [
      { title: "AI Reply Generator & Response Writer | ReplySage" },
      {
        name: "description",
        content:
          "Free AI reply generator: paste any message, chat, or screenshot and get 4 smart, ready-to-send responses in seconds. Choose your tone — romantic, bold, cold, smart, or firm.",
      },
      {
        name: "keywords",
        content:
          "AI reply generator, smart reply, response writer, message reply AI, chat reply generator, WhatsApp reply AI",
      },
      { property: "og:locale", content: "en_US" },
      { property: "og:locale:alternate", content: "ar_AR" },
      { property: "og:title", content: "AI Reply Generator & Response Writer | ReplySage" },
      {
        property: "og:description",
        content:
          "Paste any message and get 4 AI-crafted replies in your chosen tone in under 10 seconds. The smart response writer trusted for chats, DMs, and email.",
      },
      { property: "og:url", content: `${SITE}/en` },
      { name: "twitter:title", content: "AI Reply Generator & Response Writer | ReplySage" },
      {
        name: "twitter:description",
        content: "Paste any message. Get 4 AI-crafted replies tuned to your tone in seconds.",
      },
    ],
    links: [
      { rel: "canonical", href: `${SITE}/en` },
      { rel: "alternate", hrefLang: "en", href: `${SITE}/en` },
      { rel: "alternate", hrefLang: "ar", href: `${SITE}/` },
      { rel: "alternate", hrefLang: "x-default", href: `${SITE}/` },
    ],
  }),
  component: EnglishHome,
});

function EnglishHome() {
  return (
    <I18nextProvider i18n={getI18nForLang("en")}>
      <PersonaWorkspace />
    </I18nextProvider>
  );
}
