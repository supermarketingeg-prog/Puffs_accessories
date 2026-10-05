import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-B_iuE2vF.js
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatPrice(egp) {
	return `${new Intl.NumberFormat("ar-EG").format(egp)} ج.م`;
}
function waLink(phone, text) {
	return `https://wa.me/${phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(text)}`;
}
async function fileToDataUrl(file, maxSize = 1200) {
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
	const w = Math.round(bitmap.width * scale);
	const h = Math.round(bitmap.height * scale);
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("canvas");
	ctx.drawImage(bitmap, 0, 0, w, h);
	return canvas.toDataURL("image/jpeg", .82);
}
function Logo({ className, markClassName, light = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-2.5", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: "/images/emblem.jpg",
			alt: "",
			className: cn("size-9 rounded-full object-cover ring-1 ring-border", markClassName)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("wordmark text-[15px] leading-none", light ? "text-primary-fg" : "text-fg"),
			children: "Puffs"
		})]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-medium transition-opacity duration-[var(--motion-quick,150ms)] disabled:opacity-50 disabled:pointer-events-none select-none", {
	variants: {
		variant: {
			primary: "bg-primary text-primary-fg hover:opacity-90",
			outline: "border border-border bg-bg-elevated text-fg hover:bg-surface",
			ghost: "text-fg hover:bg-surface",
			danger: "bg-danger text-primary-fg hover:opacity-90"
		},
		size: {
			sm: "h-9 px-3 text-sm rounded-[var(--radius-sm)]",
			md: "h-11 px-5 text-sm rounded-[var(--radius-md)]",
			lg: "h-12 px-6 text-base rounded-[var(--radius-md)]",
			icon: "size-11 rounded-full"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
//#endregion
export { formatPrice as a, fileToDataUrl as i, Logo as n, waLink as o, cn as r, Button as t };
