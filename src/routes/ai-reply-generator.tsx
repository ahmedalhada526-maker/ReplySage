import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Clock, Languages, ShieldCheck, MessageSquareText, Wand2 } from "lucide-react";

const URL = "https://person-plus-ai.lovable.app/ai-reply-generator";

const TITLE = "AI Reply Generator — Write the Perfect Response in Seconds";
const DESCRIPTION =
  "Free AI reply generator for texts, DMs, WhatsApp and email. Paste any message, choose a tone, and get four ready-to-send responses with reasoning. Arabic & English.";

export const Route = createFileRoute("/ai-reply-generator")({
  head: () => ({
    meta: [
      { title: `${TITLE} | PersonaPulse AI` },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "ai reply generator, ai response generator, smart reply generator, message reply ai, whatsapp reply generator, email reply generator, professional response generator",
      },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL },
      { property: "og:type", content: "article" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "PersonaPulse AI Reply Generator",
          applicationCategory: "CommunicationApplication",
          operatingSystem: "Web, Android, iOS",
          url: URL,
          description: DESCRIPTION,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          featureList: [
            "Four reply variants per message",
            "Tone control: romantic, bold, cold, smart, firm",
            "Screenshot and conversation input",
            "Intent and subtext explanation",
            "Arabic and English support",
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to generate a reply with AI",
          step: [
            { "@type": "HowToStep", name: "Paste", text: "Paste the message, chat thread, or screenshot you received." },
            { "@type": "HowToStep", name: "Tune", text: "Pick the tone that fits: romantic, bold, cold, smart, or firm." },
            { "@type": "HowToStep", name: "Send", text: "Review four ready-to-send replies with reasoning and copy the best one." },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is an AI reply generator?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "An AI reply generator reads a message you received and writes response options for you. PersonaPulse AI goes further: it reads the sender's intent and subtext first, then produces four replies in the tone you choose, each with a short explanation of why it works.",
              },
            },
            {
              "@type": "Question",
              name: "Is the AI reply generator free?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. You get free daily replies with no account required. Heavier usage is available through the in-app upgrade.",
              },
            },
            {
              "@type": "Question",
              name: "Can it generate replies in Arabic?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. PersonaPulse AI writes natively in both Arabic and English, matching the dialect and register of the original conversation instead of translating word for word.",
              },
            },
            {
              "@type": "Question",
              name: "Can I use it for work emails and LinkedIn messages?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Choose the smart or firm tone for professional contexts — the generator keeps the response concise, neutral and free of the phrasing that escalates a thread.",
              },
            },
            {
              "@type": "Question",
              name: "Are my messages stored?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Your conversation history stays on your own device in local storage. Messages are sent to the AI model only to produce your replies.",
              },
            },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://person-plus-ai.lovable.app/" },
            { "@type": "ListItem", position: 2, name: "AI Reply Generator", item: URL },
          ],
        }),
      },
    ],
  }),
  component: AiReplyGeneratorPage,
});

const useCases = [
  {
    icon: MessageSquareText,
    title: "Texts & DMs",
    body: "A message lands and you re-read it five times. Paste it, pick a tone, and get a reply that says exactly what you meant without the three drafts you deleted.",
  },
  {
    icon: Wand2,
    title: "Dating conversations",
    body: "Charming without trying too hard, or a clean close when the thread has run its course. Tone control is the whole point — the same message gets a warm or a cold answer.",
  },
  {
    icon: ShieldCheck,
    title: "Difficult or loaded messages",
    body: "Guilt trips, passive aggression, moving goalposts. The generator names the tactic first, then writes a firm reply that holds the line without escalating.",
  },
  {
    icon: Languages,
    title: "Work email & LinkedIn",
    body: "Professional replies that stay short, neutral and final. Useful when the honest first draft is the one you should never send.",
  },
];

const steps = [
  { n: "01", title: "Paste the message", body: "Text, a full chat thread, or a screenshot — the reader pulls the text out for you." },
  { n: "02", title: "Choose your tone", body: "Romantic, bold, cold, smart, or firm. Add context about the other person for sharper output." },
  { n: "03", title: "Send with confidence", body: "Four reply variants, each with a one-line read of why it lands. Copy and go." },
];

