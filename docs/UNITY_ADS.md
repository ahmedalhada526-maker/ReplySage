# Unity Ads — لماذا لا تظهر الإعلانات في الـ APK؟

## ⚠️ المشكلة الأكثر شيوعاً

إذا حوّلت الموقع إلى APK باستخدام أداة عامة (WebIntoApp، Median، WebViewGold،
Apk Builder، إلخ)، فإن التطبيق هو **مجرد WebView يعرض الموقع كصفحة ويب**.
في هذه الحالة:

- ❌ Unity Ads **لن تعمل أبداً** — لأن SDK يحتاج كود native (Java/Kotlin أو Swift).
- ❌ الـ Banner و Interstitial و Rewarded كلها no-op.
- ✅ كل ما يظهر هو الـ placeholder الرمادي السفلي للـ banner (وهو placeholder ويب فقط).

## ✅ الحل الصحيح: Capacitor + إضافة Unity Ads

يجب بناء التطبيق عبر **Capacitor** مع إضافة `capacitor-unity-ads`. الكود في
`AdService.ts` يكتشف الإضافة تلقائياً عبر `window.Capacitor.Plugins.UnityAds`
ويُفعّل الإعلانات الحقيقية. ملف `capacitor.config.ts` جاهز في جذر المشروع.

### الطريقة السريعة (سكريبت جاهز)

```bash
chmod +x scripts/setup-capacitor.sh
./scripts/setup-capacitor.sh
```

### أو يدوياً:

```bash
# 1. تثبيت Capacitor + الإضافة
npm install
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npm install capacitor-unity-ads

# 2. بناء الويب (capacitor.config.ts موجود مسبقاً)
npm run build

# 3. إضافة Android
npx cap add android
npx cap sync android

# 4. فتح في Android Studio وبناء APK موقّع
npx cap open android
```

### للـ iOS:

```bash
npx cap add ios
npx cap sync ios
npx cap open ios
```

## معرفات Unity (مُهيّأة في الكود)

| العنصر            | القيمة                                 |
| ----------------- | -------------------------------------- |
| Unity Project ID  | `e64c9f9f-eb1e-44a0-b94a-2994061da3f7` |
| Game ID — Android | `6100246`                              |
| Game ID — iOS     | `6100247`                              |

| النوع        | Android                | iOS                | الموضع                  |
| ------------ | ---------------------- | ------------------ | ----------------------- |
| Banner       | `Banner_Android`       | `Banner_iOS`       | شريط ثابت أسفل كل شاشة  |
| Interstitial | `Interstitial_Android` | `Interstitial_iOS` | كل 3 مسوحات + إعلان فتح |
| Rewarded     | `Rewarded_Android`     | `Rewarded_iOS`     | فك قفل الاستراتيجيات    |

## وضع الاختبار

في `src/lib/ads/init-ads.ts`:

```ts
const TEST_MODE = false; // اجعلها true أثناء التطوير لتجنّب مخالفة سياسة Unity
```

## كيف أعرف أن الإعلانات فُعّلت في الـ APK؟

افتح Chrome على الكمبيوتر، وصِل الجهاز عبر USB، ثم افتح:
`chrome://inspect` → اختر التطبيق → Console.

ابحث عن سطر:

```
[AdService] initializing Unity Ads { gameId: "6100246", platform: "android", testMode: false }
```

إذا رأيت بدلاً من ذلك:

```
[AdService] not native — ads disabled (web/WebView without plugin)
```

فهذا يعني أن إضافة Capacitor Unity Ads غير مُثبّتة في الـ APK — راجع الخطوات أعلاه.
