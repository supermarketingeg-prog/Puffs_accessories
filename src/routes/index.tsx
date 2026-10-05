import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { PublicShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { getStorefront } from "@/lib/api";

export const Route = createFileRoute("/")({
  loader: () => getStorefront(),
  component: Home,
});

function Home() {
  const data = Route.useLoaderData();
  const { settings, banners, categories, products } = data;
  const hero = banners[0];
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const rest = featured.length ? featured : products.slice(0, 8);

  return (
    <PublicShell settings={settings}>
      <section className="relative min-h-[88svh] overflow-hidden">
        <img
          src={hero?.image_url || settings.hero_image}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(28_22_17/0.18),rgb(28_22_17/0.62))]" />
        <div className="relative mx-auto flex min-h-[88svh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28">
          <p className="wordmark mb-4 text-xs text-primary-fg/80">Accessories</p>
          <h1 className="font-display text-[clamp(3.4rem,12vw,8rem)] leading-[0.9] text-primary-fg">
            {hero?.title || settings.hero_title}
          </h1>
          <p className="mt-5 max-w-md text-lg text-primary-fg/90">
            {hero?.subtitle || settings.hero_subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop">
              <Button size="lg">تسوقي الآن</Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="border-primary-fg/30 bg-transparent text-primary-fg hover:bg-primary-fg/10">
                قصتنا
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="wordmark text-[11px] text-muted">Collections</p>
            <h2 className="mt-2 font-display text-4xl">اختاري قطعتك</h2>
          </div>
          <Link to="/shop" className="hidden items-center gap-1 text-sm text-muted hover:text-fg md:inline-flex">
            كل القطع
            <ArrowLeft className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/shop"
              search={{ cat: c.slug }}
              className="group relative overflow-hidden rounded-[var(--radius-lg)]"
            >
              <img
                src={c.image_url}
                alt={c.name_ar}
                className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <span className="absolute inset-x-0 bottom-0 bg-[linear-gradient(transparent,rgb(28_22_17/0.7))] px-4 pb-4 pt-16 text-primary-fg">
                {c.name_ar}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="mb-8">
          <p className="wordmark text-[11px] text-muted">Featured</p>
          <h2 className="mt-2 font-display text-4xl">مختارات هذا الأسبوع</h2>
        </div>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {rest.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto my-16 max-w-6xl overflow-hidden rounded-[var(--radius-xl)] bg-fg px-6 py-16 text-primary-fg md:px-16">
        <p className="font-display text-3xl italic leading-snug md:text-5xl">
          “Because it’s the accessories that make or break the look.”
        </p>
        <p className="mt-6 max-w-xl text-sm text-primary-fg/70">{settings.about_ar}</p>
        <Link to="/about" className="mt-8 inline-block text-sm underline underline-offset-4">
          اعرفي أكتر
        </Link>
      </section>
    </PublicShell>
  );
}
