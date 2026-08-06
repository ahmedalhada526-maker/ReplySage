import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor configuration for ReplySage.
 *
 * Ads are served by Start.io (StartApp). The App ID below must match the
 * app registered in the Start.io dashboard.
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
    StartApp: {
      appId: "179628114",
      testMode: false,
      returnAds: false,
    },
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: "#0A0A0B",
      showSpinner: false,
    },
  },
};


export default config;
