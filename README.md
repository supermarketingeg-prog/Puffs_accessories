# Puffs Accessories

موقع محل إكسسوارات حريمي في السويس — شارع مكتبة الكيال.

- الموقع: متجر + سلة + طلب واتساب
- لوحة التحكم `/admin`: صور، أسعار، بانر، نصوص، طلبات
- فيسبوك: https://www.facebook.com/puffsaccessories
- إنستجرام: https://www.instagram.com/puffs_accessories
- واتساب: +201284384076
- GitHub: https://github.com/supermarketingeg-prog/Puffs_accessories
- Supabase: https://nttdxpsqpyokzqyihmcr.supabase.co

## للعميل

1. افتحي `/admin` وسجّلي حساب (أول حساب يبقى أدمن).
2. عدّلي المنتجات والصور والأسعار من تبويب المنتجات.
3. غيّري البانر من تبويب البانر.
4. النصوص ورقم الهاتف وروابط السوشيال من الإعدادات.
5. النشر على Vercel يحتاج متغيرات البيئة التالية (Production / Preview):
   - `DATABASE_URL`: رابط الاتصال المباشر أو Session Pooler من Supabase (وليس رابط المشروع أو الـ publishable key).
   - `BETTER_AUTH_URL`: رابط الموقع المنشور على Vercel.
   - `BETTER_AUTH_SECRET`: قيمة عشوائية طويلة تحفظ كسر.
6. أول نشر يطبق الجداول والبيانات التجريبية تلقائياً من `migrations/`. بعد ذلك افتحي `/login` وأنشئي حساب الإدارة؛ أول حساب يصبح مدير المتجر.

مفتاح Supabase الـ publishable مناسب لتطبيقات المتصفح، لكنه لا يكفي لتشغيل قاعدة بيانات المتجر من Vercel. لا تضعي `DATABASE_URL` أو أي مفتاح سري داخل GitHub.

الطلبات بتتحفظ في اللوحة وبتتفتح كمان على واتساب جاهزة للإرسال.
