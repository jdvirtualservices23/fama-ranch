-- Fama Ranch — módulo de inventario de insumos
-- Ejecutar en una query nueva del SQL Editor.

create table if not exists inventory_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  unit text not null default 'kg',
  created_at timestamptz not null default now()
);

create table if not exists inventory_movements (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references inventory_items(id) on delete cascade,
  movement_type text not null check (movement_type in ('compra', 'consumo')),
  quantity numeric(10, 2) not null check (quantity > 0),
  note text,
  created_at timestamptz not null default now()
);

create index if not exists idx_inventory_movements_item on inventory_movements(item_id);
create index if not exists idx_inventory_movements_created_at on inventory_movements(created_at desc);

alter table inventory_items enable row level security;
alter table inventory_movements enable row level security;

-- Solo el admin autenticado ve y gestiona el inventario (no es información pública)
create policy "inventory_items_admin_all" on inventory_items for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "inventory_movements_admin_all" on inventory_movements for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
