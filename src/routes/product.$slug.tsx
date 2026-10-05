import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/product-card";
import { PublicShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { getProductBySlug, getStorefront } from "@/lib/api";
import { useCart } from "@/lib/cart";
import { formatPrice, waLink } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const [store, product] = await Promise.all([
      getStorefront(),
      getProductBySlug({ data: { slug: params.slug } }),
    ]);
    return { store, product };
  },
  component: ProductPage,
});

function ProductPage() {
  const { store, product } = Route.useLoaderData();
  const add = useCart((s) => s.add);
  const { settings, products } = store;
  if (!product) {
    return (
      <PublicShell settings={settings}>
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <h1 className="font-display text-4xl">القطعة مش موجودة</h1>
          <Link to="/shop" className="mt-6 inline-block text-sm underline">
            رجوع للمتجر
          </Link>
        </div>
      </PublicShell>
    );
  }
  const related = products.filter((p) => p.id !== product.id && p.category_id === product.category_id).slice(0, 4);
  const msg = `مرحباً، عايزة أطلب: ${product.name_ar} — ${product.price} ج.م`;

  return (
    <PublicShell settings={settings}>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2">
        <div className="overflow-hidden rounded-[var(--radius-xl)] bg-surface">
          <img src={product.image_url} alt={product.name_ar} className="aspect-square w-full object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <p className="wordmark text-[11px] text-muted">Puffs</p>
          <h1 className="mt-2 font-display text-5xl">{product.name_ar}</h1>
          {product.name_en ? <p className="mt-1 text-muted">{product.name_en}</p> : null}
          <div className="mt-6 flex items-baseline gap-3 tabular-nums">
            <span className="text-2xl text-primary">{formatPrice(product.price)}</span>
            {product.compare_at && product.compare_at > product.price ? (
              <span className="text-muted line-through">{formatPrice(product.compare_at)}</span>
            ) : null}
          </div>
          <p className="mt-6 max-w-md leading-relaxed text-muted">{product.description_ar}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              disabled={!product.in_stock}
              onClick={() => {
                add(product);
                toast.success("اتضافت للسلة");
              }}
            >
              أضيفي للسلة
            </Button>
            <a href={waLink(settings.whatsapp, msg)} target="_blank" rel="noreferrer">
              <Button size="lg" variant="outline" className="w-full">
                اطلبي واتساب
              </Button>
            </a>
          </div>
        </div>
      </div>
      {related.length ? (
        <div className="mx-auto max-w-6xl px-4 pb-16">
          <h2 className="mb-6 font-display text-3xl">قطع مشابهة</h2>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      ) : null}
    </PublicShell>
  );
}
