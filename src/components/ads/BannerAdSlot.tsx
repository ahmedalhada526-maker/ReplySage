import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import { isNative } from "@/lib/ads/AdService";

interface BannerAdSlotProps {
  className?: string;
  /** Hide entirely (e.g. Pro user). */
  hide?: boolean;
  /**
   * Display variant.
   * - "fixed-bottom" (default): fixed at the bottom of the viewport — mirrors
   *   how the real Unity banner will sit in the native build.
   * - "inline": legacy inline placeholder, kept for special pages if needed.
   */
  variant?: "fixed-bottom" | "inline";
}

/**
 * Web-only visual placeholder for the Start.io banner.
 * In native (Capacitor + Start.io), the real banner is rendered by the SDK
 * via AdService.showBanner() — this component renders nothing in that case.
 */
export function BannerAdSlot({
  className,
  hide = false,
  variant = "fixed-bottom",
}: BannerAdSlotProps) {
  const [native, setNative] = useState(false);

  useEffect(() => {
    setNative(isNative());
  }, []);

  if (hide) return null;
  // Native: real Unity banner is overlaid by the SDK — render nothing.
  if (native) return null;

  if (variant === "fixed-bottom") {
    return (
      <div
        className={`fixed bottom-0 inset-x-0 z-30 pointer-events-none px-2 pb-2 ${className ?? ""}`}
        role="complementary"
        aria-label="Ad placement"
      >
        <div className="pointer-events-auto mx-auto max-w-[728px] h-[60px] rounded-xl overflow-hidden border border-foreground/10 bg-background/80 backdrop-blur-xl flex items-center justify-center relative shadow-lg">
          <div className="absolute inset-0 animate-shimmer pointer-events-none" />
          <div className="flex items-center gap-2 text-muted-foreground/50">
            <Megaphone className="w-3.5 h-3.5" />
            <span className="text-[9px] font-mono uppercase tracking-[0.25em]">
              Ad space · Start.io Banner
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center gap-1.5 py-2 ${className ?? ""}`}
      role="complementary"
      aria-label="Ad placement"
    >
      <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-muted-foreground/50">
        Sponsored
      </span>
      <div className="relative w-full max-w-[728px] h-[90px] rounded-xl overflow-hidden border border-foreground/5 bg-foreground/[0.02] flex items-center justify-center">
        <div className="absolute inset-0 animate-shimmer pointer-events-none" />
        <div className="flex items-center gap-2 text-muted-foreground/40">
          <Megaphone className="w-4 h-4" />
          <span className="text-[10px] font-mono uppercase tracking-[0.25em]">
            Ad space · Start.io Banner
          </span>
        </div>
      </div>
    </div>
  );
}
