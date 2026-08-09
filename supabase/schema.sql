-- Fama Ranch — esquema inicial de base de datos
-- Ejecutar en el SQL Editor de Supabase (proyecto: gnoyltrebuuuxboeprcd)

-- Extensión para UUIDs
create extension if not exists "pgcrypto";

-- 1. Categorías del menú
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  "order" integer not null default 0,
  created_at timestamptz not null default now()
);

-- 2. Productos
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price_usd numeric(10, 2) not null check (price_usd >= 0),
  category_id uuid not null references categories(id) on delete cascade,
  is_available boolean not null default true,
  image_url text,
  "order" integer not null default 0,
  created_at timestamptz not null default now()
);

-- 3. Pedidos
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text,
  delivery_method text not null check (delivery_method in ('delivery', 'pickup')),
  address text,
  payment_method text not null check (payment_method in ('pago_movil', 'efectivo', 'zelle')),
  payment_reference text,
  bcv_rate_snapshot numeric(10, 4) not null,
  total_usd numeric(10, 2) not null check (total_usd >= 0),
  total_bs numeric(12, 2) not null check (total_bs >= 0),
  status text not null default 'pendiente' check (status in ('pendiente', 'en_proceso', 'completado', 'cancelado')),
  created_at timestamptz not null default now()
);

-- 4. Items de cada pedido
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price_usd numeric(10, 2) not null check (unit_price_usd >= 0)
);

-- 5. Configuración global (tasa BCV, datos de pago móvil, teléfono WhatsApp, etc.)
create table if not exists settings (
  id integer primary key default 1,
  bcv_rate numeric(10, 4) not null,
  whatsapp_phone text not null default '',
  pago_movil_bank text,
  pago_movil_id text,
  pago_movil_phone text,
  zelle_email text,
  zelle_name text,
  updated_at timestamptz not null default now(),
  constraint settings_singleton check (id = 1)
);

insert into settings (id, bcv_rate, whatsapp_phone)
values (1, 40.00, '584120000000')
on conflict (id) do nothing;

-- Índices útiles
create index if not exists idx_products_category on products(category_id);
create index if not exists idx_order_items_order on order_items(order_id);
create index if not exists idx_orders_created_at on orders(created_at desc);

-- Row Level Security
alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table settings enable row level security;

-- Lectura pública (menú y tasa visibles para cualquiera)
create policy "categories_public_read" on categories for select using (true);
create policy "products_public_read" on products for select using (true);
create policy "settings_public_read" on settings for select using (true);

-- Los clientes pueden crear pedidos y sus items (checkout público), pero no leerlos ni modificarlos
create policy "orders_public_insert" on orders for insert with check (true);
create policy "order_items_public_insert" on order_items for insert with check (true);

-- Solo usuarios autenticados (admin) pueden gestionar todo
create policy "categories_admin_all" on categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "products_admin_all" on products for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "orders_admin_read" on orders for select using (auth.role() = 'authenticated');
create policy "orders_admin_update" on orders for update using (auth.role() = 'authenticated');
create policy "orders_admin_delete" on orders for delete using (auth.role() = 'authenticated');
create policy "order_items_admin_read" on order_items for select using (auth.role() = 'authenticated');
create policy "settings_admin_write" on settings for update using (auth.role() = 'authenticated');
