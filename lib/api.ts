import { createServerFn } from "@tanstack/react-start";
import { endAdminSession, requireAdminSession, startAdminSession } from "@/lib/admin-auth.server";
import { getSql } from "@/lib/db";
import {
  DEFAULT_SETTINGS,
  DEFAULT_CATEGORIES,
  DEFAULT_PRODUCTS,
  DEFAULT_BANNERS,
  type Banner,
  type Category,
  type Order,
  type Product,
  type SettingsMap,
  type Storefront,
} from "@/lib/types";
import { z } from "zod";

function asSettings(rows: { key: string; value: string }[]): SettingsMap {
  const out = { ...DEFAULT_SETTINGS };
  for (const row of rows) out[row.key] = row.value;
  return out;
}

async function syncSupabase(table: string, rows: Record<string, unknown>[], conflictColumn = "id") {
  if (rows.length === 0) return;
  const { url, key } = await getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/${table}?on_conflict=${conflictColumn}`, {
    method: "POST",
    headers: supabaseHeaders(key, {
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    }),
    body: JSON.stringify(rows),
  });
  await assertSupabaseResponse(response, `حفظ ${table}`);
}

async function deleteSupabase(table: string, id: number) {
  const { url, key } = await getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/${table}?id=eq.${id}`, {
    method: "DELETE",
    headers: supabaseHeaders(key, { Prefer: "return=minimal" }),
  });
  await assertSupabaseResponse(response, `حذف ${table}`);
}

const DEFAULT_SUPABASE_URL = "https://qmummabspnyylopokaoh.supabase.co";
const STORAGE_BUCKET = "puffs-assets";

function supabaseHeaders(key: string, extra: Record<string, string> = {}) {
  return { apikey: key, Authorization: `Bearer ${key}`, ...extra };
}

async function getSupabaseConfig() {
  const url = (process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL).replace(/\/+$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Supabase غير مُعدّ. أضيفي SUPABASE_SERVICE_ROLE_KEY في إعدادات Vercel.");
  return { url, key };
}

async function assertSupabaseResponse(response: Response, action: string) {
  if (response.ok) return;
  const details = (await response.text()).slice(0, 300);
  throw new Error(`تعذر ${action} في Supabase (${response.status})${details ? `: ${details}` : ""}`);
}

function assetPath(url: string, projectUrl: string) {
  const prefix = `${projectUrl}/storage/v1/object/public/${STORAGE_BUCKET}/`;
  return url.startsWith(prefix) ? url.slice(prefix.length) : null;
}

async function deleteSupabaseAsset(url: string) {
  const config = await getSupabaseConfig();
  const path = assetPath(url, config.url);
  if (!path) return;
  const response = await fetch(`${config.url}/storage/v1/object/${STORAGE_BUCKET}/${path}`, {
    method: "DELETE",
    headers: supabaseHeaders(config.key),
  });
  await assertSupabaseResponse(response, "حذف الصورة");
}

export const uploadImage = createServerFn({ method: "POST" })
  .validator(z.object({ dataUrl: z.string().startsWith("data:image/"), folder: z.enum(["products", "banners", "settings"]) }))
  .handler(async ({ data }) => {
    requireAdminSession();
    const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=]+)$/.exec(data.dataUrl);
    if (!match) throw new Error("صيغة الصورة غير صالحة");
    const [, contentType, base64] = match;
    const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
    if (bytes.byteLength > 6 * 1024 * 1024) throw new Error("حجم الصورة يجب ألا يتجاوز 6 ميجابايت");
    const config = await getSupabaseConfig();
    const extension = contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
    const path = `${data.folder}/${crypto.randomUUID()}.${extension}`;
    const response = await fetch(`${config.url}/storage/v1/object/${STORAGE_BUCKET}/${path}`, {
      method: "POST",
      headers: supabaseHeaders(config.key, { "Content-Type": contentType, "x-upsert": "false" }),
      body: bytes,
    });
    await assertSupabaseResponse(response, "رفع الصورة");
    return { url: `${config.url}/storage/v1/object/public/${STORAGE_BUCKET}/${path}` };
  });

