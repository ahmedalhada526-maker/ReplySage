# Start.io (StartApp) — إعلانات التطبيق (APK)

## لماذا لا تظهر الإعلانات في APK جاهز من موقع تحويل؟

إذا حوّلت الموقع بأداة عامة (WebIntoApp، Median، WebViewGold…) فالتطبيق مجرد
WebView، ولا يوجد SDK أصلي — لذلك **لن تظهر أي إعلانات**، لا بانر ولا فيديو
بمكافأة. الحل الوحيد هو بناء التطبيق عبر **Capacitor** مع إضافة Start.io.

## الخطوات

```bash
# 1. التبعيات
npm install
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios

# 2. إضافة Start.io (Cordova plugin يعمل داخل Capacitor)
npm install cordova-plugin-startapp

# 3. بناء الويب ثم إضافة أندرويد
npm run build
npx cap add android
npx cap sync android

# 4. فتح Android Studio وبناء APK موقّع
npx cap open android
```

للـ iOS: `npx cap add ios && npx cap sync ios && npx cap open ios`

## المعرّفات

| العنصر            | القيمة      |
| ----------------- | ----------- |
| Start.io App ID   | `179628114` |

الـ App ID موجود في `capacitor.config.ts` وفي `src/lib/ads/AdService.ts`
(الثابت `STARTIO_APP_ID`). عدّله إن أنشأت تطبيقاً جديداً في لوحة Start.io.

## أنواع الإعلانات المفعّلة

| النوع                  | الموضع                                               |
| ---------------------- | ---------------------------------------------------- |
| Banner                 | شريط ثابت أسفل كل شاشة (`showBanner("bottom")`)      |
| Interstitial           | كل 3 عمليات تحليل + إعلان عند فتح التطبيق            |
| **Rewarded Video**     | فك قفل الاستراتيجيات والنتائج المموّهة (Gold Button) |

## وضع الاختبار

في `src/lib/ads/init-ads.ts`:

```ts
const TEST_MODE = false; // اجعلها true أثناء التطوير
```

## app-ads.txt

Start.io تطلب رفع ملف `app-ads.txt` على نطاق موقعك المُعلن في المتجر.
ضع محتوى الملف الذي زوّدتك به لوحة Start.io في `public/app-ads.txt`
ليُخدَم على `https://replysage.lovable.app/app-ads.txt`.

## التحقق من العمل

وصّل الجهاز عبر USB، افتح `chrome://inspect` واختر التطبيق، وابحث في الـ Console عن:

```
[AdService] initializing Start.io { appId: "179628114", platform: "android", testMode: false }
```

إذا ظهر بدلاً منها:

```
[AdService] not native — Start.io disabled (web/WebView without plugin)
```

فالإضافة غير مثبّتة في البناء — أعد الخطوات أعلاه.
