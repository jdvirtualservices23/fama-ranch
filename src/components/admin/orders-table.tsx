'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { OrderStatusSelect } from '@/components/admin/order-status-select'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatBs, formatUsd, DELIVERY_METHOD_LABELS, PAYMENT_METHOD_LABELS } from '@/lib/format'
import type { Order, OrderItem } from '@/lib/types'

const STATUS_BADGE_VARIANT: Record<Order['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pendiente: 'outline',
  en_proceso: 'secondary',
  completado: 'default',
  cancelado: 'destructive',
}

export function OrdersTable({
  orders,
  itemsByOrder,
}: {
  orders: Order[]
  itemsByOrder: Record<string, OrderItem[]>
}) {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('admin-orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => router.refresh()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [router])

  if (orders.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-neutral-800 p-8 text-center text-neutral-500">
        Todavía no hay pedidos hoy.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-md border border-neutral-800">
      <Table>
        <TableHeader>
          <TableRow className="border-neutral-800 hover:bg-transparent">
            <TableHead>Cliente</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Entrega</TableHead>
            <TableHead>Pago</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Hora</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="border-neutral-800">
              <TableCell>
                <p className="font-medium">{order.customer_name}</p>
                {order.customer_phone && (
                  <p className="text-xs text-neutral-500">{order.customer_phone}</p>
                )}
              </TableCell>
              <TableCell className="max-w-[220px] text-sm text-neutral-400">
                {(itemsByOrder[order.id] ?? []).map((item) => (
                  <div key={item.id}>
                    {item.quantity}x {item.product_name}
                    {item.selection_note && (
                      <span className="text-neutral-500"> ({item.selection_note})</span>
                    )}
                  </div>
                ))}
              </TableCell>
              <TableCell>
                <p className="text-sm">{DELIVERY_METHOD_LABELS[order.delivery_method]}</p>
                {order.address && (
                  <p className="max-w-[160px] truncate text-xs text-neutral-500">
                    {order.address}
                  </p>
                )}
              </TableCell>
              <TableCell>
                <p className="text-sm">{PAYMENT_METHOD_LABELS[order.payment_method]}</p>
                {order.payment_reference && (
                  <p className="text-xs text-neutral-500">Ref: {order.payment_reference}</p>
                )}
              </TableCell>
              <TableCell>
                <p className="font-medium">{formatUsd(order.total_usd)}</p>
                <p className="text-xs text-neutral-500">{formatBs(order.total_bs)}</p>
              </TableCell>
              <TableCell className="text-sm text-neutral-400">
                {new Date(order.created_at).toLocaleTimeString('es-VE', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </TableCell>
              <TableCell>
                <div className="flex flex-col items-start gap-1.5">
                  <Badge variant={STATUS_BADGE_VARIANT[order.status]}>{order.status}</Badge>
                  <OrderStatusSelect orderId={order.id} status={order.status} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