async function getSupabaseStorefront(): Promise<Storefront | null> {
  try {
    const { url, key } = await getSupabaseConfig();
    const headers = supabaseHeaders(key);
    const [settingsResponse, bannersResponse, categoriesResponse, productsResponse] = await Promise.all([
      fetch(`${url}/rest/v1/site_settings?select=key,value`, { headers }),
      fetch(`${url}/rest/v1/banners?active=eq.true&order=sort_order.asc,id.asc&select=*`, { headers }),
      fetch(`${url}/rest/v1/categories?active=eq.true&order=sort_order.asc,id.asc&select=*`, { headers }),
      fetch(`${url}/rest/v1/products?order=sort_order.asc,id.asc&select=*`, { headers }),
    ]);
    if (![settingsResponse, bannersResponse, categoriesResponse, productsResponse].every((response) => response.ok)) return null;
    const [settings, banners, categories, products] = await Promise.all([
      settingsResponse.json() as Promise<{ key: string; value: string }[]>,
      bannersResponse.json() as Promise<Banner[]>,
      categoriesResponse.json() as Promise<Category[]>,
      productsResponse.json() as Promise<Product[]>,
    ]);
    if (!products.length && !banners.length && !categories.length) return null;
    const map = asSettings(settings);
    delete map.supabase_key;
    return { settings: map, banners, categories, products };
  } catch {
    return null;
  }
}

export const getStorefront = createServerFn({ method: "GET" }).handler(async (): Promise<Storefront> => {
  const synced = await getSupabaseStorefront();
  if (synced) return synced;
  try {
    const sql = await getSql();
    const [settings, banners, categories, products] = await Promise.all([
      sql<{ key: string; value: string }>`select key, value from site_settings`.catch(() => []),
      sql<Banner>`select id, title, subtitle, image_url, link_url, sort_order, active from banners where active = true order by sort_order, id`.catch(() => []),
      sql<Category>`select id, slug, name_ar, name_en, image_url, sort_order, active from categories where active = true order by sort_order, id`.catch(() => []),
      sql<Product>`select id, slug, name_ar, name_en, description_ar, description_en, category_id, price, compare_at, image_url, featured, in_stock, sort_order, created_at::text as created_at, updated_at::text as updated_at from products order by sort_order, id`.catch(() => []),
    ]);
    const map = asSettings(settings);
    delete map.supabase_key;
    return {
      settings: map,
      banners: banners.length > 0 ? banners : DEFAULT_BANNERS,
      categories: categories.length > 0 ? categories : DEFAULT_CATEGORIES,
      products: products.length > 0 ? products : DEFAULT_PRODUCTS,
    };
  } catch {
    return {
      settings: DEFAULT_SETTINGS,
      banners: DEFAULT_BANNERS,
      categories: DEFAULT_CATEGORIES,
      products: DEFAULT_PRODUCTS,
    };
  }
});

export const getProductBySlug = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }): Promise<Product | null> => {
    const sql = await getSql();
    const rows = await sql<Product>`
      select id, slug, name_ar, name_en, description_ar, description_en, category_id, price, compare_at, image_url, featured, in_stock, sort_order, created_at::text as created_at, updated_at::text as updated_at
      from products where slug = ${data.slug} limit 1
    `;
    if (rows.length > 0) return rows[0];
    return DEFAULT_PRODUCTS.find((p) => p.slug === data.slug) ?? null;
  });

const orderItemSchema = z.object({
  productId: z.number(),
  slug: z.string(),
  name: z.string(),
  price: z.number(),
  qty: z.number().int().positive(),
});

export const placeOrder = createServerFn({ method: "POST" })
  .validator(
    z.object({
      customer_name: z.string().trim().min(2).max(80),
      phone: z.string().trim().min(8).max(20),
      address: z.string().trim().max(240),
      notes: z.string().trim().max(400),
      items: z.array(orderItemSchema).min(1),
    }),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const total = data.items.reduce((n, i) => n + i.price * i.qty, 0);
    const items_json = JSON.stringify(data.items);
    const rows = await sql<{ id: number }>`
      insert into orders (customer_name, phone, address, notes, items_json, total, status)
      values (${data.customer_name}, ${data.phone}, ${data.address}, ${data.notes}, ${items_json}, ${total}, 'new')
      returning id
    `;
    return { id: rows[0]?.id ?? 0, total };
  });

