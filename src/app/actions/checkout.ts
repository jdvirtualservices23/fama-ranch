'use server'

import * as z from 'zod'
import { createClient } from '@/lib/supabase/server'
import { getSettings } from '@/lib/supabase/queries'
import { PAYMENT_METHOD_LABELS, usdToBs } from '@/lib/format'

const cartItemSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  priceUsd: z.number().nonnegative(),
  quantity: z.number().int().positive(),
  selectionNote: z.string().trim().optional(),
})

const checkoutSchema = z.object({
  customerName: z.string().trim().min(1, { error: 'Ingresa tu nombre.' }),
  customerPhone: z.string().trim().optional(),
  deliveryMethod: z.enum(['delivery', 'pickup']),
  address: z.string().trim().optional(),
  paymentMethod: z.enum(['pago_movil', 'efectivo', 'zelle']),
  paymentReference: z.string().trim().optional(),
  items: z.array(cartItemSchema).min(1, { error: 'Tu carrito está vacío.' }),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>

export type CreateOrderResult =
  | { success: true; whatsappUrl: string }
  | { success: false; error: string }

export async function createOrder(input: CheckoutInput): Promise<CreateOrderResult> {
  const parsed = checkoutSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' }
  }
  const data = parsed.data

  if (data.deliveryMethod === 'delivery' && !data.address) {
    return { success: false, error: 'La dirección es obligatoria para delivery.' }
  }
  if (data.paymentMethod === 'pago_movil' && !data.paymentReference) {
    return { success: false, error: 'Ingresa el número de referencia del pago móvil.' }
  }

  const settings = await getSettings()
  const totalUsd = Math.round(
    data.items.reduce((sum, i) => sum + i.priceUsd * i.quantity, 0) * 100
  ) / 100
  const totalBs = usdToBs(totalUsd, settings.bcv_rate)

  const supabase = await createClient()
  const { error } = await supabase.rpc('create_order', {
    p_customer_name: data.customerName,
    p_customer_phone: data.customerPhone || null,
    p_delivery_method: data.deliveryMethod,
    p_address: data.deliveryMethod === 'delivery' ? data.address ?? null : null,
    p_payment_method: data.paymentMethod,
    p_payment_reference: data.paymentReference || null,
    p_items: data.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      priceUsd: item.priceUsd,
      quantity: item.quantity,
      selectionNote: item.selectionNote || null,
    })),
  })

  if (error) {
    console.error('createOrder rpc error:', error)
    return { success: false, error: 'No se pudo registrar el pedido. Intenta de nuevo.' }
  }

  const message = buildWhatsappMessage({ ...data, totalUsd, totalBs })
  const whatsappUrl = `https://wa.me/${settings.whatsapp_phone}?text=${encodeURIComponent(message)}`

  return { success: true, whatsappUrl }
}

function buildWhatsappMessage(order: {
  customerName: string
  deliveryMethod: 'delivery' | 'pickup'
  address?: string
  paymentMethod: 'pago_movil' | 'efectivo' | 'zelle'
  paymentReference?: string
  items: { name: string; quantity: number; priceUsd: number; selectionNote?: string }[]
  totalUsd: number
  totalBs: number
}) {
  const lines = [
    '*Nuevo pedido - Fama Ranch*',
    `Cliente: ${order.customerName}`,
    '',
    '*Items:*',
    ...order.items.map(
      (i) =>
        `- ${i.quantity}x ${i.name} ($${(i.priceUsd * i.quantity).toFixed(2)})` +
        (i.selectionNote ? `\n  (${i.selectionNote})` : '')
    ),
    '',
    `Entrega: ${
      order.deliveryMethod === 'delivery' ? `Delivery - ${order.address}` : 'Retiro en local'
    }`,
    `Pago: ${PAYMENT_METHOD_LABELS[order.paymentMethod]}${
      order.paymentReference ? ` (Ref: ${order.paymentReference})` : ''
    }`,
    '',
    `*Total: $${order.totalUsd.toFixed(2)} (${order.totalBs.toFixed(2)} Bs)*`,
  ]
  return lines.join('\n')
}
