import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Brain, Shield, Eye, Zap, AlertTriangle, Sparkles } from "lucide-react";

const URL = "https://person-plus-ai.lovable.app/tactics-guide";

export const Route = createFileRoute("/tactics-guide")({
  head: () => ({
    meta: [
      { title: "Manipulation Tactics Guide | ReplySage" },
      {
        name: "description",
        content:
          "A practical guide to identifying manipulation tactics in conversations — and how AI decodes hidden intent in real messages.",
      },
      { property: "og:title", content: "Manipulation Tactics Guide | ReplySage" },
      {
        property: "og:description",
        content:
          "Learn the linguistic patterns behind dark psychology — and how to spot them in real messages.",
      },
      { property: "og:url", content: URL },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Manipulation Tactics Guide — How to Identify & Decode Dark Psychology",
          description:
            "A practical guide to identifying manipulation tactics — gaslighting, guilt-tripping, love bombing, DARVO — and how AI can decode hidden intent in real conversations.",
          author: { "@type": "Organization", name: "ReplySage" },
          publisher: { "@type": "Organization", name: "ReplySage" },
          mainEntityOfPage: URL,
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
              name: "What are the most common manipulation tactics?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Gaslighting, guilt-tripping, love bombing, DARVO (Deny, Attack, Reverse Victim and Offender), silent treatment, triangulation, and moving the goalposts are the most frequently observed linguistic manipulation tactics.",
              },
            },
            {
              "@type": "Question",
              name: "How can I identify manipulation in a text message?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Look for shifted responsibility, absolute language ('you always', 'you never'), invalidation of your feelings, sudden withdrawal, and reframing of shared events. AI-assisted linguistic analysis can surface these patterns objectively.",
              },
            },
            {
              "@type": "Question",
              name: "Is dark psychology the same as manipulation?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Dark psychology is the broader study of manipulative, coercive, and deceptive persuasion. Manipulation tactics are its concrete tools — the specific linguistic and behavioral moves used to influence someone against their interest.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: TacticsGuidePage,
});

const tactics = [
  {
    icon: Brain,
    name: "Gaslighting",
    signals: '"That never happened." · "You\'re imagining things." · "You\'re too sensitive."',
    decode:
      "Denies your reality to make you doubt your own memory and perception. Watch for confident denials of documented events.",
  },
  {
    icon: AlertTriangle,
    name: "Guilt-tripping",
    signals: '"After everything I\'ve done for you..." · "I guess I\'m just a bad person then."',
    decode:
      "Weaponizes obligation and shame to force compliance. Requests are framed as debts you owe.",
  },
  {
    icon: Sparkles,
    name: "Love bombing",
    signals: 'Overwhelming affection early. Rapid escalation. "I\'ve never felt this with anyone."',
    decode:
      "Manufactures intense intimacy to bypass your judgment. Intensity replaces consistency.",
  },
  {
    icon: Shield,
    name: "DARVO",
    signals: "Deny → Attack → Reverse Victim and Offender.",
    decode:
      "When confronted, they deny the behavior, attack you for raising it, and cast themselves as the wronged party.",
  },
  {
    icon: Eye,
    name: "Silent treatment",
    signals: "Sudden withdrawal after conflict. No explanation. Delayed replies as punishment.",
    decode:
      "Uses absence as pressure. The ambiguity is the point — it forces you to fill the silence with self-blame.",
  },
  {
    icon: Zap,
    name: "Moving the goalposts",
    signals: "You meet a condition — a new one appears. Standards keep shifting.",
    decode:
      "Ensures you can never satisfy them. The finish line moves because the goal is your effort, not the outcome.",
  },
];

function TacticsGuidePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <article className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <nav className="mb-10 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Tactics Guide</span>
        </nav>

        <header className="mb-12">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-primary/80">Field Guide</p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Manipulation Tactics: How to Identify Dark Psychology in Everyday Conversation
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Manipulation rarely announces itself. It hides inside familiar phrases —
            reasonable-sounding messages engineered to shift blame, extract compliance, or
            destabilize your reality. This guide breaks down the six most common linguistic
            manipulation tactics and how to spot them before they land.
          </p>
        </header>

        <section className="mb-12 space-y-4">
          <h2 className="text-2xl font-semibold">Why linguistic patterns matter</h2>
          <p className="text-muted-foreground">
            Manipulation is a language game. The tactics below aren't personality flaws — they're
            repeatable rhetorical moves. Once you recognize the structure, the emotional charge
            loses power and the intent becomes visible.
          </p>
        </section>

        <section className="mb-12 space-y-6">
          <h2 className="text-2xl font-semibold">The six tactics to know</h2>
          <div className="grid gap-4">
            {tactics.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur"
              >
                <div className="flex items-center gap-3">
                  <t.icon className="h-5 w-5 text-primary" aria-hidden />
                  <h3 className="text-xl font-semibold">{t.name}</h3>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Signals: </span>
                  {t.signals}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Decode: </span>
                  {t.decode}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 space-y-4">
          <h2 className="text-2xl font-semibold">How to identify manipulation in real time</h2>
          <ol className="list-decimal space-y-3 pl-6 text-muted-foreground">
            <li>
              <span className="text-foreground">Track responsibility.</span> Who is being positioned
              as the cause of the conflict? Manipulative messages quietly re-assign blame.
            </li>
            <li>
              <span className="text-foreground">Notice absolutes.</span> "Always," "never,"
              "everyone thinks" — absolute language collapses nuance and forces a defensive stance.
            </li>
            <li>
              <span className="text-foreground">Check your body.</span> Sudden fog, guilt, or
              urgency to explain yourself often means a tactic has landed.
            </li>
            <li>
              <span className="text-foreground">Re-read without emotion.</span> If the same sentence
              read by a stranger would sound unreasonable, trust that read.
            </li>
          </ol>
        </section>

        <section className="mb-12 space-y-4">
          <h2 className="text-2xl font-semibold">How ReplySage decodes it</h2>
          <p className="text-muted-foreground">
            ReplySage runs forensic linguistic analysis on the exact message you received. It
            surfaces the underlying tactic, quantifies a manipulation index, extracts the sender's
            likely motives, and drafts a strategic response tuned to your relationship and goal — so
            you answer from clarity, not reflex.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Analyze a real message
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="space-y-4 border-t border-border/60 pt-10">
          <h2 className="text-2xl font-semibold">Frequently asked</h2>
          <div>
            <h3 className="font-semibold">What are the most common manipulation tactics?</h3>
            <p className="mt-1 text-muted-foreground">
              Gaslighting, guilt-tripping, love bombing, DARVO, silent treatment, triangulation, and
              moving the goalposts.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">How can I identify manipulation in a text message?</h3>
            <p className="mt-1 text-muted-foreground">
              Look for shifted responsibility, absolute language, invalidation of your feelings, and
              reframed events. AI-assisted analysis surfaces those patterns objectively.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Is dark psychology the same as manipulation?</h3>
            <p className="mt-1 text-muted-foreground">
              Dark psychology is the broader study of coercive persuasion; manipulation tactics are
              its concrete linguistic tools.
            </p>
          </div>
        </section>
      </article>
    </div>
  );
}
