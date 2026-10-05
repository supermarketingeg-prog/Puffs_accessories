import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
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

async function requireAdmin(userId: string) {
  const sql = await getSql();
  const any = await sql<{ user_id: string }>`select user_id from store_admins limit 1`;
  if (any.length === 0) {
    await sql`insert into store_admins (user_id) values (${userId})`;
    return;
  }
  const mine = await sql<{ user_id: string }>`select user_id from store_admins where user_id = ${userId}`;
  if (mine.length === 0) {
    throw Object.assign(new Error("Forbidden"), { status: 403 });
  }
}

async function syncSupabase(table: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  try {
    const sql = await getSql();
    const cfg = await sql<{ key: string; value: string }>`
      select key, value from site_settings where key in ('supabase_url','supabase_key')
    `;
    const url = cfg.find((r) => r.key === "supabase_url")?.value?.replace(/\/$/, "");
    const key = cfg.find((r) => r.key === "supabase_key")?.value?.trim();
    if (!url || !key) return;
    await fetch(`${url}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify(rows),
    });
  } catch {
    /* best-effort mirror */
  }
}

export const getStorefront = createServerFn({ method: "GET" }).handler(async (): Promise<Storefront> => {
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
      const sql = await getSql();
      const rows = await sql<Product>`
        select id, slug, name_ar, name_en, description_ar, description_en, category_id, price, compare_at, image_url, featured, in_stock, sort_order, created_at::text as created_at, updated_at::text as updated_at
        from products where slug = ${data.slug} limit 1
      `;
      if (rows.length > 0) return rows[0];
    } catch {
      /* fallback */
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
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const [settings, banners, categories, products, orders] = await Promise.all([
      sql<{ key: string; value: string }>`select key, value from site_settings`,
      sql<Banner>`select id, title, subtitle, image_url, link_url, sort_order, active from banners order by sort_order, id`,
      sql<Category>`select id, slug, name_ar, name_en, image_url, sort_order, active from categories order by sort_order, id`,
      sql<Product>`select id, slug, name_ar, name_en, description_ar, description_en, category_id, price, compare_at, image_url, featured, in_stock, sort_order, created_at::text as created_at, updated_at::text as updated_at from products order by id desc`,
      sql<Order>`select id, customer_name, phone, address, notes, items_json, total, status, created_at::text as created_at from orders order by created_at desc limit 80`,
    ]);
    return { settings: asSettings(settings), banners, categories, products, orders };
  });

export const saveSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.record(z.string(), z.string()))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    for (const [key, value] of Object.entries(data)) {
      if (!/^[a-z_]+$/.test(key)) continue;
      await sql`
        insert into site_settings (key, value) values (${key}, ${value})
        on conflict (key) do update set value = excluded.value
      `;
    }
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
  .middleware([authMiddleware])
  .validator(productInput)
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const slug = data.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    let id = data.id;
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
    await syncSupabase("products", [{ ...data, slug, id }]);
    return { id };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.number() }))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    await sql`delete from products where id = ${data.id}`;
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
  .middleware([authMiddleware])
  .validator(bannerInput)
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    if (data.id) {
      await sql`
        update banners set title = ${data.title}, subtitle = ${data.subtitle}, image_url = ${data.image_url},
          link_url = ${data.link_url}, sort_order = ${data.sort_order}, active = ${data.active}
        where id = ${data.id}
      `;
      await syncSupabase("banners", [{ ...data }]);
      return { id: data.id };
    }
    const rows = await sql<{ id: number }>`
      insert into banners (title, subtitle, image_url, link_url, sort_order, active)
      values (${data.title}, ${data.subtitle}, ${data.image_url}, ${data.link_url}, ${data.sort_order}, ${data.active})
      returning id
    `;
    const id = rows[0]?.id ?? 0;
    await syncSupabase("banners", [{ ...data, id }]);
    return { id };
  });

export const deleteBanner = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.number() }))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    await sql`delete from banners where id = ${data.id}`;
    return { ok: true };
  });

export const setOrderStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.number(), status: z.enum(["new", "done", "cancelled"]) }))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    await sql`update orders set status = ${data.status} where id = ${data.id}`;
    return { ok: true };
  });
