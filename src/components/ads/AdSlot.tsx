import { ReactNode } from "react";

interface AdSlotProps {
  children: ReactNode;
  /** When true, the slot is hidden (e.g. user is on Pro tier). */
  hide: boolean;
  label?: string;
  className?: string;
  /** Reserved minimum height (px) so the slot keeps its space even if the ad fails to load. */
  minHeight?: number;
  /** Reserved width (px). If omitted, the slot stretches to its container. */
  width?: number;
}

/**
 * Wraps an ad with a subtle "Sponsored" label and disclosure styling.
 * Hides entirely when `hide` is true (used to suppress ads for Pro users).
 *
 * Reserves a fixed minimum height so a failed/blocked ad load doesn't leave
 * the page looking broken or empty — the labeled placeholder remains visible.
 */
export function AdSlot({
  children,
  hide,
  label = "Sponsored",
  className,
  minHeight = 110,
  width,
}: AdSlotProps) {
  if (hide) return null;

  return (
    <div
      className={`flex flex-col items-center gap-1.5 py-2 ${className ?? ""}`}
      role="complementary"
    >
      <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-muted-foreground/50">
        {label}
      </span>
      <div
        className="rounded-xl overflow-hidden bg-foreground/[0.02] border border-foreground/5 max-w-full w-full flex items-center justify-center"
        style={{
          minHeight,
          ...(width ? { width, maxWidth: "100%" } : {}),
        }}
      >
        {children}
      </div>
    </div>
  );
}
