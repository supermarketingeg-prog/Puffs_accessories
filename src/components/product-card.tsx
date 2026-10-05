import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  return (
    <article className="group flex flex-col">
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="relative block overflow-hidden rounded-[var(--radius-lg)] bg-surface"
      >
        <img
          src={product.image_url}
          alt={product.name_ar}
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {!product.in_stock ? (
          <span className="absolute top-3 right-3 rounded-full bg-bg-elevated/90 px-3 py-1 text-xs text-muted">
            غير متوفر
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-1 pt-3">
        <Link to="/product/$slug" params={{ slug: product.slug }} className="text-[15px] font-medium">
          {product.name_ar}
        </Link>
        <div className="flex items-baseline gap-2 tabular-nums">
          <span className="text-primary">{formatPrice(product.price)}</span>
          {product.compare_at && product.compare_at > product.price ? (
            <span className="text-sm text-subtle line-through">{formatPrice(product.compare_at)}</span>
          ) : null}
        </div>
        <Button
          className="mt-3 w-full"
          variant="outline"
          disabled={!product.in_stock}
          onClick={() => {
            add(product);
            toast.success("اتضافت للسلة");
          }}
        >
          أضيفي للسلة
        </Button>
      </div>
    </article>
  );
}