export const adminGetAll = createServerFn({ method: "GET" })
  .handler(async () => {
    requireAdminSession();
    const synced = await getSupabaseStorefront();
    try {
      const sql = await getSql();
      const [settings, banners, categories, products, orders] = await Promise.all([
        sql<{ key: string; value: string }>`select key, value from site_settings`.catch(() => []),
        sql<Banner>`select id, title, subtitle, image_url, link_url, sort_order, active from banners order by sort_order, id`.catch(() => []),
        sql<Category>`select id, slug, name_ar, name_en, image_url, sort_order, active from categories order by sort_order, id`.catch(() => []),
        sql<Product>`select id, slug, name_ar, name_en, description_ar, description_en, category_id, price, compare_at, image_url, featured, in_stock, sort_order, created_at::text as created_at, updated_at::text as updated_at from products order by id desc`.catch(() => []),
        sql<Order>`select id, customer_name, phone, address, notes, items_json, total, status, created_at::text as created_at from orders order by created_at desc limit 80`.catch(() => []),
      ]);
      return {
        settings: synced?.settings ?? asSettings(settings),
        banners: synced?.banners ?? (banners.length > 0 ? banners : DEFAULT_BANNERS),
        categories: synced?.categories ?? (categories.length > 0 ? categories : DEFAULT_CATEGORIES),
        products: synced?.products ?? (products.length > 0 ? products : DEFAULT_PRODUCTS),
        orders,
      };
    } catch {
      if (synced) return { ...synced, orders: [] };
      return {
        settings: DEFAULT_SETTINGS,
        banners: DEFAULT_BANNERS,
        categories: DEFAULT_CATEGORIES,
        products: DEFAULT_PRODUCTS,
        orders: [],
      };
    }
  });

export const adminLogin = createServerFn({ method: "POST" })
  .validator(z.object({ password: z.string().min(1).max(256) }))
  .handler(async ({ data }) => {
    startAdminSession(data.password);
    return { ok: true };
  });

export const adminLogout = createServerFn({ method: "POST" })
  .handler(async () => {
    endAdminSession();
    return { ok: true };
  });

export const saveSettings = createServerFn({ method: "POST" })
  .validator(z.record(z.string(), z.string()))
  .handler(async ({ data }) => {
    requireAdminSession();
    const sql = await getSql();
    const rows: { key: string; value: string }[] = [];
    for (const [key, value] of Object.entries(data)) {
      if (!/^[a-z_]+$/.test(key)) continue;
      await sql`
        insert into site_settings (key, value) values (${key}, ${value})
        on conflict (key) do update set value = excluded.value
      `;
      rows.push({ key, value });
    }
    await syncSupabase("site_settings", rows, "key");
    return { ok: true };
  });

const productInput = z.object({
  id: z.number().optional(),
  slug: z.string().trim().min(2).max(80),
  name_ar: z.string().trim().min(2).max(80),
  name_en: z.string().trim().max(80).default(""),
  description_ar: z.string().max(800).default(""),
  description_en: z.string().max(800).default(""),
  category_id: z.number().nullable(),
  price: z.number().int().min(0).max(999999),
  compare_at: z.number().int().min(0).max(999999).nullable(),
  image_url: z.string().min(1),
  featured: z.boolean(),
  in_stock: z.boolean(),
  sort_order: z.number().int().default(0),
});

