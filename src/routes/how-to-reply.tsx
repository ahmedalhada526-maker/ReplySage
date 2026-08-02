import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

const URL = "https://person-plus-ai.lovable.app/how-to-reply";

const TITLE = "How to Reply to Any Message: 12 Examples";
const DESCRIPTION =
  "What to reply when someone is cold, guilt-tripping, ghosting, or pushing back at work. Twelve real situations with a reply framework and example wording you can send.";

export const Route = createFileRoute("/how-to-reply")({
  head: () => ({
    meta: [
      { title: `${TITLE} | ReplySage` },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "how to reply, what to reply, reply examples, how to respond to a rude message, how to reply to ghosting, professional response examples, كيف أرد على رسالة",
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
          "@type": "Article",
          headline: TITLE,
          description: DESCRIPTION,
          author: { "@type": "Organization", name: "ReplySage" },
          publisher: { "@type": "Organization", name: "ReplySage" },
          mainEntityOfPage: URL,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://person-plus-ai.lovable.app/",
            },
            { "@type": "ListItem", position: 2, name: "How to Reply", item: URL },
          ],
        }),
      },
    ],
  }),
  component: HowToReplyPage,
});

const groups: Array<{
  group: string;
  items: Array<{ situation: string; read: string; reply: string }>;
}> = [
  {
    group: "When the message is cold or distant",
    items: [
      {
        situation: "One-word answers after a warm conversation",
        read: "Withdrawal is usually a request for reassurance or an exit being tested — rarely a neutral event.",
        reply:
          "“Feels like the energy shifted. I'd rather hear it straight than guess — what's going on?”",
      },
      {
        situation: "They stopped replying for days, then wrote as if nothing happened",
        read: "Ignoring the gap sets the precedent that gaps cost nothing.",
        reply:
          "“Good to hear from you. Honestly, the silence was loud — I need consistency more than explanations.”",
      },
      {
        situation: "Polite but formal after a disagreement",
        read: "Formality is distance in costume. Naming it beats matching it.",
        reply:
          "“We're being very polite with each other. I'd rather clear the actual thing — can we?”",
      },
    ],
  },
  {
    group: "When the message is loaded",
    items: [
      {
        situation: "Guilt-tripping — “after everything I did for you”",
        read: "The ledger is being used as leverage. Acknowledge the fact, decline the debt.",
        reply:
          "“I appreciate what you've done, and it doesn't obligate me to agree here. Those are separate things.”",
      },
      {
        situation: "“You're overreacting”",
        read: "Your response is being made the subject so the original issue disappears.",
        reply:
          "“My reaction is mine to judge. The thing I raised is still on the table — let's stay on it.”",
      },
      {
        situation: "An apology that blames you inside it",
        read: "A conditional apology is a re-accusation with softer punctuation.",
        reply: "“I'll take the apology. The part after 'but' isn't one, so let's leave it out.”",
      },
      {
        situation: "Silent treatment after a request",
        read: "Silence is a bid for you to withdraw the request. Repeat it calmly instead.",
        reply: "“I'm not going to chase this. The ask stands whenever you're ready to answer it.”",
      },
    ],
  },
  {
    group: "When it's about attraction",
    items: [
      {
        situation: "They're clearly interested but not committing",
        read: "Ambiguity is comfortable for whoever benefits from it. Make it cost something.",
        reply:
          "“I like where this is going, and I don't do maybes well. Tell me what you actually want.”",
      },
      {
        situation: "A flirty message you want to match without overplaying it",
        read: "Match the temperature, add one degree — not five.",
        reply: "“You're trouble. Fortunately I've got nothing better on.”",
      },
      {
        situation: "You want to close it out cleanly",
        read: "Clean endings are shorter than justified ones. No reasons, no reopening.",
        reply: "“I've enjoyed this and I don't see it going further. Wishing you well, genuinely.”",
      },
    ],
  },
  {
    group: "At work",
    items: [
      {
        situation: "A passive-aggressive email with the whole team copied",
        read: "The audience is the point. Reply factually, move the conflict off the thread.",
        reply:
          "“Thanks for flagging. Here's the status as of today: [facts]. Happy to pick up the rest one-on-one.”",
      },
      {
        situation: "Scope creep framed as a small favour",
        read: "Say yes to the person, no to the unpriced work.",
        reply:
          "“Happy to take it on. It shifts [X] by a week — want me to reprioritise, or queue it after?”",
      },
    ],
  },
];

function HowToReplyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <nav
          aria-label="Breadcrumb"
          className="mb-10 text-[11px] uppercase tracking-[0.25em] text-muted-foreground"
        >
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span className="mx-2 opacity-40">/</span>
          <span className="text-foreground/80">How to Reply</span>
        </nav>

        <header>
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-[1.15] tracking-tight">
            How to reply to any message — 12 situations and what to send
          </h1>
          <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground">
            Most bad replies come from answering the words instead of the intent. Each situation
            below gives you the read first — what the sender is actually doing — and then wording
            you can adapt. Use them as patterns, not scripts.
          </p>
        </header>

        <div className="mt-14 space-y-14">
          {groups.map(({ group, items }) => (
            <section key={group} aria-labelledby={group}>
              <h2 id={group} className="text-xl font-bold tracking-tight">
                {group}
              </h2>
              <div className="mt-6 space-y-4">
                {items.map(({ situation, read, reply }) => (
                  <article key={situation} className="glass-obsidian rounded-2xl p-5">
                    <h3 className="text-sm font-bold">{situation}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      <span className="font-semibold text-foreground/80">The read: </span>
                      {read}
                    </p>
                    <p className="mt-3 border-l-2 border-primary/40 pl-4 text-sm italic leading-relaxed text-foreground/90">
                      {reply}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-16" aria-labelledby="principles">
          <h2 id="principles" className="text-xl font-bold tracking-tight">
            Four rules that hold across every situation
          </h2>
          <ul className="mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <li>
              <span className="font-semibold text-foreground/80">
                Answer the intent, not the sentence.
              </span>{" "}
              The literal question is often not the request being made.
            </li>
            <li>
              <span className="font-semibold text-foreground/80">
                Shorter reads as more certain.
              </span>{" "}
              Length signals negotiation; brevity signals a decision.
            </li>
            <li>
              <span className="font-semibold text-foreground/80">
                Never justify a boundary twice.
              </span>{" "}
              Repeating a reason invites the reason to be argued with.
            </li>
            <li>
              <span className="font-semibold text-foreground/80">Write it, wait, then send.</span>{" "}
              The reply you would send in ten minutes is almost always the better one.
            </li>
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            For messages that look engineered rather than clumsy, read the{" "}
            <Link to="/tactics-guide" className="text-primary underline underline-offset-4">
              manipulation tactics guide
            </Link>
            . To have the wording drafted for your exact conversation, use the{" "}
            <Link to="/ai-reply-generator" className="text-primary underline underline-offset-4">
              AI reply generator
            </Link>
            .
          </p>
        </section>

        <div className="mt-16 glass-obsidian rounded-3xl p-8 text-center">
          <h2 className="text-lg font-bold tracking-tight">Your situation isn't on this list?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Paste the message and get four replies written for it in seconds.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            Get my reply
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
