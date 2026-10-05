import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as Route$7 } from "./router-B5NbMumT.mjs";
import { t as Button } from "./button-B_iuE2vF.mjs";
import { t as PublicShell } from "./site-shell-2PQ2QHVV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-bWV7Iazh.js
var import_jsx_runtime = require_jsx_runtime();
function About() {
	const { settings } = Route$7.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicShell, {
		settings,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "wordmark text-[11px] text-muted",
					children: "Our story"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-5xl md:text-7xl",
					children: "عن بَفس"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 grid gap-10 md:grid-cols-2 md:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/images/emblem.jpg",
						alt: "",
						className: "aspect-square w-full rounded-[var(--radius-xl)] object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-5 text-muted leading-relaxed",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg text-fg",
								children: settings.about_ar
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: settings.about_en }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"بنشتغل من ",
								settings.address,
								". مواعيدنا ",
								settings.hours,
								"."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl italic text-fg",
								children: settings.tagline
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/shop",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "تسوّقي المجموعة" })
							})
						]
					})]
				})
			]
		})
	});
}
//#endregion
export { About as component };
