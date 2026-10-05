import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { getStorefront } from "@/lib/api";

export const Route = createFileRoute("/about")({
  loader: () => getStorefront(),
  component: About,
});

function About() {
  const { settings } = Route.useLoaderData();
  return (
    <PublicShell settings={settings}>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <p className="wordmark text-[11px] text-muted">Our story</p>
        <h1 className="mt-2 font-display text-5xl md:text-7xl">عن بَفس</h1>
        <div className="mt-10 grid gap-10 md:grid-cols-2 md:items-center">
          <img
            src="/images/emblem.jpg"
            alt=""
            className="aspect-square w-full rounded-[var(--radius-xl)] object-cover"
          />
          <div className="space-y-5 text-muted leading-relaxed">
            <p className="text-lg text-fg">{settings.about_ar}</p>
            <p>{settings.about_en}</p>
            <p>
              بنشتغل من {settings.address}. مواعيدنا {settings.hours}.
            </p>
            <p className="font-display text-2xl italic text-fg">{settings.tagline}</p>
            <Link to="/shop">
              <Button>تسوّقي المجموعة</Button>
            </Link>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
