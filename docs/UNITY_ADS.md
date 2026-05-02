# Unity Ads Integration Guide

This app is a React web app today. All ad calls go through `src/lib/ads/AdService.ts`.
On the web every call is a silent no-op. When you wrap the app with **Capacitor**
and add a Unity Ads plugin, the same call sites become real Unity ads —
no UI changes needed.

## Project IDs (already wired in code)

| Item | Value |
|---|---|
| Unity Project ID | `e64c9f9f-eb1e-44a0-b94a-2994061da3f7` |
| Game ID — Android | `6100246` |
| Game ID — iOS | `6100247` |

## Placements (already wired in code)

| Type | Android Placement ID | iOS Placement ID | Where it shows |
|---|---|---|---|
| Banner | `Banner_Android` | `Banner_iOS` | Persistent strip at the bottom of every screen |
| Interstitial | `Interstitial_Android` | `Interstitial_iOS` | Every **3rd** successful scan + once on cold start (App Open) |
| Rewarded | `Rewarded_Android` | `Rewarded_iOS` | Opt-in cards (Deep Scan, Strategy unlock) |

The current platform is auto-detected — `AdService` picks Android vs iOS IDs
at runtime via `Capacitor.getPlatform()`.

## How the ad cadence is implemented

- **Banner** — `bootAds()` (in `src/lib/ads/init-ads.ts`) calls `showBanner("bottom")`
  once on app start. Stays visible across all routes.
- **Interstitial** — `PersonaWorkspace` calls `maybeShowInterstitialAfterScan()`
  after every successful scan. The helper increments an in-memory counter and
  only shows the ad on the 3rd / 6th / 9th scan (configurable via
  `INTERSTITIAL_SCAN_INTERVAL` in `AdService.ts`).
- **App Open** — `bootAds()` also calls `scheduleAppOpenAd()`, which fires
  one interstitial 1.5 s after launch (delay configurable via
  `APP_OPEN_DELAY_MS`).
- **Rewarded** — Triggered only by user tapping a `RewardedAdCard`.

## One-time setup (on your machine, not in Lovable)

```bash
# 1. Pull the project from GitHub, then:
npm install
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npm install capacitor-unity-ads        # community plugin
npx cap init "PersonaPulse" "app.persona.pulse" --web-dir=dist

# 2. Build the web bundle
npm run build

# 3. Add native platforms
npx cap add android
npx cap add ios
npx cap sync
```

## Switching test mode on/off

Open `src/lib/ads/init-ads.ts` and toggle:

```ts
const TEST_MODE = false; // true during dev, false for production release
```

Unity strongly recommends `testMode: true` while developing to avoid
accidentally violating policy with self-clicks on real ads.

## Open in Android Studio / Xcode

```bash
npx cap open android
npx cap open ios
```

Build & run on a device. The web placeholder banner disappears automatically
(`isNative()` flips to `true`) and real Unity ads render in their place.

## Notes

- All ad calls are wrapped in try/catch — a failed ad never breaks the UI.
- Rewarded ads only grant rewards when the user watches the full video.
- Banner is rendered *over* the bottom of the viewport by Unity's overlay;
  the web placeholder hides itself in native builds.
- App Open uses the same `Interstitial_*` placement. Create a separate
  `AppOpen_*` placement in Unity Dashboard if you want isolated revenue
  tracking, then update `scheduleAppOpenAd` to call a dedicated helper.
