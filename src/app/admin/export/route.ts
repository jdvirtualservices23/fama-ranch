import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/require-admin'
import { getOrderItems, getOrdersInRange } from '@/lib/supabase/queries'
import { getCaracasDayRangeFromDateString, todayCaracasDateString } from '@/lib/format'
import { DELIVERY_METHOD_LABELS, ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS } from '@/lib/format'
import type { OrderItem } from '@/lib/types'

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export async function GET(request: NextRequest) {
  await requireAdmin()

  const { searchParams } = request.nextUrl
  const from = searchParams.get('from') || todayCaracasDateString()
  const to = searchParams.get('to') || todayCaracasDateString()

  const start = getCaracasDayRangeFromDateString(from).start
  const end = getCaracasDayRangeFromDateString(to).end

  const orders = await getOrdersInRange(start, end)
  const items = await getOrderItems(orders.map((o) => o.id))
  const itemsByOrder = items.reduce<Record<string, OrderItem[]>>((acc, item) => {
    ;(acc[item.order_id] ??= []).push(item)
    return acc
  }, {})

  const header = [
    'Fecha',
    'Hora',
    'Cliente',
    'Teléfono',
    'Items',
    'Entrega',
    'Dirección',
    'Pago',
    'Referencia',
    'Total USD',
    'Total Bs',
    'Estado',
  ]

  const rows = orders.map((order) => {
    const created = new Date(order.created_at)
    const itemsSummary = (itemsByOrder[order.id] ?? [])
      .map((i) => `${i.quantity}x ${i.product_name}${i.selection_note ? ` (${i.selection_note})` : ''}`)
      .join('; ')

    return [
      created.toLocaleDateString('es-VE', { timeZone: 'America/Caracas' }),
      created.toLocaleTimeString('es-VE', { timeZone: 'America/Caracas' }),
      order.customer_name,
      order.customer_phone ?? '',
      itemsSummary,
      DELIVERY_METHOD_LABELS[order.delivery_method] ?? order.delivery_method,
      order.address ?? '',
      PAYMENT_METHOD_LABELS[order.payment_method] ?? order.payment_method,
      order.payment_reference ?? '',
      order.total_usd.toFixed(2),
      order.total_bs.toFixed(2),
      ORDER_STATUS_LABELS[order.status] ?? order.status,
    ]
  })

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => csvEscape(String(cell))).join(','))
    .join('\n')

  const BOM = '﻿'
  const csvWithBom = BOM + csv

  return new NextResponse(csvWithBom, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="pedidos_${from}_a_${to}.csv"`,
    },
  })
}
