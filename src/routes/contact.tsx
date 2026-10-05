import { createFileRoute } from "@tanstack/react-router";
import { Clock3, MapPin, Phone } from "lucide-react";
import { PublicShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { getStorefront } from "@/lib/api";
import { waLink } from "@/lib/utils";

export const Route = createFileRoute("/contact")({
  loader: () => getStorefront(),
  component: Contact,
});

function Contact() {
  const { settings } = Route.useLoaderData();
  return (
    <PublicShell settings={settings}>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <p className="wordmark text-[11px] text-muted">Visit</p>
        <h1 className="mt-2 font-display text-5xl">تواصلي معانا</h1>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <InfoCard icon={Phone} title="موبايل / واتساب" body={settings.phone} href={`tel:${settings.phone}`} />
          <InfoCard icon={MapPin} title="العنوان" body={settings.address} />
          <InfoCard icon={Clock3} title="المواعيد" body={settings.hours} />
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href={waLink(settings.whatsapp, "مرحباً Puffs، عايزة أطلب")} target="_blank" rel="noreferrer">
            <Button size="lg">واتساب</Button>
          </a>
          <a href={settings.instagram} target="_blank" rel="noreferrer">
            <Button size="lg" variant="outline">
              إنستجرام
            </Button>
          </a>
          <a href={settings.facebook} target="_blank" rel="noreferrer">
            <Button size="lg" variant="outline">
              فيسبوك
            </Button>
          </a>
        </div>
        <img
          src="/images/hero.jpg"
          alt=""
          className="mt-12 h-72 w-full rounded-[var(--radius-xl)] object-cover md:h-[420px]"
        />
      </div>
    </PublicShell>
  );
}

function InfoCard({
  icon: Icon,
  title,
  body,
  href,
}: {
  icon: typeof Phone;
  title: string;
  body: string;
  href?: string;
}) {
  const inner = (
    <>
      <Icon className="size-5 text-primary" />
      <p className="mt-4 text-sm text-muted">{title}</p>
      <p className="mt-1 text-lg">{body}</p>
    </>
  );
  const cls = "rounded-[var(--radius-lg)] bg-bg-elevated p-6 ring-1 ring-border";
  return href ? (
    <a className={cls} href={href}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}
