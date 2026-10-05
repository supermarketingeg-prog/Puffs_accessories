export type SettingsMap = Record<string, string>;

export type Category = {
  id: number;
  slug: string;
  name_ar: string;
  name_en: string;
  image_url: string;
  sort_order: number;
  active: boolean;
};

export type Product = {
  id: number;
  slug: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  category_id: number | null;
  price: number;
  compare_at: number | null;
  image_url: string;
  featured: boolean;
  in_stock: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Banner = {
  id: number;
  title: string;
  subtitle: string;
  image_url: string;
  link_url: string;
  sort_order: number;
  active: boolean;
};

export type Order = {
  id: number;
  customer_name: string;
  phone: string;
  address: string;
  notes: string;
  items_json: string;
  total: number;
  status: string;
  created_at: string;
};

export type Storefront = {
  settings: SettingsMap;
  banners: Banner[];
  categories: Category[];
  products: Product[];
};

export type CartItem = {
  productId: number;
  slug: string;
  name: string;
  price: number;
  image: string;
  qty: number;
};

export const DEFAULT_SETTINGS: SettingsMap = {
  brand_name: "Puffs Accessories",
  tagline: "Because it's the ACCESSORIES that make or break the look",
  tagline_ar: "الإكسسوارات هي اللي بتكمل اللوك",
  announcement: "توصيل لكل محافظات مصر · اطلب عبر واتساب",
  about_ar:
    "بَفس إكسسوارز محل إكسسوارات حريمي في السويس. قطع ذهبية ولؤلؤ ناعمة تكمّل إطلالتك.",
  about_en: "Puffs Accessories is a women's jewelry boutique in Suez.",
  phone: "+201284384076",
  whatsapp: "201284384076",
  instagram: "https://www.instagram.com/puffs_accessories",
  facebook: "https://www.facebook.com/puffsaccessories",
  address: "السويس — شارع مكتبة الكيال",
  hours: "من 12 الظهر حتى 9 مساءً",
  hero_title: "Puffs",
  hero_subtitle: "الإكسسوارات هي اللي بتكمل اللوك",
  hero_image: "/images/hero.jpg",
  logo_url: "/images/emblem.jpg",
  supabase_url: "https://nttdxpsqpyokzqyihmcr.supabase.co",
  supabase_key: "",
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, slug: "earrings", name_ar: "أقراط", name_en: "Earrings", image_url: "/images/cat-earrings.jpg", sort_order: 1, active: true },
  { id: 2, slug: "necklaces", name_ar: "سلاسل وعقود", name_en: "Necklaces", image_url: "/images/cat-necklaces.jpg", sort_order: 2, active: true },
  { id: 3, slug: "bracelets", name_ar: "أساور", name_en: "Bracelets", image_url: "/images/cat-bracelets.jpg", sort_order: 3, active: true },
  { id: 4, slug: "sets", name_ar: "أطقم", name_en: "Sets", image_url: "/images/cat-sets.jpg", sort_order: 4, active: true },
  { id: 5, slug: "rings", name_ar: "خواتم", name_en: "Rings", image_url: "/products/crystal-ring.jpg", sort_order: 5, active: true },
  { id: 6, slug: "hair", name_ar: "إكسسوارات شعر", name_en: "Hair", image_url: "/products/pearl-clip.jpg", sort_order: 6, active: true },
];

