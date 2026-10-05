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
