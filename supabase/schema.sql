-- =====================================================
-- Flex Supps — Supabase Schema (safe to re-run)
-- =====================================================

-- Tables
create table if not exists products (
  id text primary key,
  name text not null,
  brand text not null,
  category text not null,
  tags text[] default '{}',
  description text default '',
  flavors jsonb default '[]',
  sizes text[] default '{}',
  price numeric not null default 0,
  old_price numeric,
  currency text default 'DA',
  in_stock boolean default true,
  badge text,
  featured boolean default false,
  show_in_catalog boolean default true,
  show_in_new boolean default false,
  image text default '',
  image_hover text default '',
  href text default '#',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add placement columns if table already exists (safe migration)
alter table products add column if not exists show_in_catalog boolean default true;
alter table products add column if not exists show_in_new boolean default false;

create table if not exists categories (
  id text primary key,
  name text not null,
  slug text,
  description text,
  image text,
  href text default '#'
);

create table if not exists brands (
  id serial primary key,
  name text not null unique,
  logo text,
  href text default '#'
);

-- Enable RLS
alter table products enable row level security;
alter table categories enable row level security;
alter table brands enable row level security;

-- Drop existing policies first (safe to re-run)
drop policy if exists "Public can read products" on products;
drop policy if exists "Public can read categories" on categories;
drop policy if exists "Public can read brands" on brands;
drop policy if exists "Authenticated can manage products" on products;
drop policy if exists "Authenticated can manage categories" on categories;
drop policy if exists "Authenticated can manage brands" on brands;
drop policy if exists "Anon can manage products" on products;
drop policy if exists "Anon can manage categories" on categories;
drop policy if exists "Anon can manage brands" on brands;

-- Recreate policies
create policy "Public can read products" on products for select using (true);
create policy "Public can read categories" on categories for select using (true);
create policy "Public can read brands" on brands for select using (true);

create policy "Anon can manage products" on products for all to anon using (true) with check (true);
create policy "Anon can manage categories" on categories for all to anon using (true) with check (true);
create policy "Anon can manage brands" on brands for all to anon using (true) with check (true);

-- Storage bucket for product images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view product images" on storage.objects;
drop policy if exists "Anon can upload product images" on storage.objects;
drop policy if exists "Anon can delete product images" on storage.objects;

create policy "Public can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Anon can upload product images"
  on storage.objects for insert to anon
  with check (bucket_id = 'product-images');

create policy "Anon can delete product images"
  on storage.objects for delete to anon
  using (bucket_id = 'product-images');
