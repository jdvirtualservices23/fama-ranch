export type Category = {
  id: string
  name: string
  order: number
  created_at: string
  /** Si es true, no se muestra como sección propia del menú — solo sirve como pool de opciones (ej. Contornos). */
  is_choice_pool: boolean
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
  /** Cuántos productos de `choice_category_id` debe elegir el cliente (0 = no aplica, ej. combos). */
  choice_count: number
  choice_category_id: string | null
  /** Costo adicional si el cliente elige la versión XL (null = no tiene versión XL). */
  xl_upgrade_price: number | null
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
  selection_note: string | null
}

export type InventoryItem = {
  id: string
  name: string
  unit: string
  created_at: string
}

export type MovementType = 'compra' | 'consumo'

export type InventoryMovement = {
  id: string
  item_id: string
  movement_type: MovementType
  quantity: number
  note: string | null
  created_at: string
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
