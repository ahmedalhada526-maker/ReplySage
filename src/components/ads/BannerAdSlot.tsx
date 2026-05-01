import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import { isNative } from "@/lib/ads/AdService";

interface BannerAdSlotProps {
  className?: string;
  /** Hide entirely (e.g. Pro user). */
  hide?: boolean;
}

/**
 * Reserved banner slot for Unity Ads native banner.
 * On web: shows a subtle, polished placeholder so layout stays consistent.
 * On native: Unity SDK will render the banner over this region (top/bottom).
 *
 * Banner is actually shown by calling AdService.showBanner() from app boot
 * in the native build — this component reserves the visual space inline.
 */
export function BannerAdSlot({ className, hide = false }: BannerAdSlotProps) {
  const [native, setNative] = useState(false);

  useEffect(() => {
    setNative(isNative());
  }, []);

  if (hide) return null;
  // In native builds, the real banner is overlaid by Unity — don't draw the placeholder.
  if (native) return null;

  return (
    <div
      className={`flex flex-col items-center gap-1.5 py-2 ${className ?? ""}`}
      role="complementary"
      aria-label="Ad placement"
    >
      <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-muted-foreground/50">
        Sponsored
      </span>
      <div
        className="relative w-full max-w-[728px] h-[90px] rounded-xl overflow-hidden border border-foreground/5 bg-foreground/[0.02] flex items-center justify-center"
      >
        <div className="absolute inset-0 animate-shimmer pointer-events-none" />
        <div className="flex items-center gap-2 text-muted-foreground/40">
          <Megaphone className="w-4 h-4" />
          <span className="text-[10px] font-mono uppercase tracking-[0.25em]">
            Ad space · Unity Banner
          </span>
        </div>
      </div>
    </div>
  );
}
