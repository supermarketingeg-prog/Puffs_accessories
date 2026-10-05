import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { r as Route$2 } from "./router-B5NbMumT.mjs";
import { r as cn } from "./button-B_iuE2vF.mjs";
import { t as PublicShell } from "./site-shell-2PQ2QHVV.mjs";
import { t as ProductCard } from "./product-card-DYBG2e6A.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-B3C4KF0o.js
var import_jsx_runtime = require_jsx_runtime();
function Shop() {
	const { cat } = Route$2.useSearch();
	const navigate = Route$2.useNavigate();
	const { settings, categories, products } = Route$2.useLoaderData();
	const active = cat ? categories.find((c) => c.slug === cat) : null;
	const list = active ? products.filter((p) => p.category_id === active.id) : products;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicShell, {
		settings,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "wordmark text-[11px] text-muted",
					children: "Shop"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-5xl",
					children: active ? active.name_ar : "كل القطع"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex gap-2 overflow-x-auto pb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
						active: !cat,
						onClick: () => navigate({ search: {} }),
						children: "الكل"
					}), categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
						active: cat === c.slug,
						onClick: () => navigate({ search: { cat: c.slug } }),
						children: c.name_ar
					}, c.id))]
				}),
				list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-16 text-muted",
					children: "مفيش قطع في القسم ده دلوقتي."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4",
					children: list.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
				})
			]
		})
	});
}
function FilterChip({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("h-10 shrink-0 rounded-full px-4 text-sm", active ? "bg-fg text-primary-fg" : "bg-surface text-fg hover:bg-border"),
		children
	});
}
//#endregion
export { Shop as component };
