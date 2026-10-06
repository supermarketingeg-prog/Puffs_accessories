import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { ImageField } from "@/components/image-field";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import {
  adminGetAll,
  adminLogin,
  adminLogout,
  deleteBanner,
  deleteProduct,
  saveBanner,
  saveProduct,
  saveSettings,
  setOrderStatus,
} from "@/lib/api";
import type { Banner, Category, Order, Product, SettingsMap } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";

export const Route = createFileRoute("/admin")({ component: AdminGate });

type Tab = "products" | "banners" | "settings" | "orders";

function AdminGate() {
  const qc = useQueryClient();
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (authed) {
    return (
      <AdminPage
        onLogout={() => {
          void adminLogout().finally(() => {
            qc.removeQueries({ queryKey: ["admin"] });
            setAuthed(false);
          });
        }}
      />
    );
  }

  return (
    <main className="grid min-h-svh place-items-center bg-bg px-4 py-8">
      <div className="w-full max-w-md space-y-6 rounded-[var(--radius-xl)] bg-bg-elevated p-8 ring-1 ring-border shadow-soft">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="text-center space-y-1">
          <h1 className="font-display text-2xl font-bold">لوحة تحكم Puffs</h1>
          <p className="text-sm text-muted">ادخل كلمة سر الأدمن لإدارة المنتجات والصور والطلبات.</p>
        </div>

        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              await adminLogin({ data: { password } });
              setAuthed(true);
              setPassword("");
            } catch (err) {
              setError(err instanceof Error ? err.message : "تعذر تسجيل الدخول");
            } finally {
              setBusy(false);
            }
          }}
        >
          <div className="space-y-1.5 text-right">
            <Label>كلمة سر الأدمن</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              required
              autoFocus
            />
            {error ? <p className="text-xs text-danger">{error}</p> : null}
          </div>

          <Button type="submit" className="w-full h-11 text-base" disabled={busy}>
            {busy ? "جاري الدخول…" : "دخول للوحة التحكم"}
          </Button>

          <div className="pt-2 text-center">
            <Link to="/" className="text-xs text-muted hover:text-fg underline">
              الرجوع إلى المتجر
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

