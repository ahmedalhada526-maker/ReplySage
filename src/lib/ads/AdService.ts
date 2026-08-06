/**
 * AdService — Unified ad abstraction layer for **Start.io (StartApp)**.
 *
 * Supported native bridges (auto-detected at runtime):
 *  1. Capacitor plugin `StartApp` / `StartAppAds` (window.Capacitor.Plugins.*)
 *  2. Cordova plugin `cordova-plugin-startapp` (global `window.StartApp`)
 *
 * On the plain web (no native shell): silent no-ops. Rewarded simulates
 * completion so the unlock flow stays testable in the browser preview.
 */

export type AdPlacement = "banner" | "interstitial" | "rewarded";
export type Platform = "android" | "ios";

export interface RewardedResult {
  completed: boolean;
  reason?: string;
}

interface StartIoBridge {
  initialize: (appId: string, testMode: boolean) => Promise<void>;
  loadBanner: () => Promise<void>;
  showBanner: (position: "top" | "bottom") => Promise<void>;
  hideBanner: () => Promise<void>;
  loadInterstitial: () => Promise<void>;
  showInterstitial: () => Promise<void>;
  loadRewarded: () => Promise<void>;
  showRewarded: () => Promise<RewardedResult>;
}

declare global {
  interface Window {
    StartApp?: Record<string, any>;
    Capacitor?: {
      isNativePlatform?: () => boolean;
      getPlatform?: () => string;
      Plugins?: Record<string, any>;
    };
  }
}

// ---------------------------------------------------------------------------
// Start.io configuration
// ---------------------------------------------------------------------------

/**
 * Start.io App ID (from the Start.io dashboard → App → App ID).
 * The same publisher account is declared in `public/app-ads.txt`.
 */
export const STARTIO_APP_ID = "179628114";

/** Enable Start.io "return ads" (ad when the user comes back to the app). */
export const STARTIO_RETURN_ADS = false;

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

function nativePlugin(): Record<string, any> | null {
  if (typeof window === "undefined") return null;
  const plugins = window.Capacitor?.Plugins;
  const cap = plugins?.StartApp ?? plugins?.StartAppAds ?? plugins?.StartIo;
  if (cap) return cap;
  if (window.StartApp) return window.StartApp;
  return null;
}

/** True when a usable Start.io bridge is present. */
export function isNative(): boolean {
  return nativePlugin() !== null;
}

/** Call a plugin method under any of its known aliases. */
function call(p: Record<string, any>, names: string[], arg?: any): Promise<any> {
  for (const n of names) {
    if (typeof p[n] === "function") {
      try {
        return Promise.resolve(arg === undefined ? p[n]() : p[n](arg));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
  return Promise.resolve(undefined);
}

function bridge(): StartIoBridge | null {
  const p = nativePlugin();
  if (!p) return null;

  return {
    initialize: (appId, testMode) =>
      call(p, ["initialize", "init", "setAppId", "start"], {
        appId,
        accountId: appId,
        testMode,
        returnAds: STARTIO_RETURN_ADS,
        enableReturnAds: STARTIO_RETURN_ADS,
      }),
    loadBanner: () => call(p, ["loadBanner", "prepareBanner"], {}),
    showBanner: (position) =>
      call(p, ["showBanner", "createBanner"], { position, size: "BANNER" }),
    hideBanner: () => call(p, ["hideBanner", "removeBanner"], {}),
    loadInterstitial: () =>
      call(p, ["loadInterstitial", "preloadInterstitial", "cacheInterstitial"], {}),
    showInterstitial: () => call(p, ["showInterstitial", "showAd"], {}),
    loadRewarded: () =>
      call(p, ["loadRewardedVideo", "loadRewarded", "preloadRewardedVideo", "cacheRewarded"], {}),
    showRewarded: async () => {
      const r = await call(p, ["showRewardedVideo", "showRewarded"], {});
      // Cordova/Capacitor variants report completion differently.
      const raw = r?.completed ?? r?.rewarded ?? r?.finished;
      const completed = raw === undefined ? r?.state === "COMPLETED" || r === undefined : Boolean(raw);
      return { completed, reason: r?.reason };
    },
  };
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

let initPromise: Promise<void> | null = null;

export function initAds(testMode = false): Promise<void> {
  if (!isNative()) {
    console.info("[AdService] not native — Start.io disabled (web/WebView without plugin)");
    return Promise.resolve();
  }
  if (initPromise) return initPromise;
  const b = bridge();
  if (!b) return Promise.resolve();
  console.info("[AdService] initializing Start.io", {
    appId: STARTIO_APP_ID,
    platform: getPlatform(),
    testMode,
  });
  initPromise = b
    .initialize(STARTIO_APP_ID, testMode)
    .then(() => undefined)
    .catch((e) => {
      console.warn("[AdService] Start.io init failed", e);
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
    await b.loadInterstitial();
    await b.showInterstitial();
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
// Rewarded video
// ---------------------------------------------------------------------------

export async function showRewarded(): Promise<RewardedResult> {
  const b = bridge();
  if (!b) {
    console.debug("[AdService] rewarded (no bridge — simulated complete for web)");
    return { completed: true, reason: "web_simulated" };
  }
  try {
    await b.loadRewarded();
    return await b.showRewarded();
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
    await b.loadBanner();
    await b.showBanner(position);
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
