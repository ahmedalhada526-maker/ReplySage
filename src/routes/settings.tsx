import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  Loader2,
  PlayCircle,
  XCircle,
} from "lucide-react";
import { getAIStatus, testGeminiKey } from "@/lib/settings.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — ReplySage" },
      {
        name: "description",
        content:
          "Configure your ReplySage provider, manage the Gemini API key, and check server-side AI status and connection health.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Settings — ReplySage" },
      {
        property: "og:description",
        content: "Manage your Gemini API key and AI provider configuration for ReplySage.",
      },
      { property: "og:url", content: "https://replysage.lovable.app/settings" },
    ],
    links: [{ rel: "canonical", href: "https://replysage.lovable.app/settings" }],
  }),
  component: SettingsPage,
});

type Status = Awaited<ReturnType<typeof getAIStatus>>;

function SettingsPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAIStatus()
      .then((s) => {
        if (!cancelled) setStatus(s);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load AI status.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const usingGemini = status?.provider === "gemini-direct";

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<
    | { ok: true; reply: string; latencyMs?: number; status?: number }
    | { ok: false; error: string; latencyMs?: number; status?: number }
    | null
  >(null);

  const runTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const r = await testGeminiKey();
      if (r.ok) {
        setTestResult({ ok: true, reply: r.reply ?? "", latencyMs: r.latencyMs, status: r.status });
      } else {
        setTestResult({
          ok: false,
          error: r.error ?? "Unknown error",
          latencyMs: r.latencyMs,
          status: r.status,
        });
      }
    } catch (e) {
      setTestResult({ ok: false, error: e instanceof Error ? e.message : "Request failed" });
    } finally {
      setTesting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to app
        </Link>

        <header className="mt-6">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage which AI provider powers your analyses. Keys live in server-side environment
            variables only — they are never exposed to the browser.
          </p>
        </header>

        <section className="mt-10 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <KeyRound className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">AI Provider</h2>
          </div>

          {loading && (
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking configuration…
            </div>
          )}

          {error && (
            <div className="mt-6 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {status && (
            <div className="mt-6 space-y-4">
              <ProviderRow
                name="Google Gemini (your key)"
                env="GEMINI_API_KEY"
                active={usingGemini}
                configured={status.geminiConfigured}
                description="Calls Google Generative Language API directly using your personal API key. Billed to your Google account."
              />
              <ProviderRow
                name="Lovable AI Gateway (default)"
                env="LOVABLE_API_KEY"
                active={!usingGemini && status.lovableConfigured}
                configured={status.lovableConfigured}
                description="Lovable-managed gateway. Used automatically when no personal Gemini key is set."
              />

              <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                <p className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    To <strong>add or rotate</strong> your{" "}
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">GEMINI_API_KEY</code>,
                    ask the assistant in chat: “update my Gemini API key”. Keys are stored as
                    encrypted server-side secrets and never sent to the browser bundle.
                  </span>
                </p>
              </div>

              <div className="rounded-lg border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">Test Gemini API key</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Sends one tiny ping to Google using your server-side key.
                    </p>
                  </div>
                  <Button
                    onClick={runTest}
                    disabled={testing || !status.geminiConfigured}
                    size="sm"
                  >
                    {testing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing…
                      </>
                    ) : (
                      <>
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Run test
                      </>
                    )}
                  </Button>
                </div>

                {!status.geminiConfigured && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Add <code className="rounded bg-muted px-1.5 py-0.5">GEMINI_API_KEY</code> first
                    to enable this test.
                  </p>
                )}

                {testResult?.ok && (
                  <div className="mt-4 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-500">
                    <div className="flex items-center gap-2 font-medium">
                      <CheckCircle2 className="h-4 w-4" />
                      Success {testResult.latencyMs ? `(${testResult.latencyMs}ms)` : ""}
                    </div>
                    <p className="mt-1 break-words text-emerald-500/90">
                      Reply: <span className="font-mono">{testResult.reply || "(empty)"}</span>
                    </p>
                  </div>
                )}

                {testResult && !testResult.ok && (
                  <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    <div className="flex items-center gap-2 font-medium">
                      <XCircle className="h-4 w-4" />
                      Failed {testResult.status ? `(HTTP ${testResult.status})` : ""}
                    </div>
                    <p className="mt-1 break-words font-mono text-xs leading-relaxed text-destructive/90">
                      {testResult.error}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        <section className="mt-6 rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">Security notes</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              The page never reads or displays the key value — only its presence.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              All AI requests are made server-side; the browser never sees your API key.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              If <code className="rounded bg-muted px-1.5 py-0.5 text-xs">GEMINI_API_KEY</code> is
              removed, the app falls back to Lovable AI automatically.
            </li>
          </ul>

          <div className="mt-6">
            <Button asChild variant="outline">
              <Link to="/">Return to dashboard</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}

function ProviderRow({
  name,
  env,
  active,
  configured,
  description,
}: {
  name: string;
  env: string;
  active: boolean;
  configured: boolean;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{name}</span>
            {active && (
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                Active
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            <code className="rounded bg-muted px-1.5 py-0.5">{env}</code>
          </p>
        </div>
        <span
          className={
            "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium " +
            (configured ? "bg-emerald-500/15 text-emerald-500" : "bg-muted text-muted-foreground")
          }
        >
          {configured ? "Configured" : "Not set"}
        </span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
