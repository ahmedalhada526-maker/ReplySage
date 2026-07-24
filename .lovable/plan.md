الخطوات المتبقية لإكمال ربط Google Search Console لتطبيق PersonaPulse AI:

1. تفعيل موصل Google Search Console
   - استدعاء `standard_connectors--connect` مع `connector_id: "google_search_console"`.
   - يظهر للمستخدم نافذة OAuth داخل المحادثة للموافقة على ربط حساب Google.
   - بعد الموافقة، يصبح الاتصال متاحًا للمشروع.

2. الحصول على رمز التحقق (META verification token)
   - استدعاء واجهة Google Search Console عبر Lovable Connector Gateway لطلب رمز تحقق من نوع META.
   - الموقع المطلوب التحقق منه: `https://person-plus-ai.lovable.app/`.

3. إضافة علامة التحقق في HTML
   - إدراج وسم `<meta name="google-site-verification" content="<TOKEN>" />` في `<head>` داخل `src/routes/__root.tsx`.
   - هذا يضمن ظهور العلامة على جميع الصفحات العامة.

4. نشر التطبيق
   - يجب نشر التطبيق حتى تصبح علامة التحقق متاحة على الموقع المباشر، لأن Google يقرأها من النسخة المنشورة فقط.

5. إثبات الملكية في Google Search Console
   - استدعاء نقطة نهاية `siteVerification/v1/webResource` عبر الـ Gateway لتأكيد الملكية.
   - عند النجاح، يصبح الموقع مملوكًا في Google Search Console.

6. إضافة الموقع إلى Search Console
   - استدعاء `webmasters/v3/sites/https%3A%2F%2Fperson-plus-ai.lovable.app%2F` لإضافة الموقع إلى قائمة المواقع.

7. إرسال خريطة الموقع
   - إرسال `https://person-plus-ai.lovable.app/sitemap.xml` إلى Google Search Console عبر نقطة النهاية المناسبة.
   - ملف `public/sitemap.xml` موجود مسبقًا ويحتوي على جميع المسارات العامة.

8. التحقق النهائي
   - التأكد من عدم وجود أخطاء في الاستجابات.
   - تحديث حالة `gsc:gsc` في SEO findings إلى `fixed`.

ملاحظة: لا يمكن تنفيذ الخطوة 1 بدون موافقة المستخدم على OAuth، لذا ستبدأ العملية بعرض نافذة الربط أمامك.