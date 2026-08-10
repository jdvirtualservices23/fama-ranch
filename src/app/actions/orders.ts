'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/require-admin'
import type { OrderStatus } from '@/lib/types'

const VALID_STATUSES: OrderStatus[] = ['pendiente', 'en_proceso', 'completado', 'cancelado']

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await requireAdmin()
  if (!VALID_STATUSES.includes(status)) throw new Error('Estado inválido.')

  const supabase = await createClient()
  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
  if (error) throw new Error(error.message)

  revalidatePath('/admin')
}

export async function deleteOrder(orderId: string) {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await supabase.from('orders').delete().eq('id', orderId)
  if (error) throw new Error(error.message)

  revalidatePath('/admin')
}
