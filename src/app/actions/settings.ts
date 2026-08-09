'use server'

import * as z from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/require-admin'
import type { ActionState } from '@/app/actions/menu'

const settingsSchema = z.object({
  bcv_rate: z.coerce.number().positive({ error: 'La tasa debe ser mayor a 0.' }),
  whatsapp_phone: z.string().trim().min(1, { error: 'El teléfono es obligatorio.' }),
  pago_movil_bank: z.string().trim().optional(),
  pago_movil_id: z.string().trim().optional(),
  pago_movil_phone: z.string().trim().optional(),
  zelle_email: z.string().trim().optional(),
  zelle_name: z.string().trim().optional(),
})

export async function updateSettings(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()

  const parsed = settingsSchema.safeParse({
    bcv_rate: formData.get('bcv_rate'),
    whatsapp_phone: formData.get('whatsapp_phone'),
    pago_movil_bank: formData.get('pago_movil_bank') || undefined,
    pago_movil_id: formData.get('pago_movil_id') || undefined,
    pago_movil_phone: formData.get('pago_movil_phone') || undefined,
    zelle_email: formData.get('zelle_email') || undefined,
    zelle_name: formData.get('zelle_name') || undefined,
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }

  const supabase = await createClient()
  const { error } = await supabase
    .from('settings')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', 1)
  if (error) return { error: error.message }

  revalidatePath('/admin/settings')
  revalidatePath('/')
}
