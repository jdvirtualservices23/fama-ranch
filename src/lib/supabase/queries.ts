import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { getCaracasDayRange } from '@/lib/format'
import type { Category, Order, OrderItem, Product, Settings } from '@/lib/types'

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('categories').select('*').order('order')
  if (error) throw error
  return data
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('products').select('*').order('order')
  if (error) throw error
  return data
}

export async function getAvailableProductsByCategory() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()])
  return categories.map((category) => ({
    category,
    products: products.filter((p) => p.category_id === category.id && p.is_available),
  }))
}

export async function getSettings(): Promise<Settings> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single()
  if (error) throw error
  return data
}

export async function getTodayOrders(): Promise<Order[]> {
  const supabase = await createClient()
  const { start, end } = getCaracasDayRange()
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .gte('created_at', start)
    .lte('created_at', end)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getOrderItems(orderIds: string[]): Promise<OrderItem[]> {
  if (orderIds.length === 0) return []
  const supabase = await createClient()
  const { data, error } = await supabase.from('order_items').select('*').in('order_id', orderIds)
  if (error) throw error
  return data
}