function AdminPage({ onLogout }: { onLogout?: () => void }) {
  const qc = useQueryClient();
  const router = useRouter();
  const q = useQuery({ queryKey: ["admin"], queryFn: () => adminGetAll() });
  const [tab, setTab] = useState<Tab>("products");

  if (q.isPending || !q.data) {
    return (
      <div className="min-h-svh bg-bg p-6">
        <div className="h-24 animate-pulse rounded-[var(--radius-lg)] bg-surface" />
      </div>
    );
  }
  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ["admin"] });
    void qc.invalidateQueries({ queryKey: ["storefront"] });
    void router.invalidate();
  };
  return (
    <div className="min-h-svh bg-bg">
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 bg-bg-elevated sticky top-0 z-30">
        <Link to="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xs text-muted hover:text-fg underline hidden sm:inline">
            معاينة المتجر ↗
          </Link>
          {onLogout ? (
            <Button size="sm" variant="outline" onClick={onLogout}>
              خروج
            </Button>
          ) : null}
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex gap-2 overflow-x-auto pb-4">
          {(
            [
              ["products", "المنتجات"],
              ["banners", "البانر"],
              ["orders", "الطلبات"],
              ["settings", "إعدادات الموقع"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "h-10 shrink-0 rounded-full px-4 text-sm",
                tab === id ? "bg-fg text-primary-fg" : "bg-surface",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {tab === "products" ? (
          <ProductsTab products={q.data.products} categories={q.data.categories} onDone={refresh} />
        ) : null}
        {tab === "banners" ? <BannersTab banners={q.data.banners} onDone={refresh} /> : null}
        {tab === "orders" ? <OrdersTab orders={q.data.orders} onDone={refresh} /> : null}
        {tab === "settings" ? <SettingsTab settings={q.data.settings} onDone={refresh} /> : null}
      </div>
    </div>
  );
}

function ProductsTab({
  products,
  categories,
  onDone,
}: {
  products: Product[];
  categories: Category[];
  onDone: () => void;
}) {
  const empty: Partial<Product> = {
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
    sort_order: 0,
  };
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [busy, setBusy] = useState(false);

  async function save() {
    if (!editing?.name_ar) return;
    setBusy(true);
    try {
      const slug =
        editing.slug ||
        editing.name_en?.toLowerCase().replace(/\s+/g, "-") ||
        `item-${Date.now()}`;
      await saveProduct({
        data: {
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
          sort_order: Number(editing.sort_order) || 0,
        },
      });
      toast.success("تم حفظ المنتج");
      setEditing(null);
      onDone();
    } catch {
      toast.error("تعذر الحفظ");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl">المنتجات</h1>
          <Button onClick={() => setEditing({ ...empty })}>منتج جديد</Button>
        </div>
        {products.map((p) => (
          <div key={p.id} className="flex gap-3 rounded-[var(--radius-md)] bg-bg-elevated p-3 ring-1 ring-border">
            <img src={p.image_url} alt="" className="size-16 rounded-[var(--radius-sm)] object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{p.name_ar}</p>
              <p className="text-sm text-primary tabular-nums">{formatPrice(p.price)}</p>
            </div>
            <div className="flex flex-col gap-1">
              <Button size="sm" variant="outline" onClick={() => setEditing(p)}>
                تعديل
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={async () => {
                  if (!confirm("تحذف المنتج؟")) return;
                  await deleteProduct({ data: { id: p.id } });
                  onDone();
                }}
              >
                حذف
              </Button>
            </div>
          </div>
        ))}
      </div>
      {editing ? (
        <form
          className="h-fit space-y-3 rounded-[var(--radius-lg)] bg-bg-elevated p-4 ring-1 ring-border"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          <h2 className="font-medium">{editing.id ? "تعديل منتج" : "منتج جديد"}</h2>
          <ImageField label="الصورة" folder="products" value={editing.image_url || ""} onChange={(image_url) => setEditing({ ...editing, image_url })} />
          <Field label="الاسم بالعربي">
            <Input value={editing.name_ar || ""} onChange={(e) => setEditing({ ...editing, name_ar: e.target.value })} />
          </Field>
          <Field label="الاسم بالإنجليزي">
            <Input value={editing.name_en || ""} onChange={(e) => setEditing({ ...editing, name_en: e.target.value })} />
          </Field>
          <Field label="الرابط (slug)">
            <Input value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
          </Field>
          <Field label="الوصف">
            <Textarea value={editing.description_ar || ""} onChange={(e) => setEditing({ ...editing, description_ar: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="السعر">
              <Input
                type="number"
                value={editing.price ?? 0}
                onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
              />
            </Field>
            <Field label="قبل الخصم">
              <Input
                type="number"
                value={editing.compare_at ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, compare_at: e.target.value ? Number(e.target.value) : null })
                }
              />
            </Field>
          </div>
          <Field label="القسم">
            <select
              className="h-11 w-full rounded-[var(--radius-sm)] border border-border bg-bg-elevated px-3 text-sm"
              value={editing.category_id ?? ""}
              onChange={(e) =>
                setEditing({ ...editing, category_id: e.target.value ? Number(e.target.value) : null })
              }
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name_ar}
                </option>
              ))}
            </select>
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(editing.featured)}
              onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
            />
            مميز على الرئيسية
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={editing.in_stock !== false}
              onChange={(e) => setEditing({ ...editing, in_stock: e.target.checked })}
            />
            متوفر
          </label>
          <div className="flex gap-2">
            <Button type="submit" disabled={busy} className="flex-1">
              حفظ
            </Button>
            <Button type="button" variant="outline" onClick={() => setEditing(null)}>
              إلغاء
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  );
}

function BannersTab({ banners, onDone }: { banners: Banner[]; onDone: () => void }) {
  const [editing, setEditing] = useState<Partial<Banner> | null>(null);
  async function save() {
    if (!editing?.image_url) return;
    await saveBanner({
      data: {
        id: editing.id,
        title: editing.title || "",
        subtitle: editing.subtitle || "",
        image_url: editing.image_url,
        link_url: editing.link_url || "/shop",
        sort_order: Number(editing.sort_order) || 0,
        active: editing.active !== false,
      },
    });
    toast.success("تم حفظ البانر");
    setEditing(null);
    onDone();
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">البانر</h1>
        <Button onClick={() => setEditing({ title: "", subtitle: "", image_url: "/images/hero.jpg", link_url: "/shop", active: true, sort_order: 0 })}>
          بانر جديد
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {banners.map((b) => (
          <button
            key={b.id}
            type="button"
            className="overflow-hidden rounded-[var(--radius-lg)] text-start ring-1 ring-border"
            onClick={() => setEditing(b)}
          >
            <img src={b.image_url} alt="" className="h-40 w-full object-cover" />
            <div className="p-3">
              <p className="font-medium">{b.title || "بدون عنوان"}</p>
              <p className="text-sm text-muted">{b.subtitle}</p>
            </div>
          </button>
        ))}
      </div>
      {editing ? (
        <form
          className="space-y-3 rounded-[var(--radius-lg)] bg-bg-elevated p-4 ring-1 ring-border"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          <ImageField label="صورة البانر" folder="banners" value={editing.image_url || ""} onChange={(image_url) => setEditing({ ...editing, image_url })} />
          <Field label="العنوان">
            <Input value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          </Field>
          <Field label="النص">
            <Input value={editing.subtitle || ""} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} />
          </Field>
          <Field label="الرابط">
            <Input value={editing.link_url || ""} onChange={(e) => setEditing({ ...editing, link_url: e.target.value })} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={editing.active !== false}
              onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
            />
            ظاهر على الموقع
          </label>
          <div className="flex gap-2">
            <Button type="submit">حفظ</Button>
            {editing.id ? (
              <Button
                type="button"
                variant="danger"
                onClick={async () => {
                  await deleteBanner({ data: { id: editing.id! } });
                  setEditing(null);
                  onDone();
                }}
              >
                حذف
              </Button>
            ) : null}
            <Button type="button" variant="outline" onClick={() => setEditing(null)}>
              إلغاء
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  );
}

function OrdersTab({ orders, onDone }: { orders: Order[]; onDone: () => void }) {
  if (!orders.length) return <p className="text-muted">مفيش طلبات لسه.</p>;
  return (
    <div className="space-y-3">
      <h1 className="font-display text-3xl">الطلبات</h1>
      {orders.map((o) => {
        let items: { name: string; qty: number; price: number }[] = [];
        try {
          items = JSON.parse(o.items_json) as typeof items;
        } catch {
          items = [];
        }
        return (
          <article key={o.id} className="rounded-[var(--radius-lg)] bg-bg-elevated p-4 ring-1 ring-border">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{o.customer_name}</p>
                <p className="text-sm text-muted">{o.phone}</p>
                {o.address ? <p className="text-sm text-muted">{o.address}</p> : null}
              </div>
              <p className="tabular-nums text-primary">{formatPrice(o.total)}</p>
            </div>
            <ul className="mt-3 text-sm text-muted">
              {items.map((i, idx) => (
                <li key={idx}>
                  {i.name} × {i.qty}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2">
              {(["new", "done", "cancelled"] as const).map((st) => (
                <Button
                  key={st}
                  size="sm"
                  variant={o.status === st ? "primary" : "outline"}
                  onClick={async () => {
                    await setOrderStatus({ data: { id: o.id, status: st } });
                    onDone();
                  }}
                >
                  {st === "new" ? "جديد" : st === "done" ? "تم" : "ملغي"}
                </Button>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}

function SettingsTab({ settings, onDone }: { settings: SettingsMap; onDone: () => void }) {
  const [form, setForm] = useState(settings);
  const fields = useMemo(
    () =>
      [
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
      ] as const,
    [],
  );
  return (
    <form
      className="mx-auto max-w-2xl space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        await saveSettings({ data: form });
        toast.success("اتحفظت الإعدادات واتزامنت");
        onDone();
      }}
    >
      <h1 className="font-display text-3xl">إعدادات الموقع</h1>
      <p className="text-sm text-muted">
        أي تعديل هنا يظهر على الموقع فوراً ويتزامن مع Supabase. مفاتيح الربط محفوظة بأمان في Vercel وليست داخل اللوحة.
      </p>
      <ImageField label="لوجو / إمبليم" folder="settings" value={form.logo_url || ""} onChange={(logo_url) => setForm({ ...form, logo_url })} />
      <ImageField label="صورة الهيرو" folder="settings" value={form.hero_image || ""} onChange={(hero_image) => setForm({ ...form, hero_image })} />
      {fields.map(([key, label]) => (
        <Field key={key} label={label}>
          {key === "about_ar" ? (
            <Textarea value={form[key] || ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          ) : (
            <Input
              type="text"
              value={form[key] || ""}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          )}
        </Field>
      ))}
      <Button type="submit" className="w-full">
        حفظ كل الإعدادات
      </Button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
