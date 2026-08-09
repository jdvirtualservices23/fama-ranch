import { getOrderItems, getTodayOrders } from '@/lib/supabase/queries'
import { MetricCard } from '@/components/admin/metric-card'
import { OrdersTable } from '@/components/admin/orders-table'
import { formatBs, formatUsd } from '@/lib/format'
import type { OrderItem } from '@/lib/types'

export default async function AdminDashboardPage() {
  const orders = await getTodayOrders()
  const items = await getOrderItems(orders.map((o) => o.id))

  const itemsByOrder = items.reduce<Record<string, OrderItem[]>>((acc, item) => {
    ;(acc[item.order_id] ??= []).push(item)
    return acc
  }, {})

  const activeOrders = orders.filter((o) => o.status !== 'cancelado')
  const totalUsd = activeOrders.reduce((sum, o) => sum + o.total_usd, 0)
  const totalBs = activeOrders.reduce((sum, o) => sum + o.total_bs, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-400">Pedidos y métricas de hoy.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Pedidos hoy" value={String(orders.length)} />
        <MetricCard label="Ingresos hoy (USD)" value={formatUsd(totalUsd)} hint="Excluye cancelados" />
        <MetricCard label="Ingresos hoy (Bs)" value={formatBs(totalBs)} hint="Excluye cancelados" />
      </div>

      <OrdersTable orders={orders} itemsByOrder={itemsByOrder} />
    </div>
  )
}
