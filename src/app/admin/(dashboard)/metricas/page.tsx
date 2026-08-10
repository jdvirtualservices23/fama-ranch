import { getOrderItems, getOrdersInRange } from '@/lib/supabase/queries'
import {
  getCaracasDayRangeFromDateString,
  shiftDateString,
  todayCaracasDateString,
  formatUsd,
} from '@/lib/format'
import { MetricCard } from '@/components/admin/metric-card'
import { ProductSalesChart, type ProductSales } from '@/components/admin/product-sales-chart'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

export default async function AdminMetricasPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>
}) {
  const { from: fromParam, to: toParam } = await searchParams
  const today = todayCaracasDateString()
  const from = fromParam || shiftDateString(today, -29)
  const to = toParam || today

  const start = getCaracasDayRangeFromDateString(from).start
  const end = getCaracasDayRangeFromDateString(to).end

  const orders = await getOrdersInRange(start, end)
  const activeOrders = orders.filter((o) => o.status !== 'cancelado')
  const items = await getOrderItems(activeOrders.map((o) => o.id))

  const salesByProduct = new Map<string, ProductSales>()
  for (const item of items) {
    const existing = salesByProduct.get(item.product_name)
    const revenue = item.quantity * item.unit_price_usd
    if (existing) {
      existing.quantity += item.quantity
      existing.revenue += revenue
    } else {
      salesByProduct.set(item.product_name, {
        name: item.product_name,
        quantity: item.quantity,
        revenue,
      })
    }
  }

  const sales = Array.from(salesByProduct.values()).sort((a, b) => b.quantity - a.quantity)
  const totalUnits = sales.reduce((sum, s) => sum + s.quantity, 0)
  const totalRevenue = sales.reduce((sum, s) => sum + s.revenue, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Métricas</h1>
          <p className="mt-1 text-sm text-neutral-400">Qué se está vendiendo, por producto.</p>
        </div>
        <form action="/admin/metricas" className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <label className="text-xs text-neutral-400">Desde</label>
            <input
              type="date"
              name="from"
              defaultValue={from}
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
              defaultValue={to}
              max={today}
              required
              className="block h-8 rounded-md border border-input bg-transparent px-2 text-sm"
            />
          </div>
          <Button type="submit" variant="outline" size="sm">
            Aplicar
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Pedidos" value={String(activeOrders.length)} hint={`${from} a ${to}`} />
        <MetricCard label="Unidades vendidas" value={String(totalUnits)} />
        <MetricCard label="Ingresos (USD)" value={formatUsd(totalRevenue)} />
      </div>

      <div className="rounded-md border border-neutral-800 p-4">
        <ProductSalesChart data={sales} />
      </div>

      <div className="overflow-x-auto rounded-md border border-neutral-800">
        <Table>
          <TableHeader>
            <TableRow className="border-neutral-800 hover:bg-transparent">
              <TableHead>Producto</TableHead>
              <TableHead>Unidades vendidas</TableHead>
              <TableHead>Ingresos (USD)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((s) => (
              <TableRow key={s.name} className="border-neutral-800">
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.quantity}</TableCell>
                <TableCell>{formatUsd(s.revenue)}</TableCell>
              </TableRow>
            ))}
            {sales.length === 0 && (
              <TableRow className="border-neutral-800">
                <TableCell colSpan={3} className="text-center text-neutral-500">
                  No hay ventas en este rango.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
