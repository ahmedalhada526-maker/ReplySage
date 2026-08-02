/**
 * AdService — Unified ad abstraction layer for Unity Ads.
 *
 * Supports two integration modes (auto-detected at runtime):
 *  1. Capacitor + `capacitor-unity-ads` plugin (preferred, ES module API).
 *  2. Legacy `window.UnityAds` JS bridge (custom WebView wrappers).
 *
 * On the plain web (no native shell): silent no-ops, rewarded simulates
 * completion so the UI flow can still be tested.
 */

export type AdPlacement = "banner" | "interstitial" | "rewarded";
export type Platform = "android" | "ios";

export interface RewardedResult {
  completed: boolean;
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
      Plugins?: Record<string, any>;
    };
  }
}

// ---------------------------------------------------------------------------
// Unity Ads configuration
// ---------------------------------------------------------------------------

export const UNITY_GAME_IDS = {
  android: "6100246",
  ios: "6100247",
} as const;

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

export const INTERSTITIAL_SCAN_INTERVAL = 3;
export const APP_OPEN_DELAY_MS = 1500;

// ---------------------------------------------------------------------------
// Platform detection
// ---------------------------------------------------------------------------

export function getPlatform(): Platform {
  if (typeof window === "undefined") return "android";
  const p = window.Capacitor?.getPlatform?.();
  return p === "ios" ? "ios" : "android";
}

/** True when running inside a Capacitor native shell. */
export function isCapacitorNative(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(window.Capacitor?.isNativePlatform?.());
}

/** True when any usable ad bridge is present (Capacitor plugin OR legacy JS bridge). */
export function isNative(): boolean {
  if (typeof window === "undefined") return false;
  if (window.UnityAds) return true;
  if (isCapacitorNative() && window.Capacitor?.Plugins?.UnityAds) return true;
  return false;
}

function placements() {
  return UNITY_PLACEMENTS[getPlatform()];
}

/** Resolve the active bridge (Capacitor plugin preferred). */
function bridge(): UnityAdsBridge | null {
  if (typeof window === "undefined") return null;
  const cap = window.Capacitor?.Plugins?.UnityAds as any;
  if (cap) {
    // Adapter — capacitor-unity-ads exposes slightly different method names.
    return {
      initialize: (gameId, testMode) => cap.initialize?.({ gameId, testMode }) ?? Promise.resolve(),
      loadBanner: (placementId) => cap.loadBanner?.({ placementId }) ?? Promise.resolve(),
      showBanner: (placementId, position) =>
        cap.showBanner?.({ placementId, position }) ?? Promise.resolve(),
      hideBanner: () => cap.hideBanner?.() ?? Promise.resolve(),
      loadInterstitial: (placementId) =>
        cap.loadInterstitial?.({ placementId }) ?? Promise.resolve(),
      showInterstitial: (placementId) =>
        cap.showInterstitial?.({ placementId }) ?? Promise.resolve(),
      loadRewarded: (placementId) => cap.loadRewarded?.({ placementId }) ?? Promise.resolve(),
      showRewarded: async (placementId) => {
        const r = await (cap.showRewarded?.({ placementId }) ??
          Promise.resolve({ completed: true }));
        return {
          completed: Boolean(r?.completed ?? r?.finished ?? r?.state === "COMPLETED"),
          reason: r?.reason,
        };
      },
    };
  }
  return window.UnityAds ?? null;
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

let initPromise: Promise<void> | null = null;

export function initAds(testMode = false): Promise<void> {
  if (!isNative()) {
    console.info("[AdService] not native — ads disabled (web/WebView without plugin)");
    return Promise.resolve();
  }
  if (initPromise) return initPromise;
  const gameId = UNITY_GAME_IDS[getPlatform()];
  const b = bridge();
  if (!b) return Promise.resolve();
  console.info("[AdService] initializing Unity Ads", { gameId, platform: getPlatform(), testMode });
  initPromise = b.initialize(gameId, testMode).catch((e) => {
    console.warn("[AdService] Unity init failed", e);
    initPromise = null;
  });
  return initPromise;
}

// ---------------------------------------------------------------------------
// Interstitial
// ---------------------------------------------------------------------------

let scanCounter = 0;

export async function showInterstitial(): Promise<boolean> {
  const b = bridge();
  if (!b) {
    console.debug("[AdService] interstitial (no bridge — no-op)");
    return false;
  }
  try {
    const id = placements().interstitial;
    await b.loadInterstitial(id);
    await b.showInterstitial(id);
    return true;
  } catch (e) {
    console.warn("[AdService] interstitial failed", e);
    return false;
  }
}

export async function maybeShowInterstitialAfterScan(): Promise<boolean> {
  scanCounter += 1;
  if (scanCounter % INTERSTITIAL_SCAN_INTERVAL !== 0) return false;
  return showInterstitial();
}

export function resetScanCounter(): void {
  scanCounter = 0;
}

// ---------------------------------------------------------------------------
// App Open
// ---------------------------------------------------------------------------

let appOpenShown = false;

export function scheduleAppOpenAd(delayMs: number = APP_OPEN_DELAY_MS): void {
  if (appOpenShown) return;
  appOpenShown = true;
  if (!isNative()) return;
  setTimeout(() => {
    void showInterstitial();
  }, delayMs);
}

// ---------------------------------------------------------------------------
// Rewarded
// ---------------------------------------------------------------------------

export async function showRewarded(): Promise<RewardedResult> {
  const b = bridge();
  if (!b) {
    console.debug("[AdService] rewarded (no bridge — simulated complete for web)");
    return { completed: true, reason: "web_simulated" };
  }
  try {
    const id = placements().rewarded;
    await b.loadRewarded(id);
    return await b.showRewarded(id);
  } catch (e) {
    console.warn("[AdService] rewarded failed", e);
    return { completed: false, reason: "error" };
  }
}

// ---------------------------------------------------------------------------
// Banner
// ---------------------------------------------------------------------------

let bannerVisible = false;

export async function showBanner(position: "top" | "bottom" = "bottom"): Promise<boolean> {
  const b = bridge();
  if (!b) return false;
  if (bannerVisible) return true;
  try {
    const id = placements().banner;
    await b.loadBanner(id);
    await b.showBanner(id, position);
    bannerVisible = true;
    return true;
  } catch (e) {
    console.warn("[AdService] banner failed", e);
    return false;
  }
}

export async function hideBanner(): Promise<void> {
  const b = bridge();
  if (!b) return;
  try {
    await b.hideBanner();
    bannerVisible = false;
  } catch (e) {
    console.warn("[AdService] hideBanner failed", e);
  }
}
