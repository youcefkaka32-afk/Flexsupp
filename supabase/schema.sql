-- =====================================================
-- Flex Supps — Supabase Schema
-- Run this ONCE in the Supabase SQL Editor
-- =====================================================

-- Products table
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
  image text default '',
  image_hover text default '',
  href text default '#',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Categories table
create table if not exists categories (
  id text primary key,
  name text not null,
  slug text,
  description text,
  image text,
  href text default '#'
);

-- Brands table
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

-- Public read access
create policy "Public can read products" on products for select using (true);
create policy "Public can read categories" on categories for select using (true);
create policy "Public can read brands" on brands for select using (true);

-- Anon write access (PIN-protected admin dashboard)
create policy "Anon can manage products" on products for all to anon using (true) with check (true);
create policy "Anon can manage categories" on categories for all to anon using (true) with check (true);
create policy "Anon can manage brands" on brands for all to anon using (true) with check (true);

-- =====================================================
-- Storage bucket for product images
-- Run this separately in the SQL Editor
-- =====================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Allow public to read images
create policy "Public can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Allow anon to upload images (admin dashboard)
create policy "Anon can upload product images"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'product-images');

-- Allow anon to delete images (admin dashboard)
create policy "Anon can delete product images"
  on storage.objects for delete
  to anon
  using (bucket_id = 'product-images');
