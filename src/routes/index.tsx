import { createFileRoute } from "@tanstack/react-router";
import { PersonaWorkspace } from "@/components/persona/PersonaWorkspace";

const SITE = "https://person-plus-ai.lovable.app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "مولّد الردود الذكية بالذكاء الاصطناعي | ReplySage" },
      {
        name: "description",
        content:
          "مولّد ردود بالذكاء الاصطناعي مجاناً: ألصق أي رسالة أو محادثة أو لقطة شاشة واحصل على ٤ ردود ذكية جاهزة للإرسال خلال ثوانٍ، مع اختيار النبرة — رومانسي، جريء، بارد، ذكي، أو حازم.",
      },
      {
        name: "keywords",
        content:
          "مولد ردود ذكية, صياغة الردود بالذكاء الاصطناعي, مساعد ردود واتساب, كيف أرد على رسالة, ردود جاهزة, AI reply generator, response writer",
      },
      { property: "og:locale", content: "ar_AR" },
      { property: "og:locale:alternate", content: "en_US" },
      { property: "og:title", content: "مولّد الردود الذكية بالذكاء الاصطناعي | ReplySage" },
      {
        property: "og:description",
        content:
          "ألصق أي رسالة واحصل على ٤ ردود مصاغة بالذكاء الاصطناعي بالنبرة التي تختارها خلال أقل من ١٠ ثوانٍ — للمحادثات والرسائل والبريد.",
      },
      { property: "og:url", content: `${SITE}/` },
      { name: "twitter:title", content: "مولّد الردود الذكية بالذكاء الاصطناعي | ReplySage" },
      {
        name: "twitter:description",
        content: "ألصق أي رسالة واحصل على ٤ ردود ذكية بالنبرة المناسبة خلال ثوانٍ. عربي · إنجليزي.",
      },
    ],
    links: [
      { rel: "canonical", href: `${SITE}/` },
      { rel: "alternate", hrefLang: "ar", href: `${SITE}/` },
      { rel: "alternate", hrefLang: "en", href: `${SITE}/en` },
      { rel: "alternate", hrefLang: "x-default", href: `${SITE}/` },
    ],
  }),

  component: PersonaWorkspace,
});
