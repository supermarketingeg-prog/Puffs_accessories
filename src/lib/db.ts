import { pendingMigrations } from "../../scripts/migration-plan.mjs";

/** Which database backend is active. */
export type DbSource = "neon" | "pglite";

if (typeof process !== "undefined") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

// An empty/whitespace DATABASE_URL (an easy misconfig in deploy UIs) must mean
// "unset" — otherwise production would silently run on the PGLite fallback.
const rawDatabaseUrl =
  typeof process !== "undefined"
    ? process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.SUPABASE_DATABASE_URL
    : undefined;
const databaseUrl =
  rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl.trim() : undefined;

export const dbSource: DbSource = databaseUrl ? "neon" : "pglite";

export interface Sql {
  <T = Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<T[]>;
  query<T = Record<string, unknown>>(
    text: string,
    params?: unknown[],
  ): Promise<T[]>;
}

const globalRef = globalThis as typeof globalThis & {
  __pgSqlPromise__?: Promise<Sql>;
  __pgliteInstance__?: Promise<import("@electric-sql/pglite").PGlite>;
  __pgliteMigrateChain__?: Promise<void>;
  __memDb__?: {
    settings: Record<string, string>;
    categories: any[];
    products: any[];
    banners: any[];
    orders: any[];
    admins: string[];
  };
};

const OID_INT8 = 20;
const OID_DATE = 1082;
const OID_INTERVAL = 1186;
const identity = (v: string) => v;

type Run = <T>(text: string, params: unknown[]) => Promise<T[]>;

function toSql(run: Run): Sql {
  const sql = (async <T = Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<T[]> => {
    let text = strings[0];
    for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
    return run<T>(text, values);
  }) as unknown as Sql;
  sql.query = <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
    run<T>(text, params);
  return sql;
}