const faqs = [
  {
    q: "What is an AI reply generator?",
    a: "It reads a message you received and writes response options for you. PersonaPulse AI reads the sender's intent and subtext first, then produces four replies in the tone you choose — each with a short explanation of why it works.",
  },
  {
    q: "Is it free?",
    a: "Yes. Free daily replies, no account required. Heavier usage is available through the in-app upgrade.",
  },
  {
    q: "Does it work in Arabic?",
    a: "Yes — natively. Replies match the dialect and register of the original conversation instead of reading like a translation.",
  },
  {
    q: "Can I use it for work emails?",
    a: "Yes. The smart and firm tones keep responses concise, neutral, and free of phrasing that escalates a thread.",
  },
  {
    q: "Are my messages stored?",
    a: "Your history stays on your own device in local storage. Messages reach the AI model only to produce your replies.",
  },
];

function AiReplyGeneratorPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <nav aria-label="Breadcrumb" className="mb-10 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span className="mx-2 opacity-40">/</span>
          <span className="text-foreground/80">AI Reply Generator</span>
        </nav>

        <header>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
            <Sparkles className="h-3 w-3" />
            Free · No account
          </div>
          <h1 className="mt-6 text-3xl sm:text-5xl font-extrabold leading-[1.15] tracking-tight">
            AI Reply Generator — write the perfect response in seconds
          </h1>
          <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground">
            Paste any message, chat thread, or screenshot. PersonaPulse AI reads what the sender actually
            means, then writes four ready-to-send replies in the tone you pick — romantic, bold, cold,
            smart, or firm — with a one-line reason behind each. Arabic and English, under ten seconds.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Generate a reply now
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Replies in under 10 seconds
            </span>
          </div>
        </header>

        <section className="mt-16" aria-labelledby="how-it-works">
          <h2 id="how-it-works" className="text-xl font-bold tracking-tight">
            How the reply generator works
          </h2>
          <ol className="mt-6 space-y-4">
            {steps.map((s) => (
              <li key={s.n} className="glass-obsidian flex gap-4 rounded-2xl p-5">
                <span className="text-sm font-black text-primary/70">{s.n}</span>
                <div>
                  <h3 className="text-sm font-bold">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16" aria-labelledby="use-cases">
          <h2 id="use-cases" className="text-xl font-bold tracking-tight">
            What people generate replies for
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {useCases.map(({ icon: Icon, title, body }) => (
              <article key={title} className="glass-obsidian rounded-2xl p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="mt-4 text-sm font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="difference">
          <h2 id="difference" className="text-xl font-bold tracking-tight">
            Why it beats a generic chatbot prompt
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            A general-purpose chatbot answers the question you typed. A reply generator answers the
            conversation you are actually in. PersonaPulse AI starts by reading intent — what the sender
            wants, what they left unsaid, and how much pressure the message is applying — and only then
            drafts language. That ordering is why the output sounds like a person who understood the
            room, not a template.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            You also get four variants rather than one. Picking between a warm, a decisive, and a
            withdrawn version of the same answer is usually faster than editing a single draft into
            shape — and it makes the tradeoff between them explicit before you send.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            If the message you received feels engineered rather than careless, the{" "}
            <Link to="/tactics-guide" className="text-primary underline underline-offset-4">
              manipulation tactics guide
            </Link>{" "}
            covers the patterns worth naming before you answer.
          </p>
        </section>

        <section className="mt-16" aria-labelledby="faq">
          <h2 id="faq" className="text-xl font-bold tracking-tight">
            Frequently asked questions
          </h2>
          <dl className="mt-6 space-y-5">
            {faqs.map(({ q, a }) => (
              <div key={q} className="border-b border-foreground/5 pb-5">
                <dt className="text-sm font-bold">{q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-16 glass-obsidian rounded-3xl p-8 text-center">
          <h2 className="text-lg font-bold tracking-tight">Stop rewriting the same message</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Paste it once and get four replies you would actually send.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            Open the reply studio
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
