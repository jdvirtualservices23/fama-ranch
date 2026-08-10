'use server'

import * as z from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/require-admin'
import type { ActionState } from '@/app/actions/menu'

const itemSchema = z.object({
  name: z.string().trim().min(1, { error: 'El nombre es obligatorio.' }),
  unit: z.string().trim().min(1, { error: 'La unidad es obligatoria.' }),
})

export async function createInventoryItem(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()
  const parsed = itemSchema.safeParse({
    name: formData.get('name'),
    unit: formData.get('unit'),
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }

  const supabase = await createClient()
  const { error } = await supabase.from('inventory_items').insert(parsed.data)
  if (error) return { error: error.message }

  revalidatePath('/admin/inventario')
}

export async function deleteInventoryItem(id: string) {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await supabase.from('inventory_items').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/inventario')
}

const movementSchema = z.object({
  item_id: z.string().trim().min(1, { error: 'Selecciona un insumo.' }),
  movement_type: z.enum(['compra', 'consumo'], { error: 'Tipo inválido.' }),
  quantity: z.coerce.number().positive({ error: 'La cantidad debe ser mayor a 0.' }),
  note: z.string().trim().optional(),
})

export async function addInventoryMovement(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()
  const parsed = movementSchema.safeParse({
    item_id: formData.get('item_id'),
    movement_type: formData.get('movement_type'),
    quantity: formData.get('quantity'),
    note: formData.get('note') || undefined,
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }

  const supabase = await createClient()
  const { error } = await supabase.from('inventory_movements').insert({
    ...parsed.data,
    note: parsed.data.note || null,
  })
  if (error) return { error: error.message }

  revalidatePath('/admin/inventario')
}

export async function deleteInventoryMovement(id: string) {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await supabase.from('inventory_movements').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/inventario')
}
