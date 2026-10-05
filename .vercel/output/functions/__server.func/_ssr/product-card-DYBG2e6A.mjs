import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as formatPrice, t as Button } from "./button-B_iuE2vF.mjs";
import { r as useCart } from "./site-shell-2PQ2QHVV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-card-DYBG2e6A.js
var import_jsx_runtime = require_jsx_runtime();
function ProductCard({ product }) {
	const add = useCart((s) => s.add);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "group flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/product/$slug",
			params: { slug: product.slug },
			className: "relative block overflow-hidden rounded-[var(--radius-lg)] bg-surface",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: product.image_url,
				alt: product.name_ar,
				className: "aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
			}), !product.in_stock ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute top-3 right-3 rounded-full bg-bg-elevated/90 px-3 py-1 text-xs text-muted",
				children: "غير متوفر"
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col gap-1 pt-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/product/$slug",
					params: { slug: product.slug },
					className: "text-[15px] font-medium",
					children: product.name_ar
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline gap-2 tabular-nums",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-primary",
						children: formatPrice(product.price)
					}), product.compare_at && product.compare_at > product.price ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-subtle line-through",
						children: formatPrice(product.compare_at)
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-3 w-full",
					variant: "outline",
					disabled: !product.in_stock,
					onClick: () => {
						add(product);
						toast.success("اتضافت للسلة");
					},
					children: "أضيفي للسلة"
				})
			]
		})]
	});
}
//#endregion
export { ProductCard as t };
