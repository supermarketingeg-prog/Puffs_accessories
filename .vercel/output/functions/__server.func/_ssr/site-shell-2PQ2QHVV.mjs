import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { m as useRouterState, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Menu, r as ShoppingBag, s as Instagram, t as X } from "../_libs/lucide-react.mjs";
import { n as Logo, o as waLink, r as cn } from "./button-B_iuE2vF.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-shell-2PQ2QHVV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var useCart = create()(persist((set, get) => ({
	items: [],
	add: (product, qty = 1) => {
		const items = [...get().items];
		const i = items.findIndex((x) => x.productId === product.id);
		if (i >= 0) items[i] = {
			...items[i],
			qty: items[i].qty + qty
		};
		else items.push({
			productId: product.id,
			slug: product.slug,
			name: product.name_ar,
			price: product.price,
			image: product.image_url,
			qty
		});
		set({ items });
	},
	setQty: (productId, qty) => {
		if (qty <= 0) set({ items: get().items.filter((x) => x.productId !== productId) });
		else set({ items: get().items.map((x) => x.productId === productId ? {
			...x,
			qty
		} : x) });
	},
	remove: (productId) => set({ items: get().items.filter((x) => x.productId !== productId) }),
	clear: () => set({ items: [] })
}), { name: "puffs-cart" }));
function cartCount(items) {
	return items.reduce((n, i) => n + i.qty, 0);
}
function cartTotal(items) {
	return items.reduce((n, i) => n + i.qty * i.price, 0);
}
var NAV = [
	{
		to: "/",
		label: "الرئيسية"
	},
	{
		to: "/shop",
		label: "المتجر"
	},
	{
		to: "/about",
		label: "عن بَفس"
	},
	{
		to: "/contact",
		label: "تواصل"
	}
];
function SiteHeader({ settings }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const count = useCart((s) => cartCount(s.items));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur-md",
		children: [
			settings.announcement ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "bg-fg px-4 py-2 text-center text-xs tracking-wide text-primary-fg",
				children: settings.announcement
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						"aria-label": "Puffs Accessories",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "hidden items-center gap-7 text-sm md:flex",
						children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: item.to,
							className: cn("text-muted transition-opacity hover:text-fg", pathname === item.to && "text-fg"),
							children: item.label
						}, item.to))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/cart",
							className: "relative inline-flex size-11 items-center justify-center rounded-full hover:bg-surface",
							"aria-label": "السلة",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-5" }), count > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute top-1.5 right-1.5 grid size-4 place-items-center rounded-full bg-primary text-[10px] text-primary-fg",
								children: count
							}) : null]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "inline-flex size-11 items-center justify-center rounded-full hover:bg-surface md:hidden",
							onClick: () => setOpen(true),
							"aria-label": "القائمة",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
						})]
					})
				]
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-fg/40 md:hidden",
				onClick: () => setOpen(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute top-0 right-0 flex h-full w-[80%] max-w-xs flex-col gap-2 bg-bg p-5 shadow-[var(--shadow-soft)]",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "size-11",
							onClick: () => setOpen(false),
							"aria-label": "إغلاق",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
						})]
					}), NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						className: "rounded-[var(--radius-md)] px-3 py-3 text-base hover:bg-surface",
						onClick: () => setOpen(false),
						children: item.label
					}, item.to))]
				})
			}) : null
		]
	});
}
function SiteFooter({ settings }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "mt-20 border-t border-border bg-bg-elevated",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-xs text-sm leading-relaxed text-muted",
							children: settings.tagline_ar
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-sm italic text-muted",
							children: settings.tagline
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: "تواصلي"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "block text-muted hover:text-fg",
							href: `tel:${settings.phone}`,
							children: settings.phone
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: settings.address
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: settings.hours
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: "السوشيال"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							className: "flex items-center gap-2 text-muted hover:text-fg",
							href: settings.instagram,
							target: "_blank",
							rel: "noreferrer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "size-4" }), "Instagram"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "block text-muted hover:text-fg",
							href: settings.facebook,
							target: "_blank",
							rel: "noreferrer",
							children: "Facebook"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin",
							className: "block pt-4 text-xs text-subtle hover:text-muted",
							children: "لوحة التحكم"
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "border-t border-border px-4 py-4 text-center text-xs text-subtle",
			children: [
				"© ",
				(/* @__PURE__ */ new Date()).getFullYear(),
				" Puffs Accessories"
			]
		})]
	});
}
function WhatsappFloat({ settings }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: waLink(settings.whatsapp, "مرحباً، عايزة أسأل عن الإكسسوارات"),
		target: "_blank",
		rel: "noreferrer",
		className: "fixed bottom-24 right-4 z-40 inline-flex h-12 items-center rounded-full bg-fg px-4 text-sm text-primary-fg shadow-[var(--shadow-soft)]",
		"aria-label": "واتساب",
		children: "واتساب"
	});
}
function PublicShell({ settings, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-svh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { settings }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, { settings }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsappFloat, { settings })
		]
	});
}
//#endregion
export { cartTotal as n, useCart as r, PublicShell as t };
