# إعادة تسمية التطبيق: ReplyGenie → ReplySage

الاسم **ReplyGenie** محجوز من منافسين نشطين في نفس المجال (replygenie.io + إضافة Firefox)، فلا يصلح تجاريًا ولا بحثيًا. الاسم البديل **ReplySage** تم التحقق من توفره عبر 3 عمليات بحث — لا منافس يستخدمه.

**المرجع:** ReplyGenie → ReplySage (استبدال حرفي عالمي في النصوص الظاهرة). الحروف الكبيرة: "ReplySage". الصغيرة في الأكواد/الأسماء: "replysage".

## الملفات المطلوب تعديلها

### 1. بيانات SEO والواجهة (المسارات/routes)

استبدال كل ظهور لـ `ReplyGenie` بـ `ReplySage` في عناوين الصفحات، أوصاف meta، og:title، twitter:title، و JSON-LD:

- `src/routes/index.tsx` — العنوان العربي: "مولّد الردود الذكية بالذكاء الاصطناعي | ReplySage"
- `src/routes/en.tsx` — العنوان الإنجليزي: "AI Reply Generator & Response Writer | ReplySage"
- `src/routes/__root.tsx` — author، og:site_name، Organization/WebSite JSON-LD (الاسمان)
- `src/routes/ai-reply-generator.tsx` — العنوان + اسم المنتج في JSON-LD + نصوص FAQ/body (13 ظهور)
- `src/routes/how-to-reply.tsx` — العنوان + Organization JSON-LD
- `src/routes/tactics-guide.tsx` — العنوان + og:title + JSON-LD + عنوان H2 ونص body
- `src/routes/history.tsx` — العنوان + الوصف + og:title + نص سياسة الخصوصية (عربي/إنجليزي)
- `src/routes/settings.tsx` — العنوان + og:title + الأوصاف

### 2. النظام الذكي (AI system prompts)

- `src/lib/analyze.functions.ts` (سطر 89): "You are ReplyGenie — a master..." → "You are ReplySage — a master..."
- `src/lib/analyze.functions.ts` (سطر 273): "You are ReplyGenie's Silencer module..." → "You are ReplySage's Silencer module..."

### 3. التدويل (i18n)

- `src/lib/i18n.ts` (سطر 7): `app_name: "ReplyGenie"` → `"ReplySage"`
- `src/lib/i18n.ts` (سطر 15 و 132): استبدال "ReplyGenie" داخل وصف التطبيق (إنجليزي/عربي)

### 4. المكوّنات (Components)

- `src/components/persona/PersonaWorkspace.tsx` (سطر 160): اسم ملف التصدير `replygenie-...` → `replysage-...`
- `src/components/persona/PersonaWorkspace.tsx` (سطر 212): عنوان H1 "ReplyGenie — Your AI Reply Coach..." → "ReplySage — Your AI Reply Coach..."
- `src/components/persona/PersonaWorkspace.tsx` (سطر 335): الوصف الافتراضي
- `src/components/persona/StoryCard.tsx` (سطر 53): "ReplyGenie" → "ReplySage"
- `src/components/persona/StoryCard.tsx` (سطر 172): "replygenie.ai" → "replysage.ai"

### 5. الملفات المساندة

- `src/lib/export-story.ts` (سطر 9): `filename = "replygenie-story.png"` → `"replysage-story.png"`
- `public/llms.txt` (السطران 1 و 5): استبدال اسم التطبيق والوصف
- `src/styles.css` (سطر 8): تعليق التصميم
- `capacitor.config.ts` (السطران 4 و 11): التعليق + `appName: "PersonaPulse"` → `"ReplySage"`
- `scripts/setup-capacitor.sh` (سطر 3): التعليق

### 6. مفاتيح التخزين المحلي (localStorage) — تُترك كما هي

- `src/lib/history-store.ts`: المفاتيح `replygenie_history_v1` و `replygenie_pending_load` تبقى **دون تغيير** للحفاظ على سجل المستخدمين الحاليين. هي معرّفات داخلية غير ظاهرة ولا تؤثر على SEO.

### 7. تحديث الذاكرة

- `mem://design/app-name`: تحديث اسم التطبيق إلى ReplySage وتوثيق سبب التغيير (تعارض العلامة التجارية).
- `mem://index.md`: تحديث قاعدة Core للاسم الجديد.

### 8. الفافيكون (اختياري)

- الفافيكون الحالي (فقاعة كلام ذهبية) لا يحتوي نصًا — لا تغيير مطلوب ما لم ترد تصميمًا جديدًا.

## التحقق

- تشغيل `rg -i "ReplyGenie" .` والتأكد من صفر نتائج في الملفات الظاهرة (ما عدا مفاتيح localStorage المتروكة عمدًا).
- فحص البناء للتأكد من عدم وجود أخطاء.
- فتح المعاينة للتأكد من ظهور ReplySage في العنوان، H1، والواجهة.

## ملاحظة للمستخدم

- تغيير الاسم في محركات البحث لن يظهر فورًا — يحتاج جوجل لإعادة الزحف بعد النشر.
- مفاتيح localStorage محفوظة كما هي حتى لا يفقد المستخدمون الحاليون سجلهم.
