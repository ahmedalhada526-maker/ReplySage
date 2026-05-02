import { useEffect } from "react";
import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { bootAds } from "@/lib/ads/init-ads";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PersonaPulse AI: كاشف النوايا، تحليل الشخصية والرد المسكت" },
      {
        name: "description",
        content:
          "Discover your true self with Persona Pulse AI. Our advanced AI tool provides deep personality analysis and psychological insights for personal growth.",
      },
      {
        name: "keywords",
        content:
          "AI personality analysis, Persona Pulse, psychological insights, self-discovery tool, AI character analysis",
      },
      { name: "author", content: "Persona Pulse AI" },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "PersonaPulse AI: كاشف النوايا، تحليل الشخصية والرد المسكت" },
      {
        property: "og:description",
        content:
          "Discover your true self with Persona Pulse AI. Our advanced AI tool provides deep personality analysis and psychological insights for personal growth.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://person-plus-ai.lovable.app" },
      { property: "og:site_name", content: "Persona Pulse AI" },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0433b85d-d944-4d9d-98d4-f0027d9d5726/id-preview-36f7b5b2--dd7ac2bd-428c-4c8a-a6f8-1677242d6a58.lovable.app-1776465515962.png",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "PersonaPulse AI: كاشف النوايا، تحليل الشخصية والرد المسكت" },
      {
        name: "twitter:description",
        content:
          "Discover your true self with Persona Pulse AI. Our advanced AI tool provides deep personality analysis and psychological insights for personal growth.",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0433b85d-d944-4d9d-98d4-f0027d9d5726/id-preview-36f7b5b2--dd7ac2bd-428c-4c8a-a6f8-1677242d6a58.lovable.app-1776465515962.png",
      },
      { name: "description", content: "ذكاء اصطناعي،تحليل محادثات،قصف جبهات،ردود مسكتة،فن الرد،علم نفس،لغة جسد،كشف تلاعب،نرجسية،علاقات سامة،رد ذكي،إحراج،كشف كذب،سيكولوجية،واتساب،تليجرام،بوت ردود،اختب" },
      { property: "og:description", content: "ذكاء اصطناعي،تحليل محادثات،قصف جبهات،ردود مسكتة،فن الرد،علم نفس،لغة جسد،كشف تلاعب،نرجسية،علاقات سامة،رد ذكي،إحراج،كشف كذب،سيكولوجية،واتساب،تليجرام،بوت ردود،اختب" },
      { name: "twitter:description", content: "ذكاء اصطناعي،تحليل محادثات،قصف جبهات،ردود مسكتة،فن الرد،علم نفس،لغة جسد،كشف تلاعب،نرجسية،علاقات سامة،رد ذكي،إحراج،كشف كذب،سيكولوجية،واتساب،تليجرام،بوت ردود،اختب" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/D3W5uhOKNHhfFahBPWNs0j6H0LF3/social-images/social-1776737963114-1776716364167.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/D3W5uhOKNHhfFahBPWNs0j6H0LF3/social-images/social-1776737963114-1776716364167.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "canonical", href: "https://person-plus-ai.lovable.app" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  useEffect(() => {
    void bootAds();
  }, []);

  return (
    <>
      <Outlet />
      <Toaster richColors position="top-center" theme="dark" />
    </>
  );
}
