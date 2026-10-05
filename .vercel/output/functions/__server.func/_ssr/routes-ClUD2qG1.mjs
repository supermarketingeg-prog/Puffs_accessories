import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as ArrowLeft } from "../_libs/lucide-react.mjs";
import { s as Route$8 } from "./router-B5NbMumT.mjs";
import { t as Button } from "./button-B_iuE2vF.mjs";
import { t as PublicShell } from "./site-shell-2PQ2QHVV.mjs";
import { t as ProductCard } from "./product-card-DYBG2e6A.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-ClUD2qG1.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const { settings, banners, categories, products } = Route$8.useLoaderData();
	const hero = banners[0];
	const featured = products.filter((p) => p.featured).slice(0, 8);
	const rest = featured.length ? featured : products.slice(0, 8);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PublicShell, {
		settings,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative min-h-[88svh] overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: hero?.image_url || settings.hero_image,
						alt: "",
						className: "absolute inset-0 size-full object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[linear-gradient(180deg,rgb(28_22_17/0.18),rgb(28_22_17/0.62))]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mx-auto flex min-h-[88svh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "wordmark mb-4 text-xs text-primary-fg/80",
								children: "Accessories"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-[clamp(3.4rem,12vw,8rem)] leading-[0.9] text-primary-fg",
								children: hero?.title || settings.hero_title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 max-w-md text-lg text-primary-fg/90",
								children: hero?.subtitle || settings.hero_subtitle
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex flex-wrap gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/shop",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "lg",
										children: "تسوقي الآن"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/about",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "lg",
										variant: "outline",
										className: "border-primary-fg/30 bg-transparent text-primary-fg hover:bg-primary-fg/10",
										children: "قصتنا"
									})
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-6xl px-4 py-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8 flex items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "wordmark text-[11px] text-muted",
						children: "Collections"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-4xl",
						children: "اختاري قطعتك"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/shop",
						className: "hidden items-center gap-1 text-sm text-muted hover:text-fg md:inline-flex",
						children: ["كل القطع", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5",
					children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/shop",
						search: { cat: c.slug },
						className: "group relative overflow-hidden rounded-[var(--radius-lg)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: c.image_url,
							alt: c.name_ar,
							className: "aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute inset-x-0 bottom-0 bg-[linear-gradient(transparent,rgb(28_22_17/0.7))] px-4 pb-4 pt-16 text-primary-fg",
							children: c.name_ar
						})]
					}, c.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-6xl px-4 pb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "wordmark text-[11px] text-muted",
						children: "Featured"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-4xl",
						children: "مختارات هذا الأسبوع"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-5 md:grid-cols-4",
					children: rest.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto my-16 max-w-6xl overflow-hidden rounded-[var(--radius-xl)] bg-fg px-6 py-16 text-primary-fg md:px-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl italic leading-snug md:text-5xl",
						children: "“Because it’s the accessories that make or break the look.”"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 max-w-xl text-sm text-primary-fg/70",
						children: settings.about_ar
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/about",
						className: "mt-8 inline-block text-sm underline underline-offset-4",
						children: "اعرفي أكتر"
					})
				]
			})
		]
	});
}
//#endregion
export { Home as component };
