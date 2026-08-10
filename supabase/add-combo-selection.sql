-- Fama Ranch — permite que un producto (ej. un combo) exija elegir N
-- productos de otra categoría (ej. "elige 2 empanadas") al agregarlo al carrito.
-- Ejecutar en una query nueva del SQL Editor.

alter table products add column if not exists choice_count integer not null default 0;
alter table products add column if not exists choice_category_id uuid references categories(id) on delete set null;
alter table order_items add column if not exists selection_note text;

-- Reemplaza create_order para que guarde la nota de selección de cada item
create or replace function public.create_order(
  p_customer_name text,
  p_customer_phone text,
  p_delivery_method text,
  p_address text,
  p_payment_method text,
  p_payment_reference text,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_bcv_rate numeric;
  v_total_usd numeric;
  v_total_bs numeric;
  v_order_id uuid;
begin
  select bcv_rate into v_bcv_rate from settings where id = 1;
  if v_bcv_rate is null then
    raise exception 'No se encontró la tasa BCV en settings';
  end if;

  select coalesce(sum((item->>'priceUsd')::numeric * (item->>'quantity')::int), 0)
  into v_total_usd
  from jsonb_array_elements(p_items) as item;

  if v_total_usd <= 0 then
    raise exception 'El carrito está vacío';
  end if;

  v_total_bs := round(v_total_usd * v_bcv_rate, 2);

  insert into orders (
    customer_name, customer_phone, delivery_method, address,
    payment_method, payment_reference, bcv_rate_snapshot,
    total_usd, total_bs, status
  ) values (
    p_customer_name, p_customer_phone, p_delivery_method, p_address,
    p_payment_method, p_payment_reference, v_bcv_rate,
    v_total_usd, v_total_bs, 'pendiente'
  ) returning id into v_order_id;

  insert into order_items (order_id, product_id, product_name, quantity, unit_price_usd, selection_note)
  select
    v_order_id,
    (item->>'productId')::uuid,
    item->>'name',
    (item->>'quantity')::int,
    (item->>'priceUsd')::numeric,
    item->>'selectionNote'
  from jsonb_array_elements(p_items) as item;

  return v_order_id;
end;
$$;

grant execute on function public.create_order(text, text, text, text, text, text, jsonb) to anon, authenticated;
