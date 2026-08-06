import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Play, Gift, Sparkles, Loader2 } from "lucide-react";
import { showRewarded, isNative } from "@/lib/ads/AdService";

interface RewardedAdCardProps {
  /** Headline shown on the offer card. */
  title: string;
  /** Short benefit description. */
  description: string;
  /** Reward label (e.g. "+1 Deep Scan", "Unlock Pro Insights"). */
  rewardLabel: string;
  /** Called when user successfully completes the rewarded video. */
  onReward: () => void;
  /** Optional: hide the card entirely (e.g. Pro user, already claimed). */
  hide?: boolean;
  className?: string;
}

/**
 * Premium card-style placement for Start.io "Rewarded Video".
 * Pure presentation in web — calls AdService.showRewarded() on click,
 * which is a no-op in web and a real Start.io rewarded video in native build.
 */
export function RewardedAdCard({
  title,
  description,
  rewardLabel,
  onReward,
  hide = false,
  className,
}: RewardedAdCardProps) {
  const [loading, setLoading] = useState(false);
  const [native, setNative] = useState(false);

  useEffect(() => {
    setNative(isNative());
  }, []);

  if (hide) return null;

  const handleWatch = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await showRewarded();
      if (res.completed) onReward();
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-3xl glass-strong premium-shadow border border-foreground/10 ${className ?? ""}`}
      role="complementary"
      aria-label="Rewarded video offer"
    >
      {/* Aurora glow background */}
      <div
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 0% 0%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 60%), radial-gradient(ellipse 60% 80% at 100% 100%, color-mix(in oklab, var(--accent) 18%, transparent), transparent 60%)",
        }}
      />

      <div className="relative p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="shrink-0 w-14 h-14 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center glow-primary">
          <Gift className="w-7 h-7 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-muted-foreground/70">
              Sponsored · Rewarded
            </span>
            {!native && (
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] px-1.5 py-0.5 rounded bg-foreground/10 text-muted-foreground">
                Mobile only
              </span>
            )}
          </div>
          <h3 className="font-bold text-base md:text-lg leading-tight">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{description}</p>
          <div className="flex items-center gap-1.5 mt-2.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">{rewardLabel}</span>
          </div>
        </div>

        <button
          onClick={handleWatch}
          disabled={loading}
          className="shrink-0 inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm glow-primary transition-all active:scale-95 disabled:opacity-50"
          aria-label="Watch video to earn reward"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4 fill-current" />
          )}
          {loading ? "Loading…" : "Watch"}
        </button>
      </div>
    </motion.div>
  );
}
