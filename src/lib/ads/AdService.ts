/**
 * AdService — Unified ad abstraction layer for Unity Ads.
 *
 * Web build: silent no-ops (rewarded simulates completion in dev only).
 * Native build (Capacitor + Unity Ads plugin): wires into Unity Ads SDK.
 * See /docs/UNITY_ADS.md for the native setup.
 *
 * Strategy implemented here:
 *  - Banner: persistent at the bottom of the screen (native only).
 *  - Interstitial: shown once every N completed scans (default 3).
 *  - Rewarded: opt-in, user-triggered.
 *  - App Open: shown once on cold start with a small delay (uses interstitial).
 */

export type AdPlacement = "banner" | "interstitial" | "rewarded";
export type Platform = "android" | "ios";

export interface RewardedResult {
  /** true if the user watched the full video and earned the reward. */
  completed: boolean;
  /** Reason if not completed: "skipped" | "error" | "not_ready" | "no_ad" | "web_simulated". */
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
    Capacitor?: {
      isNativePlatform?: () => boolean;
      getPlatform?: () => string;
    };
  }
}

// ---------------------------------------------------------------------------
// Unity Ads configuration (project-specific)
// ---------------------------------------------------------------------------

/** Unity Game IDs (from Unity Dashboard → Project Settings). */
export const UNITY_GAME_IDS = {
  android: "6100246",
  ios: "6100247",
} as const;

/** Placement IDs (from Unity Dashboard → Monetization → Ad Units). */
export const UNITY_PLACEMENTS = {
  android: {
    banner: "Banner_Android",
    interstitial: "Interstitial_Android",
    rewarded: "Rewarded_Android",
  },
  ios: {
    banner: "Banner_iOS",
    interstitial: "Interstitial_iOS",
    rewarded: "Rewarded_iOS",
  },
} as const;

/** How many successful scans between interstitial ads. */
export const INTERSTITIAL_SCAN_INTERVAL = 3;

/** Delay (ms) before showing the App-Open ad on cold start. */
export const APP_OPEN_DELAY_MS = 1500;

// ---------------------------------------------------------------------------
// Platform detection
// ---------------------------------------------------------------------------

export function getPlatform(): Platform {
  if (typeof window === "undefined") return "android";
  const p = window.Capacitor?.getPlatform?.();
  return p === "ios" ? "ios" : "android";
}

export function isNative(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(window.Capacitor?.isNativePlatform?.() && window.UnityAds);
}

function placements() {
  return UNITY_PLACEMENTS[getPlatform()];
}

// ---------------------------------------------------------------------------
// Initialization (call once on app boot — native only)
// ---------------------------------------------------------------------------

let initPromise: Promise<void> | null = null;

/**
 * Initialize Unity Ads. Auto-detects platform and uses the matching Game ID.
 * Pass `testMode: true` during development to avoid real ad impressions.
 */
export function initAds(testMode = false): Promise<void> {
  if (!isNative()) return Promise.resolve();
  if (initPromise) return initPromise;
  const gameId = UNITY_GAME_IDS[getPlatform()];
  initPromise = window.UnityAds!.initialize(gameId, testMode).catch((e) => {
    console.warn("[AdService] Unity init failed", e);
    initPromise = null;
  });
  return initPromise;
}

// ---------------------------------------------------------------------------
// Interstitial (full-screen) — gated by a scan counter
// ---------------------------------------------------------------------------

let scanCounter = 0;

/** Force-show an interstitial regardless of the counter. */
export async function showInterstitial(): Promise<boolean> {
  if (!isNative()) {
    console.debug("[AdService] interstitial (web no-op)");
    return false;
  }
  try {
    const id = placements().interstitial;
    await window.UnityAds!.loadInterstitial(id);
    await window.UnityAds!.showInterstitial(id);
    return true;
  } catch (e) {
    console.warn("[AdService] interstitial failed", e);
    return false;
  }
}

/**
 * Increment the scan counter and show an interstitial only every Nth scan.
 * Returns true if an ad was shown.
 */
export async function maybeShowInterstitialAfterScan(): Promise<boolean> {
  scanCounter += 1;
  if (scanCounter % INTERSTITIAL_SCAN_INTERVAL !== 0) return false;
  return showInterstitial();
}

/** Reset counter (e.g. when starting a new session). */
export function resetScanCounter(): void {
  scanCounter = 0;
}

// ---------------------------------------------------------------------------
// App Open — shown once on cold start (uses interstitial placement)
// ---------------------------------------------------------------------------

let appOpenShown = false;

/**
 * Show an "App Open"-style interstitial on cold start.
 * Idempotent — subsequent calls in the same session are no-ops.
 */
export function scheduleAppOpenAd(delayMs: number = APP_OPEN_DELAY_MS): void {
  if (appOpenShown) return;
  appOpenShown = true;
  if (!isNative()) return;
  setTimeout(() => {
    void showInterstitial();
  }, delayMs);
}

// ---------------------------------------------------------------------------
// Rewarded video
// ---------------------------------------------------------------------------

export async function showRewarded(): Promise<RewardedResult> {
  if (!isNative()) {
    console.debug("[AdService] rewarded (web no-op, simulated complete)");
    return { completed: true, reason: "web_simulated" };
  }
  try {
    const id = placements().rewarded;
    await window.UnityAds!.loadRewarded(id);
    return await window.UnityAds!.showRewarded(id);
  } catch (e) {
    console.warn("[AdService] rewarded failed", e);
    return { completed: false, reason: "error" };
  }
}

// ---------------------------------------------------------------------------
// Banner (persistent, anchored bottom)
// ---------------------------------------------------------------------------

let bannerVisible = false;

export async function showBanner(
  position: "top" | "bottom" = "bottom",
): Promise<boolean> {
  if (!isNative()) return false;
  if (bannerVisible) return true;
  try {
    const id = placements().banner;
    await window.UnityAds!.loadBanner(id);
    await window.UnityAds!.showBanner(id, position);
    bannerVisible = true;
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
    bannerVisible = false;
  } catch (e) {
    console.warn("[AdService] hideBanner failed", e);
  }
}
