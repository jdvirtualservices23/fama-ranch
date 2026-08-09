# Fama Ranch — Menú digital y sistema de pedidos

Next.js 16 + TypeScript + Tailwind + shadcn/ui + Supabase.

## Estructura

- `/` — menú público, carrito y checkout hacia WhatsApp.
- `/admin` — panel de administración (login con Supabase Auth): dashboard de pedidos en tiempo real, CRUD de menú, configuración (tasa BCV, Pago Móvil, Zelle).
- `supabase/schema.sql` — esquema completo de la base de datos (tablas, RLS).
- `supabase/fix-order-rpc.sql` — función `create_order` usada por el checkout público (evita el problema de RLS con el rol anónimo).

## Desarrollo local

```bash
npm install
npm run dev
```

Necesitas un `.env.local` con:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Despliegue

Conectado a Vercel — cada push a `main` despliega automáticamente a producción.
