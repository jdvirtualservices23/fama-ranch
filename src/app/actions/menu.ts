'use server'

import * as z from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/require-admin'

export type ActionState = { error?: string } | undefined

const categorySchema = z.object({
  name: z.string().trim().min(1, { error: 'El nombre es obligatorio.' }),
  order: z.coerce.number().int().default(0),
})

export async function createCategory(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()
  const parsed = categorySchema.safeParse({
    name: formData.get('name'),
    order: formData.get('order') || 0,
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }

  const supabase = await createClient()
  const { error } = await supabase.from('categories').insert(parsed.data)
  if (error) return { error: error.message }

  revalidatePath('/admin/menu')
}

export async function updateCategory(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()
  const id = formData.get('id')
  if (typeof id !== 'string' || !id) return { error: 'ID inválido.' }

  const parsed = categorySchema.safeParse({
    name: formData.get('name'),
    order: formData.get('order') || 0,
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }

  const supabase = await createClient()
  const { error } = await supabase.from('categories').update(parsed.data).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/menu')
}

export async function deleteCategory(id: string) {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/menu')
}

const productSchema = z.object({
  name: z.string().trim().min(1, { error: 'El nombre es obligatorio.' }),
  description: z.string().trim().optional(),
  price_usd: z.coerce.number().min(0, { error: 'El precio debe ser mayor o igual a 0.' }),
  category_id: z.string().trim().min(1, { error: 'Selecciona una categoría.' }),
  order: z.coerce.number().int().default(0),
})

export async function createProduct(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()
  const parsed = productSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description') || undefined,
    price_usd: formData.get('price_usd'),
    category_id: formData.get('category_id'),
    order: formData.get('order') || 0,
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }

  const supabase = await createClient()
  const { error } = await supabase
    .from('products')
    .insert({ ...parsed.data, is_available: true })
  if (error) return { error: error.message }

  revalidatePath('/admin/menu')
}

export async function updateProduct(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()
  const id = formData.get('id')
  if (typeof id !== 'string' || !id) return { error: 'ID inválido.' }

  const parsed = productSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description') || undefined,
    price_usd: formData.get('price_usd'),
    category_id: formData.get('category_id'),
    order: formData.get('order') || 0,
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }

  const supabase = await createClient()
  const { error } = await supabase.from('products').update(parsed.data).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/menu')
}

export async function toggleProductAvailability(id: string, isAvailable: boolean) {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await supabase
    .from('products')
    .update({ is_available: isAvailable })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/menu')
}

export async function deleteProduct(id: string) {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/menu')
}
