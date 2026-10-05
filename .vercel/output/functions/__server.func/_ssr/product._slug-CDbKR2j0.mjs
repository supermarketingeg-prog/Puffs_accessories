import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Route$1 } from "./router-B5NbMumT.mjs";
import { a as formatPrice, o as waLink, t as Button } from "./button-B_iuE2vF.mjs";
import { r as useCart, t as PublicShell } from "./site-shell-2PQ2QHVV.mjs";
import { t as ProductCard } from "./product-card-DYBG2e6A.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._slug-CDbKR2j0.js
var import_jsx_runtime = require_jsx_runtime();
function ProductPage() {
	const { store, product } = Route$1.useLoaderData();
	const add = useCart((s) => s.add);
	const { settings, products } = store;
	if (!product) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicShell, {
		settings,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-xl px-4 py-24 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl",
				children: "القطعة مش موجودة"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop",
				className: "mt-6 inline-block text-sm underline",
				children: "رجوع للمتجر"
			})]
		})
	});
	const related = products.filter((p) => p.id !== product.id && p.category_id === product.category_id).slice(0, 4);
	const msg = `مرحباً، عايزة أطلب: ${product.name_ar} — ${product.price} ج.م`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PublicShell, {
		settings,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-[var(--radius-xl)] bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: product.image_url,
					alt: product.name_ar,
					className: "aspect-square w-full object-cover"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col justify-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "wordmark text-[11px] text-muted",
						children: "Puffs"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-5xl",
						children: product.name_ar
					}),
					product.name_en ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-muted",
						children: product.name_en
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex items-baseline gap-3 tabular-nums",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-2xl text-primary",
							children: formatPrice(product.price)
						}), product.compare_at && product.compare_at > product.price ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted line-through",
							children: formatPrice(product.compare_at)
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 max-w-md leading-relaxed text-muted",
						children: product.description_ar
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-col gap-3 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							disabled: !product.in_stock,
							onClick: () => {
								add(product);
								toast.success("اتضافت للسلة");
							},
							children: "أضيفي للسلة"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: waLink(settings.whatsapp, msg),
							target: "_blank",
							rel: "noreferrer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								variant: "outline",
								className: "w-full",
								children: "اطلبي واتساب"
							})
						})]
					})
				]
			})]
		}), related.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 pb-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-6 font-display text-3xl",
				children: "قطع مشابهة"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-5 md:grid-cols-4",
				children: related.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
			})]
		}) : null]
	});
}
//#endregion
export { ProductPage as component };
