import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { c as Clock3, i as Phone, o as MapPin } from "../_libs/lucide-react.mjs";
import { i as Route$4 } from "./router-B5NbMumT.mjs";
import { o as waLink, t as Button } from "./button-B_iuE2vF.mjs";
import { t as PublicShell } from "./site-shell-2PQ2QHVV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-DX7ohLhH.js
var import_jsx_runtime = require_jsx_runtime();
function Contact() {
	const { settings } = Route$4.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicShell, {
		settings,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "wordmark text-[11px] text-muted",
					children: "Visit"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-5xl",
					children: "تواصلي معانا"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 grid gap-4 md:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoCard, {
							icon: Phone,
							title: "موبايل / واتساب",
							body: settings.phone,
							href: `tel:${settings.phone}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoCard, {
							icon: MapPin,
							title: "العنوان",
							body: settings.address
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoCard, {
							icon: Clock3,
							title: "المواعيد",
							body: settings.hours
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 flex flex-wrap gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: waLink(settings.whatsapp, "مرحباً Puffs، عايزة أطلب"),
							target: "_blank",
							rel: "noreferrer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								children: "واتساب"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: settings.instagram,
							target: "_blank",
							rel: "noreferrer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								variant: "outline",
								children: "إنستجرام"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: settings.facebook,
							target: "_blank",
							rel: "noreferrer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								variant: "outline",
								children: "فيسبوك"
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/images/hero.jpg",
					alt: "",
					className: "mt-12 h-72 w-full rounded-[var(--radius-xl)] object-cover md:h-[420px]"
				})
			]
		})
	});
}
function InfoCard({ icon: Icon, title, body, href }) {
	const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5 text-primary" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-muted",
			children: title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-lg",
			children: body
		})
	] });
	const cls = "rounded-[var(--radius-lg)] bg-bg-elevated p-6 ring-1 ring-border";
	return href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		className: cls,
		href,
		children: inner
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cls,
		children: inner
	});
}
//#endregion
export { Contact as component };
