#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# ReplySage — Capacitor + Start.io Ads bootstrap
#
# Run ONCE on your local machine after pulling the project from GitHub:
#   chmod +x scripts/setup-capacitor.sh
#   ./scripts/setup-capacitor.sh
#
# Requirements:
#   - Node.js 20+
#   - Java 17 + Android Studio (for Android)
#   - Xcode 15+ (for iOS, macOS only)
# -----------------------------------------------------------------------------
set -euo pipefail

echo "▶ Installing project dependencies…"
npm install

echo "▶ Installing Capacitor core + Start.io plugin…"
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios
npm install cordova-plugin-startapp

echo "▶ Building web assets…"
npm run build

echo "▶ Adding Android platform…"
if [ ! -d "android" ]; then
  npx cap add android
fi

echo "▶ Adding iOS platform (skipped on non-mac)…"
if [[ "$OSTYPE" == "darwin"* ]] && [ ! -d "ios" ]; then
  npx cap add ios
fi

echo "▶ Syncing native projects…"
npx cap sync

cat <<EOF

✅ Done! Next steps:

  Android:   npx cap open android   → Build > Generate Signed Bundle/APK
  iOS:       npx cap open ios       → Product > Archive

To verify ads are wired up, watch logcat (Android Studio) or Xcode console
for the line:
  [AdService] initializing Start.io { appId: "179628114", platform: "android", testMode: false }
EOF
