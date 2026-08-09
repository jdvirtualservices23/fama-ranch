-- Fama Ranch — corrige el permiso de inserción pública de pedidos
-- Ejecutar en una query nueva del SQL Editor de Supabase

drop policy if exists "orders_public_insert" on orders;
create policy "orders_public_insert" on orders
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "order_items_public_insert" on order_items;
create policy "order_items_public_insert" on order_items
  for insert
  to anon, authenticated
  with check (true);
