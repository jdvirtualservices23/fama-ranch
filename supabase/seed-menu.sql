-- Fama Ranch — carga inicial del menú
-- Ejecutar en el SQL Editor de Supabase (una vez, en una query nueva)
--
-- Notas:
-- - Los platos de "Almuerzos" y "Bebidas" quedan SIN precio (0.00) y PAUSADOS
--   (is_available = false), tal como pediste, para discutir el precio con el
--   cliente y activarlos luego desde /admin/menu.
-- - "Empanada de Chuleta Ahumada" se agregó también como versión XL a $3.50
--   (2.00 + 1.50 del upsell que mencionaste). Si no la quieres, bórrala desde
--   el panel de admin.

-- 1. Categorías
insert into categories (name, "order") values
  ('Combos de Empanadas', 1),
  ('Empanadas Clásicas', 2),
  ('Especialidades XL', 3),
  ('Almuerzos', 4),
  ('Bebidas', 5),
  ('Pollo a la Broster', 6);

-- 2. Combos de Empanadas
insert into products (name, description, price_usd, category_id, is_available, "order") values
  ('Combo 1', '2 Empanadas Clásicas + 1 Malta', 4.50, (select id from categories where name = 'Combos de Empanadas'), true, 1),
  ('Combo 2', '2 Empanadas Clásicas + 1 Refresco', 5.00, (select id from categories where name = 'Combos de Empanadas'), true, 2);

-- 3. Empanadas Clásicas
insert into products (name, description, price_usd, category_id, is_available, "order") values
  ('Empanada de Queso', null, 2.00, (select id from categories where name = 'Empanadas Clásicas'), true, 1),
  ('Empanada de Pollo', null, 2.00, (select id from categories where name = 'Empanadas Clásicas'), true, 2),
  ('Empanada de Carne Molida', null, 2.00, (select id from categories where name = 'Empanadas Clásicas'), true, 3),
  ('Empanada de Carne Mechada', null, 2.00, (select id from categories where name = 'Empanadas Clásicas'), true, 4),
  ('Empanada de Salchicha', null, 2.00, (select id from categories where name = 'Empanadas Clásicas'), true, 5),
  ('Empanada de Jamón y Queso', null, 2.00, (select id from categories where name = 'Empanadas Clásicas'), true, 6),
  ('Empanada de Jamón y Queso Amarillo', null, 2.00, (select id from categories where name = 'Empanadas Clásicas'), true, 7),
  ('Empanada Dominó', null, 2.00, (select id from categories where name = 'Empanadas Clásicas'), true, 8),
  ('Empanada de Plátano con Queso', null, 2.00, (select id from categories where name = 'Empanadas Clásicas'), true, 9),
  ('Empanada de Chuleta Ahumada', null, 2.00, (select id from categories where name = 'Empanadas Clásicas'), true, 10),
  ('Empanada de Chuleta Ahumada XL', 'Versión XL de la empanada de chuleta ahumada', 3.50, (select id from categories where name = 'Empanadas Clásicas'), true, 11),
  ('Empanada Pelúa', 'Carne mechada y queso amarillo', 2.00, (select id from categories where name = 'Empanadas Clásicas'), true, 12),
  ('Empanada Catira', 'Pollo y queso amarillo', 2.00, (select id from categories where name = 'Empanadas Clásicas'), true, 13),
  ('Empanada Sifrina', 'Pollo, queso amarillo y tocineta', 2.00, (select id from categories where name = 'Empanadas Clásicas'), true, 14),
  ('Empanada Americana', 'Huevo, jamón, queso amarillo y tocineta', 2.00, (select id from categories where name = 'Empanadas Clásicas'), true, 15),
  ('Empanada Odiosa', 'Pollo, jamón y queso amarillo', 2.00, (select id from categories where name = 'Empanadas Clásicas'), true, 16),
  ('Empanada Pabellón', 'Mechada, caraota, queso y plátano', 2.00, (select id from categories where name = 'Empanadas Clásicas'), true, 17),
  ('Empanada Salchiqueso', 'Salchicha con queso amarillo', 2.00, (select id from categories where name = 'Empanadas Clásicas'), true, 18),
  ('Empanada Chorisifri', 'Chorizo, maíz, queso amarillo y tocineta', 2.00, (select id from categories where name = 'Empanadas Clásicas'), true, 19),
  ('Empanada Brasilera', 'Pernil y queso amarillo', 2.00, (select id from categories where name = 'Empanadas Clásicas'), true, 20);

-- 4. Especialidades XL
insert into products (name, description, price_usd, category_id, is_available, "order") values
  ('Super XL', 'Pollo, mechada, jamón, chorizo, tocineta, maíz y queso amarillo', 3.50, (select id from categories where name = 'Especialidades XL'), true, 1),
  ('Sambumbia XL', 'Mechada, pollo, caraota, huevo, queso y plátano', 3.50, (select id from categories where name = 'Especialidades XL'), true, 2),
  ('Parrilla XL', 'Carne, chorizo, pollo y tocineta', 3.50, (select id from categories where name = 'Especialidades XL'), true, 3);

-- 5. Almuerzos (sin precio todavía, pausados)
insert into products (name, description, price_usd, category_id, is_available, "order") values
  ('Chuleta Ahumada', 'Incluye la proteína + 2 contornos a elegir: Arroz, Pasta, Papas Fritas, Ensalada Mixta, Ensalada Rallada o Ensalada Cocida', 0, (select id from categories where name = 'Almuerzos'), false, 1),
  ('Mondongo', 'Plato tradicional + 2 contornos a elegir', 0, (select id from categories where name = 'Almuerzos'), false, 2),
  ('Milanesa Empanizada', 'Incluye la proteína + 2 contornos a elegir', 0, (select id from categories where name = 'Almuerzos'), false, 3),
  ('Milanesa a la Plancha', 'Incluye la proteína + 2 contornos a elegir', 0, (select id from categories where name = 'Almuerzos'), false, 4),
  ('Callos', 'Plato tradicional + 2 contornos a elegir', 0, (select id from categories where name = 'Almuerzos'), false, 5),
  ('Albóndigas', 'En salsa casera + 2 contornos a elegir', 0, (select id from categories where name = 'Almuerzos'), false, 6);

-- 6. Bebidas (sin precio todavía, pausada)
insert into products (name, description, price_usd, category_id, is_available, "order") values
  ('Jugos Naturales', 'Refrescante acompañante para tu almuerzo', 0, (select id from categories where name = 'Bebidas'), false, 1);

-- 7. Pollo a la Broster
insert into products (name, description, price_usd, category_id, is_available, "order") values
  ('Combo Individual', '2 Piezas de pollo + Papas fritas + Ensalada rallada', 5.00, (select id from categories where name = 'Pollo a la Broster'), true, 1),
  ('Combo Dúo', '5 Piezas de pollo + Papas fritas + Ensalada rallada', 8.00, (select id from categories where name = 'Pollo a la Broster'), true, 2),
  ('Combo Familiar', '8 Piezas de pollo + Papas fritas + Ensalada rallada', 12.00, (select id from categories where name = 'Pollo a la Broster'), true, 3);