export const DEFAULT_PRODUCTS: Product[] = [
  { id: 1, slug: "pearl-layers", name_ar: "عقد لؤلؤ طبقات", name_en: "Layered Pearl Necklace", description_ar: "عقد طبقات من اللؤلؤ الناعم مع لمسات ذهبية.", description_en: "Soft layered pearls with gold accents.", category_id: 2, price: 320, compare_at: 390, image_url: "/products/pearl-layers.jpg", featured: true, in_stock: true, sort_order: 1, created_at: "2026-01-01T00:00:00.000Z", updated_at: "2026-01-01T00:00:00.000Z" },
  { id: 2, slug: "gold-hoops", name_ar: "حلق ذهب دائري", name_en: "Gold Hoop Earrings", description_ar: "حلق دائري مذهب بحجم أنيق.", description_en: "Polished gold-plated hoops.", category_id: 1, price: 145, compare_at: 180, image_url: "/products/gold-hoops.jpg", featured: true, in_stock: true, sort_order: 2, created_at: "2026-01-01T00:00:00.000Z", updated_at: "2026-01-01T00:00:00.000Z" },
  { id: 3, slug: "gold-bangle", name_ar: "أسورة ذهب سميكة", name_en: "Chunky Gold Bangle", description_ar: "أسورة سميكة ذهبية تعطي حضور مميز.", description_en: "A sculptural gold-plated bangle.", category_id: 3, price: 280, compare_at: 340, image_url: "/products/gold-bangle.jpg", featured: true, in_stock: true, sort_order: 3, created_at: "2026-01-01T00:00:00.000Z", updated_at: "2026-01-01T00:00:00.000Z" },
  { id: 4, slug: "pearl-set", name_ar: "طقم لؤلؤ أنيق", name_en: "Pearl Evening Set", description_ar: "طقم لؤلؤ: عقد قصير + حلق + أسورة رفيعة.", description_en: "A complete pearl set.", category_id: 4, price: 490, compare_at: 580, image_url: "/products/pearl-set.jpg", featured: true, in_stock: true, sort_order: 4, created_at: "2026-01-01T00:00:00.000Z", updated_at: "2026-01-01T00:00:00.000Z" },
  { id: 5, slug: "pearl-pendant", name_ar: "سلسلة لؤلؤ معلقة", name_en: "Pearl Pendant Chain", description_ar: "سلسلة ذهبية رقيقة مع لؤلؤة واحدة.", description_en: "A dainty gold chain with a single pearl drop.", category_id: 2, price: 195, compare_at: null, image_url: "/products/pearl-pendant.jpg", featured: true, in_stock: true, sort_order: 5, created_at: "2026-01-01T00:00:00.000Z", updated_at: "2026-01-01T00:00:00.000Z" },
  { id: 6, slug: "crystal-ring", name_ar: "خاتم كريستال", name_en: "Crystal Stone Ring", description_ar: "خاتم مذهب بفصة كريستال تلمع.", description_en: "Gold-plated ring with a small crystal stone.", category_id: 5, price: 120, compare_at: 150, image_url: "/products/crystal-ring.jpg", featured: false, in_stock: true, sort_order: 6, created_at: "2026-01-01T00:00:00.000Z", updated_at: "2026-01-01T00:00:00.000Z" },
  { id: 7, slug: "pearl-clip", name_ar: "توكة شعر لؤلؤ", name_en: "Pearl Hair Barrette", description_ar: "توكة شعر بلؤلؤ وذهب.", description_en: "A pearl-and-gold barrette.", category_id: 6, price: 95, compare_at: null, image_url: "/products/pearl-clip.jpg", featured: true, in_stock: true, sort_order: 7, created_at: "2026-01-01T00:00:00.000Z", updated_at: "2026-01-01T00:00:00.000Z" },
  { id: 8, slug: "crystal-drops", name_ar: "حلق كريستال متدلي", name_en: "Crystal Drop Earrings", description_ar: "حلق طويل بفصوص كريستال لامعة.", description_en: "Elongated crystal drops.", category_id: 1, price: 165, compare_at: 210, image_url: "/products/crystal-drops.jpg", featured: false, in_stock: true, sort_order: 8, created_at: "2026-01-01T00:00:00.000Z", updated_at: "2026-01-01T00:00:00.000Z" },
];

export const DEFAULT_BANNERS: Banner[] = [
  { id: 1, title: "Puffs", subtitle: "الإكسسوارات هي اللي بتكمل اللوك", image_url: "/images/hero.jpg", link_url: "/shop", sort_order: 1, active: true },
  { id: 2, title: "أطقم الهدية", subtitle: "اختاري طقم كامل جاهز يتغلف بهدية", image_url: "/images/cat-sets.jpg", link_url: "/shop?cat=sets", sort_order: 2, active: true },
  { id: 3, title: "لؤلؤ وذهب", subtitle: "قطع ناعمة للبس اليومي", image_url: "/images/cat-necklaces.jpg", link_url: "/shop?cat=necklaces", sort_order: 3, active: true },
];
