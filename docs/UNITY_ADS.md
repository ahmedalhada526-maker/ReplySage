# Unity Ads Integration Guide

This app is a React web app today. Ad placements are wired through a single
abstraction: `src/lib/ads/AdService.ts`. On the web it's a silent no-op.
When you wrap the app with **Capacitor** and add the Unity Ads plugin, the
same call sites become real Unity ads — no UI changes needed.

## Placements already wired

| Placement | Where | Type |
|---|---|---|
| `Banner_Android` | `<BannerAdSlot />` (hero & between results) | Banner 320x50 |
| `Interstitial_Android` | After every successful scan | Full-screen |
| `Rewarded_Android` | `<RewardedAdCard />` (hero + results) | Rewarded video |

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

## Configure Unity Dashboard

1. Create a project at https://dashboard.unity.com/ → Monetization → Ad Units.
2. Create three placements with these EXACT names:
   - `Banner_Android` (Banner)
   - `Interstitial_Android` (Interstitial)
   - `Rewarded_Android` (Rewarded)
3. Copy your **Game ID** for Android & iOS.

## Initialize on app boot (native only)

In your Capacitor entry (e.g. a small `src/lib/ads/init-native.ts` you call
from `__root.tsx` inside a `useEffect`):

```ts
import { initAds } from "@/lib/ads/AdService";

// Call once at boot. Replace with your real Game ID.
initAds("YOUR_UNITY_GAME_ID", /* testMode */ false);
```

## Open in Android Studio / Xcode

```bash
npx cap open android
npx cap open ios
```

Build & run on a device. The web placeholders disappear automatically
(`isNative()` flips to `true`) and real Unity ads render in their place.

## Notes

- All ad calls are wrapped in try/catch — a failed ad never breaks the UI.
- Rewarded ads only grant rewards when the user watches the full video.
- Banner is rendered *over* the reserved slot by Unity's overlay; the web
  placeholder hides itself in native builds.