export const saveProduct = createServerFn({ method: "POST" })
  .validator(productInput)
  .handler(async ({ data }) => {
    requireAdminSession();
    const slug = data.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    let id = data.id;
    const sql = await getSql();
    const previous = id
      ? await sql<{ image_url: string }>`select image_url from products where id = ${id}`
      : [];
    if (id) {
      await sql`
          update products set
            slug = ${slug}, name_ar = ${data.name_ar}, name_en = ${data.name_en},
            description_ar = ${data.description_ar}, description_en = ${data.description_en},
            category_id = ${data.category_id}, price = ${data.price}, compare_at = ${data.compare_at},
            image_url = ${data.image_url}, featured = ${data.featured}, in_stock = ${data.in_stock},
            sort_order = ${data.sort_order}, updated_at = now()
          where id = ${id}
      `;
    } else {
      const rows = await sql<{ id: number }>`
          insert into products (slug, name_ar, name_en, description_ar, description_en, category_id, price, compare_at, image_url, featured, in_stock, sort_order)
          values (${slug}, ${data.name_ar}, ${data.name_en}, ${data.description_ar}, ${data.description_en}, ${data.category_id}, ${data.price}, ${data.compare_at}, ${data.image_url}, ${data.featured}, ${data.in_stock}, ${data.sort_order})
          returning id
      `;
      id = rows[0]?.id;
    }
    if (!id) throw new Error("تعذر إنشاء المنتج");
    await syncSupabase("products", [{ ...data, slug, id }]);
    if (previous[0]?.image_url && previous[0].image_url !== data.image_url) {
      await deleteSupabaseAsset(previous[0].image_url);
    }
    return { id: id ?? 1 };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    requireAdminSession();
    const sql = await getSql();
    const previous = await sql<{ image_url: string }>`select image_url from products where id = ${data.id}`.catch(() => []);
    await deleteSupabase("products", data.id);
    await sql`delete from products where id = ${data.id}`.catch(() => []);
    if (previous[0]?.image_url) await deleteSupabaseAsset(previous[0].image_url);
    return { ok: true };
  });

const bannerInput = z.object({
  id: z.number().optional(),
  title: z.string().max(80).default(""),
  subtitle: z.string().max(160).default(""),
  image_url: z.string().min(1),
  link_url: z.string().max(200).default("/shop"),
  sort_order: z.number().int().default(0),
  active: z.boolean(),
});

export const saveBanner = createServerFn({ method: "POST" })
  .validator(bannerInput)
  .handler(async ({ data }) => {
    requireAdminSession();
    let id = data.id;
    const sql = await getSql();
    const previous = id
      ? await sql<{ image_url: string }>`select image_url from banners where id = ${id}`
      : [];
    if (id) {
      await sql`
          update banners set title = ${data.title}, subtitle = ${data.subtitle}, image_url = ${data.image_url},
            link_url = ${data.link_url}, sort_order = ${data.sort_order}, active = ${data.active}
          where id = ${id}
      `;
    } else {
      const rows = await sql<{ id: number }>`
        insert into banners (title, subtitle, image_url, link_url, sort_order, active)
        values (${data.title}, ${data.subtitle}, ${data.image_url}, ${data.link_url}, ${data.sort_order}, ${data.active})
        returning id
      `;
      id = rows[0]?.id;
    }
    if (!id) throw new Error("تعذر إنشاء البانر");
    await syncSupabase("banners", [{ ...data, id }]);
    if (previous[0]?.image_url && previous[0].image_url !== data.image_url) {
      await deleteSupabaseAsset(previous[0].image_url);
    }
    return { id: id ?? 1 };
  });

export const deleteBanner = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    requireAdminSession();
    const sql = await getSql();
    const previous = await sql<{ image_url: string }>`select image_url from banners where id = ${data.id}`.catch(() => []);
    await deleteSupabase("banners", data.id);
    await sql`delete from banners where id = ${data.id}`.catch(() => []);
    if (previous[0]?.image_url) await deleteSupabaseAsset(previous[0].image_url);
    return { ok: true };
  });

export const setOrderStatus = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.number(), status: z.enum(["new", "done", "cancelled"]) }))
  .handler(async ({ data }) => {
    requireAdminSession();
    try {
      const sql = await getSql();
      await sql`update orders set status = ${data.status} where id = ${data.id}`.catch(() => {});
    } catch {
      /* fallback */
    }
    return { ok: true };
  });
