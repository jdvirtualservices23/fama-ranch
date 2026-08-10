import Link from 'next/link'
import { getOrderItems, getOrdersForDate } from '@/lib/supabase/queries'
import { MetricCard } from '@/components/admin/metric-card'
import { OrdersTable } from '@/components/admin/orders-table'
import { formatBs, formatUsd, shiftDateString, todayCaracasDateString } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { DateJumpInput } from '@/components/admin/date-jump-input'
import { ChevronLeft, ChevronRight, Download } from 'lucide-react'
import type { OrderItem } from '@/lib/types'

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const { date: dateParam } = await searchParams
  const today = todayCaracasDateString()
  const date = dateParam || today
  const isToday = date === today

  const orders = await getOrdersForDate(date)
  const items = await getOrderItems(orders.map((o) => o.id))

  const itemsByOrder = items.reduce<Record<string, OrderItem[]>>((acc, item) => {
    ;(acc[item.order_id] ??= []).push(item)
    return acc
  }, {})

  const activeOrders = orders.filter((o) => o.status !== 'cancelado')
  const totalUsd = activeOrders.reduce((sum, o) => sum + o.total_usd, 0)
  const totalBs = activeOrders.reduce((sum, o) => sum + o.total_bs, 0)

  const defaultFrom = shiftDateString(today, -6)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-400">
            {isToday ? 'Pedidos y métricas de hoy.' : `Pedidos del ${date}.`}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Button asChild size="icon" variant="outline">
            <Link href={`/admin?date=${shiftDateString(date, -1)}`} aria-label="Día anterior">
              <ChevronLeft className="size-4" />
            </Link>
          </Button>
          <DateJumpInput date={date} max={today} />
          {isToday ? (
            <Button size="icon" variant="outline" disabled aria-label="Día siguiente">
              <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button asChild size="icon" variant="outline">
              <Link href={`/admin?date=${shiftDateString(date, 1)}`} aria-label="Día siguiente">
                <ChevronRight className="size-4" />
              </Link>
            </Button>
          )}
          {!isToday && (
            <Button asChild size="sm" variant="outline">
              <Link href="/admin">Hoy</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Pedidos" value={String(orders.length)} />
        <MetricCard label="Ingresos (USD)" value={formatUsd(totalUsd)} hint="Excluye cancelados" />
        <MetricCard label="Ingresos (Bs)" value={formatBs(totalBs)} hint="Excluye cancelados" />
      </div>

      <OrdersTable
        orders={orders}
        itemsByOrder={itemsByOrder}
        emptyMessage={isToday ? 'Todavía no hay pedidos hoy.' : 'No hubo pedidos ese día.'}
      />

      <form
        action="/admin/export"
        className="flex flex-wrap items-end gap-3 rounded-md border border-neutral-800 p-4"
      >
        <div className="space-y-1">
          <label className="text-xs text-neutral-400">Desde</label>
          <input
            type="date"
            name="from"
            defaultValue={defaultFrom}
            max={today}
            required
            className="block h-8 rounded-md border border-input bg-transparent px-2 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-neutral-400">Hasta</label>
          <input
            type="date"
            name="to"
            defaultValue={today}
            max={today}
            required
            className="block h-8 rounded-md border border-input bg-transparent px-2 text-sm"
          />
        </div>
        <Button type="submit" variant="outline" size="sm">
          <Download className="size-4" /> Descargar CSV
        </Button>
      </form>
    </div>
  )
}
