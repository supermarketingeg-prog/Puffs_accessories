import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { S as Navigate, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as hasGateSessionMarker } from "./server-B_34idVJ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as adminGetAll, f as saveBanner, h as setOrderStatus, l as deleteBanner, m as saveSettings, p as saveProduct, u as deleteProduct } from "./router-B5NbMumT.mjs";
import { a as formatPrice, i as fileToDataUrl, n as Logo, r as cn, t as Button } from "./button-B_iuE2vF.mjs";
import { i as signOut, t as authClient } from "./client-1vAx-gM_.mjs";
import { n as Label, r as Textarea, t as Input } from "./input-D_cMCrV9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DRpvNjZ6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ImageField({ label, value, onChange }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }),
			value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: value,
				alt: "",
				className: "h-36 w-full rounded-[var(--radius-md)] object-cover ring-1 ring-border"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "file",
				accept: "image/*",
				onChange: async (e) => {
					const file = e.target.files?.[0];
					if (!file) return;
					setBusy(true);
					try {
						onChange(await fileToDataUrl(file));
					} finally {
						setBusy(false);
					}
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "أو الصقي رابط صورة",
				value: value.startsWith("data:") ? "" : value,
				onChange: (e) => onChange(e.target.value)
			}),
			busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "جاري تجهيز الصورة…"
			}) : null
		]
	});
}
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
function AdminGate() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-svh place-items-center bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-40 animate-pulse rounded-full bg-surface" })
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPage, {});
}
function AdminPage() {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["admin"],
		queryFn: () => adminGetAll()
	});
	const [tab, setTab] = (0, import_react.useState)("products");
	if (q.isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-svh place-items-center bg-bg px-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "الصفحة دي للأدمن فقط." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "text-sm underline",
				children: "الرجوع للموقع"
			})]
		})
	});
	if (q.isPending || !q.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-svh bg-bg p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 animate-pulse rounded-[var(--radius-lg)] bg-surface" })
	});
	const refresh = () => {
		qc.invalidateQueries({ queryKey: ["admin"] });
		qc.invalidateQueries({ queryKey: ["storefront"] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-svh bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between gap-3 border-b border-border px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden text-sm text-muted sm:inline",
					children: "لوحة التحكم"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 py-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 overflow-x-auto pb-4",
					children: [
						["products", "المنتجات"],
						["banners", "البانر"],
						["orders", "الطلبات"],
						["settings", "إعدادات الموقع"]
					].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTab(id),
						className: cn("h-10 shrink-0 rounded-full px-4 text-sm", tab === id ? "bg-fg text-primary-fg" : "bg-surface"),
						children: label
					}, id))
				}),
				tab === "products" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductsTab, {
					products: q.data.products,
					categories: q.data.categories,
					onDone: refresh
				}) : null,
				tab === "banners" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BannersTab, {
					banners: q.data.banners,
					onDone: refresh
				}) : null,
				tab === "orders" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrdersTab, {
					orders: q.data.orders,
					onDone: refresh
				}) : null,
				tab === "settings" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsTab, {
					settings: q.data.settings,
					onDone: refresh
				}) : null
			]
		})]
	});
}
function ProductsTab({ products, categories, onDone }) {
	const empty = {
		name_ar: "",
		name_en: "",
		slug: "",
		description_ar: "",
		price: 0,
		compare_at: null,
		image_url: "/products/pearl-layers.jpg",
		featured: false,
		in_stock: true,
		category_id: categories[0]?.id ?? null,
		sort_order: 0
	};
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function save() {
		if (!editing?.name_ar) return;
		setBusy(true);
		try {
			const slug = editing.slug || editing.name_en?.toLowerCase().replace(/\s+/g, "-") || `item-${Date.now()}`;
			await saveProduct({ data: {
				id: editing.id,
				slug,
				name_ar: editing.name_ar,
				name_en: editing.name_en || "",
				description_ar: editing.description_ar || "",
				description_en: editing.description_en || "",
				category_id: editing.category_id ?? null,
				price: Number(editing.price) || 0,
				compare_at: editing.compare_at ? Number(editing.compare_at) : null,
				image_url: editing.image_url || "",
				featured: Boolean(editing.featured),
				in_stock: editing.in_stock !== false,
				sort_order: Number(editing.sort_order) || 0
			} });
			toast.success("تم حفظ المنتج");
			setEditing(null);
			onDone();
		} catch {
			toast.error("تعذر الحفظ");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[1fr_340px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl",
					children: "المنتجات"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => setEditing({ ...empty }),
					children: "منتج جديد"
				})]
			}), products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3 rounded-[var(--radius-md)] bg-bg-elevated p-3 ring-1 ring-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: p.image_url,
						alt: "",
						className: "size-16 rounded-[var(--radius-sm)] object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-medium",
							children: p.name_ar
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-primary tabular-nums",
							children: formatPrice(p.price)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => setEditing(p),
							children: "تعديل"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: async () => {
								if (!confirm("تحذف المنتج؟")) return;
								await deleteProduct({ data: { id: p.id } });
								onDone();
							},
							children: "حذف"
						})]
					})
				]
			}, p.id))]
		}), editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "h-fit space-y-3 rounded-[var(--radius-lg)] bg-bg-elevated p-4 ring-1 ring-border",
			onSubmit: (e) => {
				e.preventDefault();
				save();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-medium",
					children: editing.id ? "تعديل منتج" : "منتج جديد"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageField, {
					label: "الصورة",
					value: editing.image_url || "",
					onChange: (image_url) => setEditing({
						...editing,
						image_url
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "الاسم بالعربي",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: editing.name_ar || "",
						onChange: (e) => setEditing({
							...editing,
							name_ar: e.target.value
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "الاسم بالإنجليزي",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: editing.name_en || "",
						onChange: (e) => setEditing({
							...editing,
							name_en: e.target.value
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "الرابط (slug)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: editing.slug || "",
						onChange: (e) => setEditing({
							...editing,
							slug: e.target.value
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "الوصف",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: editing.description_ar || "",
						onChange: (e) => setEditing({
							...editing,
							description_ar: e.target.value
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "السعر",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: editing.price ?? 0,
							onChange: (e) => setEditing({
								...editing,
								price: Number(e.target.value)
							})
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "قبل الخصم",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: editing.compare_at ?? "",
							onChange: (e) => setEditing({
								...editing,
								compare_at: e.target.value ? Number(e.target.value) : null
							})
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "القسم",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "h-11 w-full rounded-[var(--radius-sm)] border border-border bg-bg-elevated px-3 text-sm",
						value: editing.category_id ?? "",
						onChange: (e) => setEditing({
							...editing,
							category_id: e.target.value ? Number(e.target.value) : null
						}),
						children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: c.id,
							children: c.name_ar
						}, c.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: Boolean(editing.featured),
						onChange: (e) => setEditing({
							...editing,
							featured: e.target.checked
						})
					}), "مميز على الرئيسية"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: editing.in_stock !== false,
						onChange: (e) => setEditing({
							...editing,
							in_stock: e.target.checked
						})
					}), "متوفر"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: busy,
						className: "flex-1",
						children: "حفظ"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => setEditing(null),
						children: "إلغاء"
					})]
				})
			]
		}) : null]
	});
}
function BannersTab({ banners, onDone }) {
	const [editing, setEditing] = (0, import_react.useState)(null);
	async function save() {
		if (!editing?.image_url) return;
		await saveBanner({ data: {
			id: editing.id,
			title: editing.title || "",
			subtitle: editing.subtitle || "",
			image_url: editing.image_url,
			link_url: editing.link_url || "/shop",
			sort_order: Number(editing.sort_order) || 0,
			active: editing.active !== false
		} });
		toast.success("تم حفظ البانر");
		setEditing(null);
		onDone();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl",
					children: "البانر"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => setEditing({
						title: "",
						subtitle: "",
						image_url: "/images/hero.jpg",
						link_url: "/shop",
						active: true,
						sort_order: 0
					}),
					children: "بانر جديد"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: banners.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "overflow-hidden rounded-[var(--radius-lg)] text-start ring-1 ring-border",
					onClick: () => setEditing(b),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: b.image_url,
						alt: "",
						className: "h-40 w-full object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: b.title || "بدون عنوان"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: b.subtitle
						})]
					})]
				}, b.id))
			}),
			editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3 rounded-[var(--radius-lg)] bg-bg-elevated p-4 ring-1 ring-border",
				onSubmit: (e) => {
					e.preventDefault();
					save();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageField, {
						label: "صورة البانر",
						value: editing.image_url || "",
						onChange: (image_url) => setEditing({
							...editing,
							image_url
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "العنوان",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: editing.title || "",
							onChange: (e) => setEditing({
								...editing,
								title: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "النص",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: editing.subtitle || "",
							onChange: (e) => setEditing({
								...editing,
								subtitle: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "الرابط",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: editing.link_url || "",
							onChange: (e) => setEditing({
								...editing,
								link_url: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: editing.active !== false,
							onChange: (e) => setEditing({
								...editing,
								active: e.target.checked
							})
						}), "ظاهر على الموقع"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								children: "حفظ"
							}),
							editing.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "danger",
								onClick: async () => {
									await deleteBanner({ data: { id: editing.id } });
									setEditing(null);
									onDone();
								},
								children: "حذف"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setEditing(null),
								children: "إلغاء"
							})
						]
					})
				]
			}) : null
		]
	});
}
function OrdersTab({ orders, onDone }) {
	if (!orders.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "مفيش طلبات لسه."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "الطلبات"
		}), orders.map((o) => {
			let items = [];
			try {
				items = JSON.parse(o.items_json);
			} catch {
				items = [];
			}
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-[var(--radius-lg)] bg-bg-elevated p-4 ring-1 ring-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: o.customer_name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: o.phone
							}),
							o.address ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: o.address
							}) : null
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "tabular-nums text-primary",
							children: formatPrice(o.total)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 text-sm text-muted",
						children: items.map((i, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							i.name,
							" × ",
							i.qty
						] }, idx))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex gap-2",
						children: [
							"new",
							"done",
							"cancelled"
						].map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: o.status === st ? "primary" : "outline",
							onClick: async () => {
								await setOrderStatus({ data: {
									id: o.id,
									status: st
								} });
								onDone();
							},
							children: st === "new" ? "جديد" : st === "done" ? "تم" : "ملغي"
						}, st))
					})
				]
			}, o.id);
		})]
	});
}
function SettingsTab({ settings, onDone }) {
	const [form, setForm] = (0, import_react.useState)(settings);
	const fields = (0, import_react.useMemo)(() => [
		["brand_name", "اسم البراند"],
		["tagline_ar", "الجملة العربية"],
		["tagline", "الجملة الإنجليزية"],
		["announcement", "شريط الإعلان"],
		["about_ar", "عن المحل"],
		["phone", "الموبايل"],
		["whatsapp", "واتساب بدون +"],
		["instagram", "رابط إنستجرام"],
		["facebook", "رابط فيسبوك"],
		["address", "العنوان"],
		["hours", "المواعيد"],
		["hero_title", "عنوان الهيرو"],
		["hero_subtitle", "نص الهيرو"],
		["supabase_url", "رابط Supabase"],
		["supabase_key", "مفتاح Supabase anon"]
	], []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "mx-auto max-w-2xl space-y-4",
		onSubmit: async (e) => {
			e.preventDefault();
			await saveSettings({ data: form });
			toast.success("اتحفظت الإعدادات واتزامنت");
			onDone();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "إعدادات الموقع"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "أي تعديل هنا يظهر على الموقع فوراً. لو حطيتي مفتاح Supabase، المنتجات تتبعت كمان على لوحة Supabase."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageField, {
				label: "لوجو / إمبليم",
				value: form.logo_url || "",
				onChange: (logo_url) => setForm({
					...form,
					logo_url
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageField, {
				label: "صورة الهيرو",
				value: form.hero_image || "",
				onChange: (hero_image) => setForm({
					...form,
					hero_image
				})
			}),
			fields.map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label,
				children: key === "about_ar" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: form[key] || "",
					onChange: (e) => setForm({
						...form,
						[key]: e.target.value
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: key === "supabase_key" ? "password" : "text",
					value: form[key] || "",
					onChange: (e) => setForm({
						...form,
						[key]: e.target.value
					})
				})
			}, key)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				className: "w-full",
				children: "حفظ كل الإعدادات"
			})
		]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children] });
}
//#endregion
export { AdminGate as component };
