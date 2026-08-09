export type Category = {
  id: string
  name: string
  order: number
  created_at: string
}

export type Product = {
  id: string
  name: string
  description: string | null
  price_usd: number
  category_id: string
  is_available: boolean
  image_url: string | null
  order: number
  created_at: string
}

export type OrderStatus = 'pendiente' | 'en_proceso' | 'completado' | 'cancelado'
export type DeliveryMethod = 'delivery' | 'pickup'
export type PaymentMethod = 'pago_movil' | 'efectivo' | 'zelle'

export type Order = {
  id: string
  customer_name: string
  customer_phone: string | null
  delivery_method: DeliveryMethod
  address: string | null
  payment_method: PaymentMethod
  payment_reference: string | null
  bcv_rate_snapshot: number
  total_usd: number
  total_bs: number
  status: OrderStatus
  created_at: string
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  quantity: number
  unit_price_usd: number
}

export type Settings = {
  id: number
  bcv_rate: number
  whatsapp_phone: string
  pago_movil_bank: string | null
  pago_movil_id: string | null
  pago_movil_phone: string | null
  zelle_email: string | null
  zelle_name: string | null
  updated_at: string
}
