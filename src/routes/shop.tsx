import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/product-card";
import { PublicShell } from "@/components/site-shell";
import { getStorefront } from "@/lib/api";
import { cn } from "@/lib/utils";

type ShopSearch = { cat?: string };

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): ShopSearch => ({
    cat: typeof s.cat === "string" ? s.cat : undefined,
  }),
  loader: () => getStorefront(),
  component: Shop,
});

function Shop() {
  const { cat } = Route.useSearch();
  const navigate = Route.useNavigate();
  const data = Route.useLoaderData();
  const { settings, categories, products } = data;
  const active = cat ? categories.find((c) => c.slug === cat) : null;
  const list = active ? products.filter((p) => p.category_id === active.id) : products;

  return (
    <PublicShell settings={settings}>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <p className="wordmark text-[11px] text-muted">Shop</p>
        <h1 className="mt-2 font-display text-5xl">{active ? active.name_ar : "كل القطع"}</h1>
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          <FilterChip active={!cat} onClick={() => navigate({ search: {} })}>
            الكل
          </FilterChip>
          {categories.map((c) => (
            <FilterChip
              key={c.id}
              active={cat === c.slug}
              onClick={() => navigate({ search: { cat: c.slug } })}
            >
              {c.name_ar}
            </FilterChip>
          ))}
        </div>
        {list.length === 0 ? (
          <p className="mt-16 text-muted">مفيش قطع في القسم ده دلوقتي.</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </PublicShell>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-10 shrink-0 rounded-full px-4 text-sm",
        active ? "bg-fg text-primary-fg" : "bg-surface text-fg hover:bg-border",
      )}
    >
      {children}
    </button>
  );
}
