import { useEffect } from "react";
import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { bootAds } from "@/lib/ads/init-ads";
import { BannerAdSlot } from "@/components/ads/BannerAdSlot";

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
      { name: "author", content: "PersonaPulse AI" },
      { name: "robots", content: "index, follow" },
      { name: "google-site-verification", content: "Ok7o3EuqTnJBdKlrFfICAC9TdZsox4tjQYH43l019Y0" },
      { property: "og:site_name", content: "PersonaPulse AI" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        property: "og:image",
        content:
          "https://storage.googleapis.com/gpt-engineer-file-uploads/D3W5uhOKNHhfFahBPWNs0j6H0LF3/social-images/social-1776737963114-1776716364167.webp",
      },
      {
        name: "twitter:image",
        content:
          "https://storage.googleapis.com/gpt-engineer-file-uploads/D3W5uhOKNHhfFahBPWNs0j6H0LF3/social-images/social-1776737963114-1776716364167.webp",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Instrument+Serif&display=swap" },
      { rel: "icon", type: "image/png", sizes: "512x512", href: "/favicon.png" },
      { rel: "icon", type: "image/png", sizes: "64x64", href: "/favicon-64.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "PersonaPulse AI",
          url: "https://person-plus-ai.lovable.app",
          description:
            "Your personal AI reply coach. Paste any message, chat, or screenshot and receive four ready-to-send replies tuned to the exact tone you need — romantic, bold, cold, smart, or firm — with clear reasoning before you send.",



        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "PersonaPulse AI",
          url: "https://person-plus-ai.lovable.app",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");
  return (
    <html lang={isEnglish ? "en" : "ar"} dir={isEnglish ? "ltr" : "rtl"}>

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
      <BannerAdSlot />
      <Toaster richColors position="top-center" theme="dark" />
    </>
  );
}
