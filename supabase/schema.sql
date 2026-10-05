-- Run this in the Puffs Supabase SQL editor:
-- https://nttdxpsqpyokzqyihmcr.supabase.co
-- Then paste the anon key in the website admin → إعدادات → مفتاح Supabase
-- so products and banners stay in sync.

create table if not exists categories (
  id bigint primary key,
  slug text not null unique,
  name_ar text not null,
  name_en text not null,
  image_url text not null default '',
  sort_order integer not null default 0,
  active boolean not null default true
);

create table if not exists products (
  id bigint primary key,
  slug text not null unique,
  name_ar text not null,
  name_en text not null default '',
  description_ar text not null default '',
  description_en text not null default '',
  category_id bigint,
  price integer not null default 0,
  compare_at integer,
  image_url text not null default '',
  featured boolean not null default false,
  in_stock boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists banners (
  id bigint primary key,
  title text not null default '',
  subtitle text not null default '',
  image_url text not null,
  link_url text not null default '/shop',
  sort_order integer not null default 0,
  active boolean not null default true
);

alter table categories enable row level security;
alter table products enable row level security;
alter table banners enable row level security;

drop policy if exists "public read categories" on categories;
drop policy if exists "public read products" on products;
drop policy if exists "public read banners" on banners;
drop policy if exists "write categories" on categories;
drop policy if exists "write products" on products;
drop policy if exists "write banners" on banners;

create policy "public read categories" on categories for select using (true);
create policy "public read products" on products for select using (true);
create policy "public read banners" on banners for select using (true);
create policy "write categories" on categories for all using (true) with check (true);
create policy "write products" on products for all using (true) with check (true);
create policy "write banners" on banners for all using (true) with check (true);
