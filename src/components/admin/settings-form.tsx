'use client'

import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { updateSettings } from '@/app/actions/settings'
import type { ActionState } from '@/app/actions/menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Settings } from '@/lib/types'

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    updateSettings,
    undefined
  )

  useEffect(() => {
    if (state !== undefined && !state.error) {
      toast.success('Configuración actualizada.')
    }
  }, [state])

  return (
    <form action={formAction} className="space-y-6">
      <Card className="border-neutral-800 bg-neutral-900 text-neutral-50">
        <CardHeader>
          <CardTitle>Tasa BCV y WhatsApp</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="bcv_rate">Tasa BCV (Bs por USD)</Label>
            <Input
              id="bcv_rate"
              name="bcv_rate"
              type="number"
              step="0.0001"
              min="0"
              defaultValue={settings.bcv_rate}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp_phone">WhatsApp del local (con código de país)</Label>
            <Input
              id="whatsapp_phone"
              name="whatsapp_phone"
              defaultValue={settings.whatsapp_phone}
              placeholder="584121234567"
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-neutral-800 bg-neutral-900 text-neutral-50">
        <CardHeader>
          <CardTitle>Datos de Pago Móvil</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="pago_movil_bank">Banco</Label>
            <Input
              id="pago_movil_bank"
              name="pago_movil_bank"
              defaultValue={settings.pago_movil_bank ?? ''}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pago_movil_id">Cédula / RIF</Label>
            <Input
              id="pago_movil_id"
              name="pago_movil_id"
              defaultValue={settings.pago_movil_id ?? ''}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pago_movil_phone">Teléfono</Label>
            <Input
              id="pago_movil_phone"
              name="pago_movil_phone"
              defaultValue={settings.pago_movil_phone ?? ''}
            />
          </div>
        </CardContent>
      </Card>

      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? 'Guardando...' : 'Guardar configuración'}
      </Button>
    </form>
  )
}