function createNeonSql(): Promise<Sql> {
  globalRef.__pgSqlPromise__ ??= (async () => {
    const { Pool, types } = await import("pg");
    types.setTypeParser(OID_INT8, Number);
    types.setTypeParser(OID_DATE, identity);
    types.setTypeParser(OID_INTERVAL, identity);
    const pool = new Pool({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
    return toSql(async <T>(text: string, params: unknown[]) => {
      const res = await pool.query(text, params);
      return res.rows as T[];
    });
  })().catch((err) => {
    globalRef.__pgSqlPromise__ = undefined;
    throw err;
  });
  return globalRef.__pgSqlPromise__;
}

function getMemorySql(): Sql {
  globalRef.__memDb__ ??= {
    settings: {
      brand_name: "Puffs Accessories",
      tagline: "Because it's the ACCESSORIES that make or break the look",
      tagline_ar: "الإكسسوارات هي اللي بتكمل اللوك",
      announcement: "توصيل لكل محافظات مصر · اطلب عبر واتساب",
      about_ar: "بَفس إكسسوارز محل إكسسوارات حريمي في السويس. قطع ذهبية ولؤلؤ ناعمة تكمّل إطلالتك.",
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
    },
    categories: [
      { id: 1, slug: "earrings", name_ar: "أقراط", name_en: "Earrings", image_url: "/images/cat-earrings.jpg", sort_order: 1, active: true },
      { id: 2, slug: "necklaces", name_ar: "سلاسل وعقود", name_en: "Necklaces", image_url: "/images/cat-necklaces.jpg", sort_order: 2, active: true },
      { id: 3, slug: "bracelets", name_ar: "أساور", name_en: "Bracelets", image_url: "/images/cat-bracelets.jpg", sort_order: 3, active: true },
      { id: 4, slug: "sets", name_ar: "أطقم", name_en: "Sets", image_url: "/images/cat-sets.jpg", sort_order: 4, active: true },
      { id: 5, slug: "rings", name_ar: "خواتم", name_en: "Rings", image_url: "/products/crystal-ring.jpg", sort_order: 5, active: true },
      { id: 6, slug: "hair", name_ar: "إكسسوارات شعر", name_en: "Hair", image_url: "/products/pearl-clip.jpg", sort_order: 6, active: true },
    ],
    products: [
      { id: 1, slug: "pearl-layers", name_ar: "عقد لؤلؤ طبقات", name_en: "Layered Pearl Necklace", description_ar: "عقد طبقات من اللؤلؤ الناعم مع لمسات ذهبية.", description_en: "Soft layered pearls with gold accents.", category_id: 2, price: 320, compare_at: 390, image_url: "/products/pearl-layers.jpg", featured: true, in_stock: true, sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 2, slug: "gold-hoops", name_ar: "حلق ذهب دائري", name_en: "Gold Hoop Earrings", description_ar: "حلق دائري مذهب بحجم أنيق.", description_en: "Polished gold-plated hoops.", category_id: 1, price: 145, compare_at: 180, image_url: "/products/gold-hoops.jpg", featured: true, in_stock: true, sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 3, slug: "gold-bangle", name_ar: "أسورة ذهب سميكة", name_en: "Chunky Gold Bangle", description_ar: "أسورة سميكة ذهبية تعطي حضور مميز.", description_en: "A sculptural gold-plated bangle.", category_id: 3, price: 280, compare_at: 340, image_url: "/products/gold-bangle.jpg", featured: true, in_stock: true, sort_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 4, slug: "pearl-set", name_ar: "طقم لؤلؤ أنيق", name_en: "Pearl Evening Set", description_ar: "طقم لؤلؤ: عقد قصير + حلق + أسورة رفيعة.", description_en: "A complete pearl set.", category_id: 4, price: 490, compare_at: 580, image_url: "/products/pearl-set.jpg", featured: true, in_stock: true, sort_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 5, slug: "pearl-pendant", name_ar: "سلسلة لؤلؤ معلقة", name_en: "Pearl Pendant Chain", description_ar: "سلسلة ذهبية رقيقة مع لؤلؤة واحدة.", description_en: "A dainty gold chain with a single pearl drop.", category_id: 2, price: 195, compare_at: null, image_url: "/products/pearl-pendant.jpg", featured: true, in_stock: true, sort_order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 6, slug: "crystal-ring", name_ar: "خاتم كريستال", name_en: "Crystal Stone Ring", description_ar: "خاتم مذهب بفصة كريستال تلمع.", description_en: "Gold-plated ring with a small crystal stone.", category_id: 5, price: 120, compare_at: 150, image_url: "/products/crystal-ring.jpg", featured: false, in_stock: true, sort_order: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 7, slug: "pearl-clip", name_ar: "توكة شعر لؤلؤ", name_en: "Pearl Hair Barrette", description_ar: "توكة شعر بلؤلؤ وذهب.", description_en: "A pearl-and-gold barrette.", category_id: 6, price: 95, compare_at: null, image_url: "/products/pearl-clip.jpg", featured: true, in_stock: true, sort_order: 7, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 8, slug: "crystal-drops", name_ar: "حلق كريستال متدلي", name_en: "Crystal Drop Earrings", description_ar: "حلق طويل بفصوص كريستال لامعة.", description_en: "Elongated crystal drops.", category_id: 1, price: 165, compare_at: 210, image_url: "/products/crystal-drops.jpg", featured: false, in_stock: true, sort_order: 8, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    ],
    banners: [
      { id: 1, title: "Puffs", subtitle: "الإكسسوارات هي اللي بتكمل اللوك", image_url: "/images/hero.jpg", link_url: "/shop", sort_order: 1, active: true },
      { id: 2, title: "أطقم الهدية", subtitle: "اختاري طقم كامل جاهز يتغلف بهدية", image_url: "/images/cat-sets.jpg", link_url: "/shop?cat=sets", sort_order: 2, active: true },
      { id: 3, title: "لؤلؤ وذهب", subtitle: "قطع ناعمة للبس اليومي", image_url: "/images/cat-necklaces.jpg", link_url: "/shop?cat=necklaces", sort_order: 3, active: true }
    ],
    orders: [],
    admins: [],
  };

  const mem = globalRef.__memDb__;

  return toSql(async <T>(text: string, params: unknown[] = []) => {
    const q = text.toLowerCase().trim();
    if (q.includes("site_settings")) {
      if (q.includes("insert into") || q.includes("update")) {
        return [] as T[];
      }
      return Object.entries(mem.settings).map(([key, value]) => ({ key, value })) as unknown as T[];
    }
    if (q.includes("banners")) {
      return mem.banners.filter((b) => b.active) as unknown as T[];
    }
    if (q.includes("categories")) {
      return mem.categories.filter((c) => c.active) as unknown as T[];
    }
    if (q.includes("products")) {
      if (q.includes("where slug")) {
        const slug = params[0] as string;
        return mem.products.filter((p) => p.slug === slug) as unknown as T[];
      }
      return mem.products as unknown as T[];
    }
    if (q.includes("orders")) {
      return mem.orders as unknown as T[];
    }
    if (q.includes("store_admins")) {
      return [] as T[];
    }
    return [] as T[];
  });
}

async function createPgliteSql(): Promise<Sql> {
  try {
    const { PGlite } = await import("@electric-sql/pglite");
    const pg = new PGlite({
      parsers: {
        [OID_INT8]: Number,
        [OID_DATE]: identity,
        [OID_INTERVAL]: identity,
      },
    });
    await pg.waitReady;
    await pg.exec(
      "create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())",
    );
    globalRef.__pgliteInstance__ = Promise.resolve(pg);

    const migrations = import.meta.glob("/migrations/*.sql", {
      query: "?raw",
      import: "default",
      eager: true,
    }) as Record<string, string>;
    const doneRows = await pg.query<{ name: string }>(
      "select name from _migrations",
    );
    const done = doneRows.rows.map((r) => r.name);
    for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) {
      await pg.transaction(async (tx) => {
        await tx.exec(migrations[path]);
        await tx.query("insert into _migrations (name) values ($1)", [name]);
      });
    }

    return toSql(async <T>(text: string, params: unknown[]) => {
      const result = await pg.query<T>(text, params);
      return result.rows;
    });
  } catch (err) {
    console.warn("[db] PGlite failed or unavailable in serverless environment, falling back to in-memory store:", err);
    return getMemorySql();
  }
}

let sqlPromise: Promise<Sql> | null = null;

async function createSql(): Promise<Sql> {
  if (typeof window !== "undefined") {
    throw new Error(
      "@/lib/db is server-only — call getSql() from a createServerFn handler " +
        "or a server route loader, never from client code.",
    );
  }
  return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}

/**
 * Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
 * otherwise the local PGLite fallback. Memoized — safe to call per request.
 *
 * Schema comes from `migrations/*.sql`, auto-applied before the first query on
 * both backends — define tables there, never inline in server functions.
 */
export function getSql(): Promise<Sql> {
  sqlPromise ??= createSql().catch((err) => {
    sqlPromise = null; // don't memoize failures — let the next call retry
    throw err;
  });
  return sqlPromise;
}

/**
 * The shared PGLite instance (preview only), with `migrations/*.sql` applied.
 * Lets Better Auth persist to the SAME embedded DB as app data in preview (via a
 * Kysely dialect). Throws when `DATABASE_URL` is set (that path uses Neon).
 */
export async function getPglite(): Promise<import("@electric-sql/pglite").PGlite> {
  if (dbSource !== "pglite") {
    throw new Error("getPglite() is only available on the PGLite fallback (no DATABASE_URL)");
  }
  await getSql();
  const pg = await globalRef.__pgliteInstance__;
  if (!pg) throw new Error("PGLite instance failed to initialize");
  return pg;
}

/**
 * Finish DB bootstrap before the server handles traffic.
 *
 * - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
 *   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
 * - **Neon**: no-op (pool is created lazily on first query).
 *
 * Vite `configureServer` awaits this at dev startup; production imports of this
 * module kick it off immediately (see bottom of file).
 */
export function ensureDbReady(): Promise<void> {
  if (dbSource !== "pglite") return Promise.resolve();
  return getSql().then(() => undefined);
}

// Server-only eager start: kick PGLite bootstrap as soon as this module loads in
// Node. Client bundles never hit this path (`getSql` throws in the browser).
const globalBoot = globalThis as typeof globalThis & {
  __pgBootstrapPromise__?: Promise<void>;
};
if (typeof window === "undefined" && dbSource === "pglite") {
  globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
    globalBoot.__pgBootstrapPromise__ = undefined;
    console.error("[db] PGLite bootstrap failed:", err);
    throw err;
  });
}
