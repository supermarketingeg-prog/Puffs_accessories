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
  const response = await supabaseFetch(`${url}/rest/v1/${table}?on_conflict=${conflictColumn}`, {
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
  const response = await supabaseFetch(`${url}/rest/v1/${table}?id=eq.${id}`, {
    method: "DELETE",
    headers: supabaseHeaders(key, { Prefer: "return=minimal" }),
  });
  await assertSupabaseResponse(response, `حذف ${table}`);
}

const DEFAULT_SUPABASE_URL = "https://nttdxpsqpyokzqyihmcr.supabase.co";
const STORAGE_BUCKET = "puffs-assets";

function supabaseHeaders(key: string, extra: Record<string, string> = {}) {
  // Current Supabase secret keys (sb_secret_...) are opaque strings, not JWTs.
  // Passing one as a Bearer token makes Storage try to parse it as a JWS and
  // reject it with "Invalid Compact JWS". Legacy service_role keys are JWTs
  // and continue to need the Authorization header.
  return key.startsWith("sb_secret_")
    ? { apikey: key, ...extra }
    : { apikey: key, Authorization: `Bearer ${key}`, ...extra };
}

async function getSupabaseConfig() {
  // This app is intentionally bound to the Puffs project. It prevents a
  // mistyped Vercel SUPABASE_URL from sending requests to a dashboard URL or
  // another project and failing with the opaque "fetch failed" message.
  const url = DEFAULT_SUPABASE_URL;
  // Prefer Supabase's current server-only secret key. Keep the legacy variable
  // as a fallback so existing deployments do not break during migration.
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Supabase غير مُعدّ. أضيفي SUPABASE_SECRET_KEY في إعدادات Vercel.");
  return { url, key };
}

async function supabaseFetch(input: string, init?: RequestInit) {
  try {
    return await fetch(input, init);
  } catch {
    throw new Error("تعذر الاتصال بـ Supabase. راجعي أن SUPABASE_SERVICE_ROLE_KEY موجودة ثم أعيدي النشر.");
  }
}

async function assertSupabaseResponse(response: Response, action: string) {
  if (response.ok) return;
  const details = (await response.text()).slice(0, 300);
  throw new Error(`تعذر ${action} في Supabase (${response.status})${details ? `: ${details}` : ""}`);
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
    const response = await supabaseFetch(`${config.url}/storage/v1/object/${STORAGE_BUCKET}/${path}`, {
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
      supabaseFetch(`${url}/rest/v1/site_settings?select=key,value`, { headers }),
      supabaseFetch(`${url}/rest/v1/banners?active=eq.true&order=sort_order.asc,id.asc&select=*`, { headers }),
      supabaseFetch(`${url}/rest/v1/categories?active=eq.true&order=sort_order.asc,id.asc&select=*`, { headers }),
      supabaseFetch(`${url}/rest/v1/products?order=sort_order.asc,id.asc&select=*`, { headers }),
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
    // A partially seeded Supabase project must never make the shop look empty.
    // Keep the live records when present and fill only missing collections.
    return {
      settings: map,
      banners: banners.length ? banners : DEFAULT_BANNERS,
      categories: categories.length ? categories : DEFAULT_CATEGORIES,
      products: products.length ? products : DEFAULT_PRODUCTS,
    };
  } catch {
    return null;
  }
}

async function getSupabaseOrders(): Promise<Order[] | null> {
  try {
    const { url, key } = await getSupabaseConfig();
    const response = await supabaseFetch(
      `${url}/rest/v1/orders?select=id,customer_name,phone,address,notes,items_json,total,status,created_at&order=created_at.desc&limit=80`,
      { headers: supabaseHeaders(key) },
    );
    if (!response.ok) return null;
    return (await response.json()) as Order[];
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
    try {
      const { url, key } = await getSupabaseConfig();
      const response = await supabaseFetch(`${url}/rest/v1/products?slug=eq.${encodeURIComponent(data.slug)}&select=*&limit=1`, {
        headers: supabaseHeaders(key),
      });
      if (response.ok) {
        const rows = (await response.json()) as Product[];
        if (rows.length > 0) return rows[0];
      }
    } catch {
      // The shop can still show its built-in catalog if Supabase is unavailable.
    }
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
    const total = data.items.reduce((n, i) => n + i.price * i.qty, 0);
    const items_json = JSON.stringify(data.items);
    const { url, key } = await getSupabaseConfig();
    const response = await supabaseFetch(`${url}/rest/v1/orders`, {
      method: "POST",
      headers: supabaseHeaders(key, {
        "Content-Type": "application/json",
        Prefer: "return=representation",
      }),
      body: JSON.stringify({
        customer_name: data.customer_name,
        phone: data.phone,
        address: data.address,
        notes: data.notes,
        items_json,
        total,
        status: "new",
      }),
    });
    await assertSupabaseResponse(response, "حفظ الطلب");
    const [order] = (await response.json()) as Order[];
    return { id: order?.id ?? 0, total };
  });

export const adminGetAll = createServerFn({ method: "GET" })
  .handler(async () => {
    requireAdminSession();
    const [synced, syncedOrders] = await Promise.all([getSupabaseStorefront(), getSupabaseOrders()]);
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
        orders: syncedOrders ?? orders,
      };
    } catch {
      if (synced) return { ...synced, orders: syncedOrders ?? [] };
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
    const rows: { key: string; value: string }[] = [];
    for (const [key, value] of Object.entries(data)) {
      if (!/^[a-z_]+$/.test(key)) continue;
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
    const id = data.id ?? Date.now();
    await syncSupabase("products", [{ ...data, slug, id }]);
    return { id };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    requireAdminSession();
    await deleteSupabase("products", data.id);
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
    const id = data.id ?? Date.now();
    await syncSupabase("banners", [{ ...data, id }]);
    return { id };
  });

export const deleteBanner = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    requireAdminSession();
    await deleteSupabase("banners", data.id);
    return { ok: true };
  });

export const setOrderStatus = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.number(), status: z.enum(["new", "done", "cancelled"]) }))
  .handler(async ({ data }) => {
    requireAdminSession();
    try {
      const { url, key } = await getSupabaseConfig();
      const response = await supabaseFetch(`${url}/rest/v1/orders?id=eq.${data.id}`, {
        method: "PATCH",
        headers: supabaseHeaders(key, { "Content-Type": "application/json", Prefer: "return=minimal" }),
        body: JSON.stringify({ status: data.status }),
      });
      await assertSupabaseResponse(response, "تحديث حالة الطلب");
    } catch {
      throw new Error("تعذر تحديث حالة الطلب. تأكدي من اتصال Supabase.");
    }
    return { ok: true };
  });
