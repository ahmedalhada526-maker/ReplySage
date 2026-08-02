import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor configuration for ReplySage.
 *
 * App ID matches the Unity Ads dashboard registration so that
 * `capacitor-unity-ads` can resolve the correct Game ID at runtime.
 */
const config: CapacitorConfig = {
  appId: "app.persona.pulse",
  appName: "ReplySage",
  webDir: "dist",
  bundledWebRuntime: false,
  server: {
    androidScheme: "https",
    // For local development against the Lovable preview, uncomment:
    // url: "https://id-preview--dd7ac2bd-428c-4c8a-a6f8-1677242d6a58.lovable.app",
    // cleartext: true,
  },
  android: {
    allowMixedContent: false,
  },
  ios: {
    contentInset: "always",
  },
  plugins: {
    UnityAds: {
      // These IDs are read by capacitor-unity-ads at init time.
      androidGameId: "6100246",
      iosGameId: "6100247",
      testMode: false,
    },
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: "#0A0A0B",
      showSpinner: false,
    },
  },
};

export default config;
