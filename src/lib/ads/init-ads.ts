/**
 * One-shot ad bootstrap. Imported & invoked from the root component.
 * On web: every call is a silent no-op.
 * On native (Capacitor + Start.io plugin): initializes Start.io,
 *   shows the bottom banner, and schedules the App-Open ad.
 */
import { initAds, showBanner, scheduleAppOpenAd, isNative } from "./AdService";

let booted = false;

/** Set to `true` for development builds, `false` for production. */
const TEST_MODE = false;

export async function bootAds(): Promise<void> {
  if (booted) return;
  booted = true;
  if (!isNative()) return;
  try {
    await initAds(TEST_MODE);
    // Persistent bottom banner
    void showBanner("bottom");
    // App-Open interstitial after a small delay so the UI can render first
    scheduleAppOpenAd();
  } catch (e) {
    console.warn("[ads] boot failed", e);
  }
}
