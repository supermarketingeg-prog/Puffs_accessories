import { Link, useRouterState } from "@tanstack/react-router";
import { Instagram, Menu, ShoppingBag, X } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Logo } from "@/components/logo";
import { cartCount, useCart } from "@/lib/cart";
import type { SettingsMap } from "@/lib/types";
import { cn, waLink } from "@/lib/utils";

const NAV = [
  { to: "/", label: "الرئيسية" },
  { to: "/shop", label: "المتجر" },
  { to: "/about", label: "عن بَفس" },
  { to: "/contact", label: "تواصل" },
] as const;

export function SiteHeader({ settings }: { settings: SettingsMap }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const count = useCart((s) => cartCount(s.items));
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur-md">
      {settings.announcement ? (
        <p className="bg-fg px-4 py-2 text-center text-xs tracking-wide text-primary-fg">
          {settings.announcement}
        </p>
      ) : null}
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link to="/" aria-label="Puffs Accessories">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-7 text-sm md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn("text-muted transition-opacity hover:text-fg", pathname === item.to && "text-fg")}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <Link
            to="/cart"
            className="relative inline-flex size-11 items-center justify-center rounded-full hover:bg-surface"
            aria-label="السلة"
          >
            <ShoppingBag className="size-5" />
            {count > 0 ? (
              <span className="absolute top-1.5 right-1.5 grid size-4 place-items-center rounded-full bg-primary text-[10px] text-primary-fg">
                {count}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full hover:bg-surface md:hidden"
            onClick={() => setOpen(true)}
            aria-label="القائمة"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>
      {open ? (
        <div className="fixed inset-0 z-50 bg-fg/40 md:hidden" onClick={() => setOpen(false)}>
          <div
            className="absolute top-0 right-0 flex h-full w-[80%] max-w-xs flex-col gap-2 bg-bg p-5 shadow-[var(--shadow-soft)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <Logo />
              <button type="button" className="size-11" onClick={() => setOpen(false)} aria-label="إغلاق">
                <X className="size-5" />
              </button>
            </div>
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-[var(--radius-md)] px-3 py-3 text-base hover:bg-surface"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

export function SiteFooter({ settings }: { settings: SettingsMap }) {
  return (
    <footer className="mt-20 border-t border-border bg-bg-elevated">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted">{settings.tagline_ar}</p>
          <p className="font-display text-sm italic text-muted">{settings.tagline}</p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-medium">تواصلي</p>
          <a className="block text-muted hover:text-fg" href={`tel:${settings.phone}`}>
            {settings.phone}
          </a>
          <p className="text-muted">{settings.address}</p>
          <p className="text-muted">{settings.hours}</p>
        </div>
        <div className="space-y-3 text-sm">
          <p className="font-medium">السوشيال</p>
          <a className="flex items-center gap-2 text-muted hover:text-fg" href={settings.instagram} target="_blank" rel="noreferrer">
            <Instagram className="size-4" />
            Instagram
          </a>
          <a className="block text-muted hover:text-fg" href={settings.facebook} target="_blank" rel="noreferrer">
            Facebook
          </a>
        </div>
      </div>
      <p className="border-t border-border px-4 py-4 text-center text-xs text-subtle">
        © {new Date().getFullYear()} Puffs Accessories
      </p>
    </footer>
  );
}

export function WhatsappFloat({ settings }: { settings: SettingsMap }) {
  return (
    <a
      href={waLink(settings.whatsapp, "مرحباً، عايزة أسأل عن الإكسسوارات")}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-24 right-4 z-40 inline-flex h-12 items-center rounded-full bg-fg px-4 text-sm text-primary-fg shadow-[var(--shadow-soft)]"
      aria-label="واتساب"
    >
      واتساب
    </a>
  );
}

export function PublicShell({
  settings,
  children,
  showWhatsapp = true,
}: {
  settings: SettingsMap;
  children: ReactNode;
  showWhatsapp?: boolean;
}) {
  return (
    <div className="min-h-svh bg-bg text-fg">
      <SiteHeader settings={settings} />
      <main>{children}</main>
      <SiteFooter settings={settings} />
      {showWhatsapp ? <WhatsappFloat settings={settings} /> : null}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-svh bg-bg">
      <div className="h-16 border-b border-border" />
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
        <div className="h-[52vh] animate-pulse rounded-[var(--radius-xl)] bg-surface" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-[var(--radius-lg)] bg-surface" />
          ))}
        </div>
      </div>
    </div>
  );
}
