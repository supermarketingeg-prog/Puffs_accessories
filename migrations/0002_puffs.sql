-- Puffs Accessories catalog, CMS, and orders

create table if not exists store_admins (
  user_id text primary key,
  created_at timestamptz not null default now()
);

create table if not exists site_settings (
  key text primary key,
  value text not null default ''
);

create table if not exists categories (
  id serial primary key,
  slug text not null unique,
  name_ar text not null,
  name_en text not null,
  image_url text not null default '',
  sort_order integer not null default 0,
  active boolean not null default true
);

create table if not exists products (
  id serial primary key,
  slug text not null unique,
  name_ar text not null,
  name_en text not null,
  description_ar text not null default '',
  description_en text not null default '',
  category_id integer references categories(id) on delete set null,
  price integer not null default 0,
  compare_at integer,
  image_url text not null default '',
  featured boolean not null default false,
  in_stock boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists banners (
  id serial primary key,
  title text not null default '',
  subtitle text not null default '',
  image_url text not null,
  link_url text not null default '/shop',
  sort_order integer not null default 0,
  active boolean not null default true
);

create table if not exists orders (
  id serial primary key,
  customer_name text not null,
  phone text not null,
  address text not null default '',
  notes text not null default '',
  items_json text not null,
  total integer not null default 0,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on products (category_id);
create index if not exists products_featured_idx on products (featured);
create index if not exists orders_created_at_idx on orders (created_at desc);

insert into site_settings (key, value) values
  ('brand_name', 'Puffs Accessories'),
  ('tagline', 'Because it''s the ACCESSORIES that make or break the look'),
  ('tagline_ar', 'الإكسسوارات هي اللي بتكمل اللوك'),
  ('announcement', 'توصيل لكل محافظات مصر · اطلب عبر واتساب'),
  ('about_ar', 'بَفس إكسسوارز محل إكسسوارات حريمي في السويس. قطع ذهبية ولؤلؤ ناعمة تكمّل إطلالتك اليومية والمناسبات — بجودة تليق بذوقك وبسعر يفرّحك. بنختار كل قطعة بعناية عشان اللوك يبقى كامل من غير ما تشيلي هم التفاصيل.'),
  ('about_en', 'Puffs Accessories is a women''s jewelry boutique in Suez. Gold-plated and pearl pieces that finish the look — chosen with care for everyday elegance and special nights.'),
  ('phone', '+201284384076'),
  ('whatsapp', '201284384076'),
  ('instagram', 'https://www.instagram.com/puffs_accessories'),
  ('facebook', 'https://www.facebook.com/puffsaccessories'),
  ('address', 'السويس — شارع مكتبة الكيال'),
  ('hours', 'من 12 الظهر حتى 9 مساءً'),
  ('hero_title', 'Puffs'),
  ('hero_subtitle', 'الإكسسوارات هي اللي بتكمل اللوك'),
  ('hero_image', '/images/hero.jpg'),
  ('logo_url', '/images/emblem.jpg'),
  ('supabase_url', 'https://qmummabspnyylopokaoh.supabase.co'),
  ('supabase_key', '')
on conflict (key) do nothing;

insert into categories (slug, name_ar, name_en, image_url, sort_order) values
  ('earrings', 'أقراط', 'Earrings', '/images/cat-earrings.jpg', 1),
  ('necklaces', 'سلاسل وعقود', 'Necklaces', '/images/cat-necklaces.jpg', 2),
  ('bracelets', 'أساور', 'Bracelets', '/images/cat-bracelets.jpg', 3),
  ('sets', 'أطقم', 'Sets', '/images/cat-sets.jpg', 4),
  ('rings', 'خواتم', 'Rings', '/products/crystal-ring.jpg', 5),
  ('hair', 'إكسسوارات شعر', 'Hair', '/products/pearl-clip.jpg', 6)
on conflict (slug) do nothing;

insert into products (slug, name_ar, name_en, description_ar, description_en, category_id, price, compare_at, image_url, featured, sort_order)
select
  v.slug, v.name_ar, v.name_en, v.description_ar, v.description_en, c.id, v.price, v.compare_at, v.image_url, v.featured, v.sort_order
from (values
  ('pearl-layers', 'عقد لؤلؤ طبقات', 'Layered Pearl Necklace',
   'عقد طبقات من اللؤلؤ الناعم مع لمسات ذهبية. يلبس لوحده أو فوق قميص بيج أو أسود وبيغيّر اللوك بالكامل.',
   'Soft layered pearls with gold accents. Wear alone or over a simple blouse.',
   'necklaces', 320, 390, '/products/pearl-layers.jpg', true, 1),
  ('gold-hoops', 'حلق ذهب دائري', 'Gold Hoop Earrings',
   'حلق دائري مذهب بحجم أنيق يناسب اللبس اليومي والمناسبات. خفيف على الودن ولمّاع من غير مبالغة.',
   'Polished gold-plated hoops. Light, everyday elegant.',
   'earrings', 145, 180, '/products/gold-hoops.jpg', true, 2),
  ('gold-bangle', 'أسورة ذهب سميكة', 'Chunky Gold Bangle',
   'أسورة سميكة ذهبية تعطي حضور من غير ما تتعب الإيد. قطعة ستيتمنت للطلعات والسهرات.',
   'A sculptural gold-plated bangle with quiet presence.',
   'bracelets', 280, 340, '/products/gold-bangle.jpg', true, 3),
  ('pearl-set', 'طقم لؤلؤ أنيق', 'Pearl Evening Set',
   'طقم لؤلؤ: عقد قصير + حلق + أسورة رفيعة. جاهز للهدايا والمناسبات.',
   'A complete pearl set: necklace, studs, and a slim bracelet.',
   'sets', 490, 580, '/products/pearl-set.jpg', true, 4),
  ('pearl-pendant', 'سلسلة لؤلؤ معلقة', 'Pearl Pendant Chain',
   'سلسلة ذهبية رقيقة مع لؤلؤة واحدة. قطعة يومية ناعمة على الرقبة.',
   'A dainty gold chain with a single pearl drop.',
   'necklaces', 195, null, '/products/pearl-pendant.jpg', true, 5),
  ('crystal-ring', 'خاتم كريستال', 'Crystal Stone Ring',
   'خاتم مذهب بفصة كريستال تلمع مع حركة الإيد. متوفر كقطعة مميزة للهدايا.',
   'Gold-plated ring with a small crystal stone.',
   'rings', 120, 150, '/products/crystal-ring.jpg', false, 6),
  ('pearl-clip', 'توكة شعر لؤلؤ', 'Pearl Hair Barrette',
   'توكة شعر بلؤلؤ وذهب. تلمّ الشعر وتضيف لمسة ناعمة للمحجبات والشعر المكشوف.',
   'A pearl-and-gold barrette that finishes a bun or scarf look.',
   'hair', 95, null, '/products/pearl-clip.jpg', true, 7),
  ('crystal-drops', 'حلق كريستال متدلي', 'Crystal Drop Earrings',
   'حلق طويل بفصوص كريستال لامعة. للسهرات والمناسبات اللي محتاجة لمعة هادية.',
   'Elongated crystal drops in gold-plated metal.',
   'earrings', 165, 210, '/products/crystal-drops.jpg', false, 8)
) as v(slug, name_ar, name_en, description_ar, description_en, cat_slug, price, compare_at, image_url, featured, sort_order)
join categories c on c.slug = v.cat_slug
on conflict (slug) do nothing;

insert into banners (title, subtitle, image_url, link_url, sort_order, active) values
  ('Puffs', 'الإكسسوارات هي اللي بتكمل اللوك', '/images/hero.jpg', '/shop', 1, true),
  ('أطقم الهدية', 'اختاري طقم كامل جاهز يتغلف بهدية', '/images/cat-sets.jpg', '/shop?cat=sets', 2, true),
  ('لؤلؤ وذهب', 'قطع ناعمة للبس اليومي', '/images/cat-necklaces.jpg', '/shop?cat=necklaces', 3, true);
