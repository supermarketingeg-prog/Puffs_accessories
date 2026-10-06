-- Run once in Supabase SQL Editor for project qmummabspnyylopokaoh.
-- The app writes through a protected Vercel function using its service-role key.

insert into storage.buckets (id, name, public)
values ('puffs-assets', 'puffs-assets', true)
on conflict (id) do update set public = true;

-- Keep browser users read-only. Upload and deletion use the server-side
-- service-role key after the secure admin session is verified.
drop policy if exists "Public can view Puffs assets" on storage.objects;
create policy "Public can view Puffs assets"
on storage.objects for select to public
using (bucket_id = 'puffs-assets');

-- Make the external catalog tables usable as the shared source of truth.
create table if not exists site_settings (
  key text primary key,
  value text not null default ''
);

alter table products add column if not exists in_stock boolean not null default true;
