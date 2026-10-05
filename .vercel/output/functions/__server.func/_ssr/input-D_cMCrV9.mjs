import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { r as cn } from "./button-B_iuE2vF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/input-D_cMCrV9.js
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full rounded-[var(--radius-sm)] border border-border bg-bg-elevated px-3 text-sm text-fg placeholder:text-subtle outline-none focus:border-primary", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-28 w-full rounded-[var(--radius-md)] border border-border bg-bg-elevated px-3 py-2 text-sm text-fg placeholder:text-subtle outline-none focus:border-primary", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("mb-1.5 block text-sm font-medium text-fg", className),
		...props
	});
}
//#endregion
export { Label as n, Textarea as r, Input as t };
