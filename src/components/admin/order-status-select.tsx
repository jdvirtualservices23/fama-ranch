'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { updateOrderStatus } from '@/app/actions/orders'
import { ORDER_STATUS_LABELS } from '@/lib/format'
import type { OrderStatus } from '@/lib/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const STATUS_OPTIONS: OrderStatus[] = ['pendiente', 'en_proceso', 'completado', 'cancelado']

export function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string
  status: OrderStatus
}) {
  const [pending, startTransition] = useTransition()

  function handleChange(value: string) {
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, value as OrderStatus)
        toast.success('Estado del pedido actualizado.')
      } catch {
        toast.error('No se pudo actualizar el estado.')
      }
    })
  }

  return (
    <Select value={status} onValueChange={handleChange} disabled={pending}>
      <SelectTrigger size="sm" className="w-[150px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((option) => (
          <SelectItem key={option} value={option}>
            {ORDER_STATUS_LABELS[option]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
