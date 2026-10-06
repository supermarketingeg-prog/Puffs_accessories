# Puffs Accessories

موقع محل إكسسوارات حريمي في السويس — شارع مكتبة الكيال.

- الموقع: متجر + سلة + طلب واتساب
- لوحة التحكم `/admin`: صور، أسعار، بانر، نصوص، طلبات
- فيسبوك: https://www.facebook.com/puffsaccessories
- إنستجرام: https://www.instagram.com/puffs_accessories
- واتساب: +201284384076
- GitHub: https://github.com/supermarketingeg-prog/Puffs_accessories
- Supabase: https://qmummabspnyylopokaoh.supabase.co

## للعميل

1. افتحي `/admin` وسجّلي الدخول بكلمة الأدمن المخصصة في Vercel.
2. عدّلي المنتجات والصور والأسعار من تبويب المنتجات.
3. غيّري البانر من تبويب البانر.
4. النصوص ورقم الهاتف وروابط السوشيال من الإعدادات.
5. نفّذي `supabase/schema.sql` ثم `supabase/puffs-storage.sql` مرة واحدة من SQL Editor داخل Supabase.
6. أضيفي في Vercel متغيرات `SUPABASE_URL` و`SUPABASE_SERVICE_ROLE_KEY` و`ADMIN_PASSWORD` و`ADMIN_SESSION_SECRET` في Production وPreview. لا تضعي المفاتيح في لوحة الأدمن.

الطلبات بتتحفظ في اللوحة وبتتفتح كمان على واتساب جاهزة للإرسال.
