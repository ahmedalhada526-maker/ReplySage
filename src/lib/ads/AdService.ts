/**
 * AdService — Unified ad abstraction layer.
 *
 * Web build: silent no-ops with optional dev placeholders.
 * Native build (Capacitor + Unity Ads): wires into Unity Ads SDK via
 *   the `capacitor-unity-ads` plugin (or equivalent) — see /docs/UNITY_ADS.md.
 *
 * The app calls only this service. Swap implementations in one place.
 */

export type AdPlacement = "banner" | "interstitial" | "rewarded";

export interface RewardedResult {
  /** true if the user watched the full video and earned the reward. */
  completed: boolean;
  /** Reason if not completed: "skipped" | "error" | "not_ready" | "no_ad". */
  reason?: string;
}

interface UnityAdsBridge {
  initialize: (gameId: string, testMode: boolean) => Promise<void>;
  loadBanner: (placementId: string) => Promise<void>;
  showBanner: (placementId: string, position: "top" | "bottom") => Promise<void>;
  hideBanner: () => Promise<void>;
  loadInterstitial: (placementId: string) => Promise<void>;
  showInterstitial: (placementId: string) => Promise<void>;
  loadRewarded: (placementId: string) => Promise<void>;
  showRewarded: (placementId: string) => Promise<RewardedResult>;
}

declare global {
  interface Window {
    UnityAds?: UnityAdsBridge;
    Capacitor?: { isNativePlatform?: () => boolean };
  }
}

// ---- Unity Ads placement IDs (configure in Unity Dashboard) ----
// Default placement names recommended by Unity. Override at native build time.
export const UNITY_PLACEMENTS = {
  banner: "Banner_Android",
  interstitial: "Interstitial_Android",
  rewarded: "Rewarded_Android",
} as const;

// ---- Platform detection ----
export function isNative(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(window.Capacitor?.isNativePlatform?.() && window.UnityAds);
}

// ---- Initialization (called once on app boot, native only) ----
let initPromise: Promise<void> | null = null;

export function initAds(gameId: string, testMode = false): Promise<void> {
  if (!isNative()) return Promise.resolve();
  if (initPromise) return initPromise;
  initPromise = window.UnityAds!.initialize(gameId, testMode).catch((e) => {
    console.warn("[AdService] Unity init failed", e);
    initPromise = null;
  });
  return initPromise;
}

// ---- Interstitial (full-screen, between actions) ----
export async function showInterstitial(): Promise<boolean> {
  if (!isNative()) {
    console.debug("[AdService] interstitial (web no-op)");
    return false;
  }
  try {
    await window.UnityAds!.loadInterstitial(UNITY_PLACEMENTS.interstitial);
    await window.UnityAds!.showInterstitial(UNITY_PLACEMENTS.interstitial);
    return true;
  } catch (e) {
    console.warn("[AdService] interstitial failed", e);
    return false;
  }
}

// ---- Rewarded video (user opts in, gets reward on completion) ----
export async function showRewarded(): Promise<RewardedResult> {
  if (!isNative()) {
    // Web fallback: simulate completion in dev so flows can be tested.
    console.debug("[AdService] rewarded (web no-op, simulated complete)");
    return { completed: true, reason: "web_simulated" };
  }
  try {
    await window.UnityAds!.loadRewarded(UNITY_PLACEMENTS.rewarded);
    return await window.UnityAds!.showRewarded(UNITY_PLACEMENTS.rewarded);
  } catch (e) {
    console.warn("[AdService] rewarded failed", e);
    return { completed: false, reason: "error" };
  }
}

// ---- Banner (persistent strip) ----
export async function showBanner(position: "top" | "bottom" = "bottom"): Promise<boolean> {
  if (!isNative()) return false;
  try {
    await window.UnityAds!.loadBanner(UNITY_PLACEMENTS.banner);
    await window.UnityAds!.showBanner(UNITY_PLACEMENTS.banner, position);
    return true;
  } catch (e) {
    console.warn("[AdService] banner failed", e);
    return false;
  }
}

export async function hideBanner(): Promise<void> {
  if (!isNative()) return;
  try {
    await window.UnityAds!.hideBanner();
  } catch (e) {
    console.warn("[AdService] hideBanner failed", e);
  }
}
