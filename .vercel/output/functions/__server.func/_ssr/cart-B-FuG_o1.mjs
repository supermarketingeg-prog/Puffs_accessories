import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as Route$5, d as placeOrder } from "./router-B5NbMumT.mjs";
import { a as formatPrice, o as waLink, t as Button } from "./button-B_iuE2vF.mjs";
import { n as cartTotal, r as useCart, t as PublicShell } from "./site-shell-2PQ2QHVV.mjs";
import { n as Label, r as Textarea, t as Input } from "./input-D_cMCrV9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-B-FuG_o1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CartPage() {
	const { settings } = Route$5.useLoaderData();
	const items = useCart((s) => s.items);
	const setQty = useCart((s) => s.setQty);
	const remove = useCart((s) => s.remove);
	const clear = useCart((s) => s.clear);
	const total = cartTotal(items);
	const [name, setName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [address, setAddress] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function checkout() {
		if (!items.length) return;
		if (name.trim().length < 2 || phone.trim().length < 8) {
			toast.error("اكتبي الاسم ورقم الموبايل");
			return;
		}
		setBusy(true);
		try {
			const result = await placeOrder({ data: {
				customer_name: name.trim(),
				phone: phone.trim(),
				address: address.trim(),
				notes: notes.trim(),
				items: items.map((i) => ({
					productId: i.productId,
					slug: i.slug,
					name: i.name,
					price: i.price,
					qty: i.qty
				}))
			} });
			const lines = items.map((i) => `• ${i.name} × ${i.qty} = ${i.price * i.qty} ج.م`).join("\n");
			const text = `طلب جديد من موقع Puffs\n${name}\n${phone}\n${address}\n\n${lines}\n\nالإجمالي: ${result.total} ج.م\n${notes}`;
			clear();
			toast.success("تم تسجيل الطلب");
			window.open(waLink(settings.whatsapp, text), "_blank");
		} catch {
			toast.error("حصل خطأ، جرّبي تاني أو ابعتي واتساب مباشرة");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicShell, {
		settings,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 py-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-5xl",
				children: "السلة"
			}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: "السلة فاضية."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/shop",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "تسوّقي" })
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-10 md:grid-cols-[1.2fr_0.8fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-4",
					children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-4 rounded-[var(--radius-lg)] bg-bg-elevated p-3 ring-1 ring-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: item.image,
							alt: "",
							className: "size-24 rounded-[var(--radius-md)] object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-1 flex-col justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: item.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-xs text-muted",
									onClick: () => remove(item.productId),
									children: "حذف"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => setQty(item.productId, item.qty - 1),
											children: "−"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tabular-nums w-6 text-center",
											children: item.qty
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => setQty(item.productId, item.qty + 1),
											children: "+"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums text-primary",
									children: formatPrice(item.price * item.qty)
								})]
							})]
						})]
					}, item.productId))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "h-fit rounded-[var(--radius-xl)] bg-bg-elevated p-6 ring-1 ring-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center justify-between text-lg",
						children: ["الإجمالي", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums text-primary",
							children: formatPrice(total)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "name",
								children: "الاسم"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "name",
								value: name,
								onChange: (e) => setName(e.target.value)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "phone",
								children: "الموبايل"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "phone",
								value: phone,
								onChange: (e) => setPhone(e.target.value),
								inputMode: "tel"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "address",
								children: "العنوان"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "address",
								value: address,
								onChange: (e) => setAddress(e.target.value)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "notes",
								children: "ملاحظات"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "notes",
								value: notes,
								onChange: (e) => setNotes(e.target.value)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "w-full",
								size: "lg",
								disabled: busy,
								onClick: checkout,
								children: busy ? "جاري الإرسال…" : "تأكيد الطلب عبر واتساب"
							})
						]
					})]
				})]
			})]
		})
	});
}
//#endregion
export { CartPage as component };
