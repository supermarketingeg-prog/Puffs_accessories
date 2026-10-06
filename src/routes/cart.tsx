import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PublicShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { getStorefront, placeOrder } from "@/lib/api";
import { cartTotal, useCart } from "@/lib/cart";
import { formatPrice, waLink } from "@/lib/utils";

const EGYPT_GOVERNORATES = [
  "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "البحر الأحمر", "البحيرة", "الفيوم", "الغربية",
  "الإسماعيلية", "المنوفية", "المنيا", "القليوبية", "الوادي الجديد", "السويس", "أسوان", "أسيوط",
  "بني سويف", "بورسعيد", "دمياط", "الشرقية", "جنوب سيناء", "كفر الشيخ", "مطروح", "الأقصر",
  "قنا", "شمال سيناء", "سوهاج",
];

export const Route = createFileRoute("/cart")({
  loader: () => getStorefront(),
  component: CartPage,
});

function CartPage() {
  const { settings } = Route.useLoaderData();
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const total = cartTotal(items);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  async function checkout() {
    if (!items.length) return;
    if (name.trim().length < 2 || phone.trim().length < 8 || !governorate || !address.trim()) {
      toast.error("اكتبي الاسم والموبايل والمحافظة والعنوان");
      return;
    }
    setBusy(true);
    const lines = items.map((i) => `• ${i.name} × ${i.qty} = ${i.price * i.qty} ج.م`).join("\n");
    const text = `طلب جديد من موقع Puffs\nالاسم: ${name}\nالموبايل: ${phone}\nالمحافظة: ${governorate}\nالعنوان: ${address}\n\n${lines}\n\nالإجمالي: ${total} ج.م${notes ? `\nملاحظات: ${notes}` : ""}`;
    // Open WhatsApp inside the click event so mobile browsers do not block it.
    // Saving the order is useful for the dashboard, but must not prevent a sale.
    window.open(waLink(settings.whatsapp, text), "_blank", "noopener,noreferrer");
    try {
      await placeOrder({
        data: {
          customer_name: name.trim(),
          phone: phone.trim(),
          address: `${governorate} — ${address.trim()}`,
          notes: notes.trim(),
          items: items.map((i) => ({
            productId: i.productId,
            slug: i.slug,
            name: i.name,
            price: i.price,
            qty: i.qty,
          })),
        },
      });
      clear();
      toast.success("تم إرسال الطلب إلى واتساب وتسجيله في لوحة التحكم");
    } catch {
      clear();
      toast.message("تم إرسال الطلب إلى واتساب. تعذر حفظ نسخة منه في لوحة التحكم.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PublicShell settings={settings} showWhatsapp={false}>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="font-display text-5xl">السلة</h1>
        {items.length === 0 ? (
          <div className="mt-12 space-y-4">
            <p className="text-muted">السلة فاضية.</p>
            <Link to="/shop">
              <Button>تسوّقي</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4 rounded-[var(--radius-lg)] bg-bg-elevated p-3 ring-1 ring-border">
                  <img src={item.image} alt="" className="size-24 rounded-[var(--radius-md)] object-cover" />
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium">{item.name}</p>
                      <button type="button" className="text-xs text-muted" onClick={() => remove(item.productId)}>
                        حذف
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => setQty(item.productId, item.qty - 1)}>
                          −
                        </Button>
                        <span className="tabular-nums w-6 text-center">{item.qty}</span>
                        <Button size="sm" variant="outline" onClick={() => setQty(item.productId, item.qty + 1)}>
                          +
                        </Button>
                      </div>
                      <span className="tabular-nums text-primary">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <aside className="h-fit rounded-[var(--radius-xl)] bg-bg-elevated p-6 ring-1 ring-border">
              <p className="flex items-center justify-between text-lg">
                الإجمالي
                <span className="tabular-nums text-primary">{formatPrice(total)}</span>
              </p>
              <div className="mt-6 space-y-3">
                <div>
                  <Label htmlFor="name">الاسم</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="phone">الموبايل</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
                </div>
                <div>
                  <Label htmlFor="governorate">المحافظة</Label>
                  <select
                    id="governorate"
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="h-11 w-full rounded-[var(--radius-sm)] border border-border bg-bg-elevated px-3 text-sm text-fg outline-none focus:border-primary"
                  >
                    <option value="" disabled>اختاري المحافظة</option>
                    {EGYPT_GOVERNORATES.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
                <div>
                  <Label htmlFor="address">العنوان بالتفصيل</Label>
                  <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="المنطقة، الشارع، رقم العقار" />
                </div>
                <div>
                  <Label htmlFor="notes">ملاحظات</Label>
                  <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
                <Button className="w-full" size="lg" disabled={busy} onClick={checkout}>
                  {busy ? "جاري الإرسال…" : "تأكيد الطلب عبر واتساب"}
                </Button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </PublicShell>
  );
}
