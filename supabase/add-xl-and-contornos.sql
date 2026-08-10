-- Fama Ranch — versión XL para empanadas clásicas + contornos de almuerzos
-- Ejecutar en una query nueva del SQL Editor.

-- 1. Precio adicional opcional por versión XL de un producto
alter table products add column if not exists xl_upgrade_price numeric(10, 2);

-- 2. Categorías que solo sirven como "pool" de opciones (no se listan como sección propia del menú)
alter table categories add column if not exists is_choice_pool boolean not null default false;

-- 3. Categoría "Contornos" (pool de elección para los almuerzos)
insert into categories (name, "order", is_choice_pool)
select 'Contornos', 100, true
where not exists (select 1 from categories where name = 'Contornos');

insert into products (name, price_usd, category_id, is_available, "order")
select v.name, 0, c.id, true, v.ord
from categories c,
  (values
    ('Arroz', 1),
    ('Pasta', 2),
    ('Papas Fritas', 3),
    ('Ensalada Mixta', 4),
    ('Ensalada Rallada', 5),
    ('Ensalada Cocida', 6)
  ) as v(name, ord)
where c.name = 'Contornos'
  and not exists (
    select 1 from products p where p.category_id = c.id and p.name = v.name
  );

-- 4. Los almuerzos exigen elegir 2 contornos
update products
set choice_category_id = (select id from categories where name = 'Contornos'),
    choice_count = 2
where category_id = (select id from categories where name = 'Almuerzos');

-- 5. Cualquier empanada clásica puede pedirse en versión XL por +$1.50
update products
set xl_upgrade_price = 1.50
where category_id = (select id from categories where name = 'Empanadas Clásicas');
