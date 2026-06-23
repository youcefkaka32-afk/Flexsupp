-- =====================================================
-- Flex Supps — Orders Table Migration
-- Run this once in your Supabase SQL editor
-- =====================================================

-- Create orders table
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  wilaya text not null,
  commune text not null,
  items jsonb not null default '[]',
  -- items structure: [{id, name, brand, price, quantity, currency}]
  total_price numeric not null default 0,
  currency text default 'DA',
  status text default 'pending',
  -- status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
  notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table orders enable row level security;

-- Drop existing policies if re-running
drop policy if exists "Public can insert orders" on orders;
drop policy if exists "Authenticated can read orders" on orders;
drop policy if exists "Authenticated can update orders" on orders;

-- Anyone (including anonymous checkout users) can create an order
create policy "Public can insert orders"
  on orders for insert
  with check (true);

-- Only authenticated admins can read orders
create policy "Authenticated can read orders"
  on orders for select
  to authenticated
  using (true);

-- Only authenticated admins can update order status
create policy "Authenticated can update orders"
  on orders for update
  to authenticated
  using (true)
  with check (true);

-- Helper: auto-update updated_at on status change
create or replace function update_orders_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists orders_updated_at on orders;
create trigger orders_updated_at
  before update on orders
  for each row
  execute function update_orders_updated_at();
