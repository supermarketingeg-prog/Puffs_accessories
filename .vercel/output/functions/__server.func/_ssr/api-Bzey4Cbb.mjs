import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { i as getSql, t as authMiddleware } from "./db-CIZZGosU.mjs";
import { At as array, Ft as number, It as object, Ot as _enum, Rt as record, jt as boolean, zt as string } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-Bzey4Cbb.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var DEFAULT_SETTINGS = {
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
	supabase_key: ""
};
function asSettings(rows) {
	const out = { ...DEFAULT_SETTINGS };
	for (const row of rows) out[row.key] = row.value;
	return out;
}
async function requireAdmin(userId) {
	const sql = await getSql();
	if ((await sql`select user_id from store_admins limit 1`).length === 0) {
		await sql`insert into store_admins (user_id) values (${userId})`;
		return;
	}
	if ((await sql`select user_id from store_admins where user_id = ${userId}`).length === 0) throw Object.assign(/* @__PURE__ */ new Error("Forbidden"), { status: 403 });
}
async function syncSupabase(table, rows) {
	if (rows.length === 0) return;
	try {
		const cfg = await (await getSql())`
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
				Prefer: "resolution=merge-duplicates"
			},
			body: JSON.stringify(rows)
		});
	} catch {}
}
var getStorefront_createServerFn_handler = createServerRpc({
	id: "fa62845f3356f775e065a470ed8a4825849e7a509278bec4e5eceb949274c564",
	name: "getStorefront",
	filename: "src/lib/api.ts"
}, (opts) => getStorefront.__executeServer(opts));
var getStorefront = createServerFn({ method: "GET" }).handler(getStorefront_createServerFn_handler, async () => {
	const sql = await getSql();
	const [settings, banners, categories, products] = await Promise.all([
		sql`select key, value from site_settings`,
		sql`select id, title, subtitle, image_url, link_url, sort_order, active from banners where active = true order by sort_order, id`,
		sql`select id, slug, name_ar, name_en, image_url, sort_order, active from categories where active = true order by sort_order, id`,
		sql`select id, slug, name_ar, name_en, description_ar, description_en, category_id, price, compare_at, image_url, featured, in_stock, sort_order, created_at::text as created_at, updated_at::text as updated_at from products order by sort_order, id`
	]);
	const map = asSettings(settings);
	delete map.supabase_key;
	return {
		settings: map,
		banners,
		categories,
		products
	};
});
var getProductBySlug_createServerFn_handler = createServerRpc({
	id: "77924c543fd73050c17cd4817f5820d8c7da8494f39ae17395552f460eb6ea8c",
	name: "getProductBySlug",
	filename: "src/lib/api.ts"
}, (opts) => getProductBySlug.__executeServer(opts));
var getProductBySlug = createServerFn({ method: "GET" }).validator(object({ slug: string() })).handler(getProductBySlug_createServerFn_handler, async ({ data }) => {
	return (await (await getSql())`
      select id, slug, name_ar, name_en, description_ar, description_en, category_id, price, compare_at, image_url, featured, in_stock, sort_order, created_at::text as created_at, updated_at::text as updated_at
      from products where slug = ${data.slug} limit 1
    `)[0] ?? null;
});
var orderItemSchema = object({
	productId: number(),
	slug: string(),
	name: string(),
	price: number(),
	qty: number().int().positive()
});
var placeOrder_createServerFn_handler = createServerRpc({
	id: "09700b26e3fc801a01da35fc985e89f467c53f4824a8538d6245046790c3bf49",
	name: "placeOrder",
	filename: "src/lib/api.ts"
}, (opts) => placeOrder.__executeServer(opts));
var placeOrder = createServerFn({ method: "POST" }).validator(object({
	customer_name: string().trim().min(2).max(80),
	phone: string().trim().min(8).max(20),
	address: string().trim().max(240),
	notes: string().trim().max(400),
	items: array(orderItemSchema).min(1)
})).handler(placeOrder_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const total = data.items.reduce((n, i) => n + i.price * i.qty, 0);
	const items_json = JSON.stringify(data.items);
	return {
		id: (await sql`
      insert into orders (customer_name, phone, address, notes, items_json, total, status)
      values (${data.customer_name}, ${data.phone}, ${data.address}, ${data.notes}, ${items_json}, ${total}, 'new')
      returning id
    `)[0]?.id ?? 0,
		total
	};
});
var adminGetAll_createServerFn_handler = createServerRpc({
	id: "56f47fbbec1aaed220632c06ed658e33d6e2fbdc471ea1b52f46559e7d654037",
	name: "adminGetAll",
	filename: "src/lib/api.ts"
}, (opts) => adminGetAll.__executeServer(opts));
var adminGetAll = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminGetAll_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	const [settings, banners, categories, products, orders] = await Promise.all([
		sql`select key, value from site_settings`,
		sql`select id, title, subtitle, image_url, link_url, sort_order, active from banners order by sort_order, id`,
		sql`select id, slug, name_ar, name_en, image_url, sort_order, active from categories order by sort_order, id`,
		sql`select id, slug, name_ar, name_en, description_ar, description_en, category_id, price, compare_at, image_url, featured, in_stock, sort_order, created_at::text as created_at, updated_at::text as updated_at from products order by id desc`,
		sql`select id, customer_name, phone, address, notes, items_json, total, status, created_at::text as created_at from orders order by created_at desc limit 80`
	]);
	return {
		settings: asSettings(settings),
		banners,
		categories,
		products,
		orders
	};
});
var saveSettings_createServerFn_handler = createServerRpc({
	id: "a532d20924c3d1053795b75ee01b8637795b954c8640ae7f8d7fd8dfc36e324a",
	name: "saveSettings",
	filename: "src/lib/api.ts"
}, (opts) => saveSettings.__executeServer(opts));
var saveSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(record(string(), string())).handler(saveSettings_createServerFn_handler, async ({ context, data }) => {
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
var productInput = object({
	id: number().optional(),
	slug: string().trim().min(2).max(80),
	name_ar: string().trim().min(2).max(80),
	name_en: string().trim().max(80).default(""),
	description_ar: string().max(800).default(""),
	description_en: string().max(800).default(""),
	category_id: number().nullable(),
	price: number().int().min(0).max(999999),
	compare_at: number().int().min(0).max(999999).nullable(),
	image_url: string().min(1),
	featured: boolean(),
	in_stock: boolean(),
	sort_order: number().int().default(0)
});
var saveProduct_createServerFn_handler = createServerRpc({
	id: "0fde5e96aec37fbb408172111007794c580c6b9a40dae859992c7486d2f3f442",
	name: "saveProduct",
	filename: "src/lib/api.ts"
}, (opts) => saveProduct.__executeServer(opts));
var saveProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(productInput).handler(saveProduct_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	const slug = data.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-");
	let id = data.id;
	if (id) await sql`
        update products set
          slug = ${slug}, name_ar = ${data.name_ar}, name_en = ${data.name_en},
          description_ar = ${data.description_ar}, description_en = ${data.description_en},
          category_id = ${data.category_id}, price = ${data.price}, compare_at = ${data.compare_at},
          image_url = ${data.image_url}, featured = ${data.featured}, in_stock = ${data.in_stock},
          sort_order = ${data.sort_order}, updated_at = now()
        where id = ${id}
      `;
	else id = (await sql`
        insert into products (slug, name_ar, name_en, description_ar, description_en, category_id, price, compare_at, image_url, featured, in_stock, sort_order)
        values (${slug}, ${data.name_ar}, ${data.name_en}, ${data.description_ar}, ${data.description_en}, ${data.category_id}, ${data.price}, ${data.compare_at}, ${data.image_url}, ${data.featured}, ${data.in_stock}, ${data.sort_order})
        returning id
      `)[0]?.id;
	await syncSupabase("products", [{
		...data,
		slug,
		id
	}]);
	return { id };
});
var deleteProduct_createServerFn_handler = createServerRpc({
	id: "7799596c5be0bad8e0c1ec21dcb72c5d593e2a91732a5e85cbb8101a34a46a56",
	name: "deleteProduct",
	filename: "src/lib/api.ts"
}, (opts) => deleteProduct.__executeServer(opts));
var deleteProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: number() })).handler(deleteProduct_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	await (await getSql())`delete from products where id = ${data.id}`;
	return { ok: true };
});
var bannerInput = object({
	id: number().optional(),
	title: string().max(80).default(""),
	subtitle: string().max(160).default(""),
	image_url: string().min(1),
	link_url: string().max(200).default("/shop"),
	sort_order: number().int().default(0),
	active: boolean()
});
var saveBanner_createServerFn_handler = createServerRpc({
	id: "d52344681b3c7eca67400698ae3610e277fc5f3a92b7eeb0899a86c947165239",
	name: "saveBanner",
	filename: "src/lib/api.ts"
}, (opts) => saveBanner.__executeServer(opts));
var saveBanner = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(bannerInput).handler(saveBanner_createServerFn_handler, async ({ context, data }) => {
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
	const id = (await sql`
      insert into banners (title, subtitle, image_url, link_url, sort_order, active)
      values (${data.title}, ${data.subtitle}, ${data.image_url}, ${data.link_url}, ${data.sort_order}, ${data.active})
      returning id
    `)[0]?.id ?? 0;
	await syncSupabase("banners", [{
		...data,
		id
	}]);
	return { id };
});
var deleteBanner_createServerFn_handler = createServerRpc({
	id: "3e57d9be3cd15f5718f08f19805eb1099ef84547b32a4bc83fe6dce332fa2b98",
	name: "deleteBanner",
	filename: "src/lib/api.ts"
}, (opts) => deleteBanner.__executeServer(opts));
var deleteBanner = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: number() })).handler(deleteBanner_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	await (await getSql())`delete from banners where id = ${data.id}`;
	return { ok: true };
});
var setOrderStatus_createServerFn_handler = createServerRpc({
	id: "544b7450707cdf0e0be1a2d477ab1c5bd5816be9484c07f49df81b2637619120",
	name: "setOrderStatus",
	filename: "src/lib/api.ts"
}, (opts) => setOrderStatus.__executeServer(opts));
var setOrderStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: number(),
	status: _enum([
		"new",
		"done",
		"cancelled"
	])
})).handler(setOrderStatus_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	await (await getSql())`update orders set status = ${data.status} where id = ${data.id}`;
	return { ok: true };
});
//#endregion
export { adminGetAll_createServerFn_handler, deleteBanner_createServerFn_handler, deleteProduct_createServerFn_handler, getProductBySlug_createServerFn_handler, getStorefront_createServerFn_handler, placeOrder_createServerFn_handler, saveBanner_createServerFn_handler, saveProduct_createServerFn_handler, saveSettings_createServerFn_handler, setOrderStatus_createServerFn_handler };
