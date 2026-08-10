'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { createOrder } from '@/app/actions/checkout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatBs, formatUsd, usdToBs } from '@/lib/format'
import type { DeliveryMethod, PaymentMethod, Settings } from '@/lib/types'

export function CheckoutForm({ settings }: { settings: Settings }) {
  const router = useRouter()
  const { items, totalUsd, clear, hydrated } = useCart()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null)

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pago_movil')

  useEffect(() => {
    if (hydrated && items.length === 0 && !whatsappUrl) {
      router.replace('/')
    }
  }, [hydrated, items.length, whatsappUrl, router])

  if (!hydrated) {
    return null
  }

  if (whatsappUrl) {
    return (
      <div className="space-y-4 text-center">
        <h2 className="text-xl font-bold text-brand-gold">¡Pedido registrado!</h2>
        <p className="text-neutral-400">
          Ahora confirma tu pedido enviando el resumen por WhatsApp.
        </p>
        <Button
          asChild
          className="bg-brand-whatsapp text-white hover:bg-brand-whatsapp/90"
          onClick={() => window.open(whatsappUrl, '_blank')}
        >
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            Enviar por WhatsApp
          </a>
        </Button>
        <p>
          <Link href="/" className="text-sm text-neutral-500 underline">
            Volver al menú
          </Link>
        </p>
      </div>
    )
  }

  function handleSubmit(formData: FormData) {
    setError(null)
    const payload = {
      customerName: String(formData.get('customerName') ?? ''),
      customerPhone: String(formData.get('customerPhone') ?? ''),
      deliveryMethod,
      address: String(formData.get('address') ?? ''),
      paymentMethod,
      paymentReference: String(formData.get('paymentReference') ?? ''),
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        priceUsd: i.priceUsd,
        quantity: i.quantity,
        selectionNote: i.selectionNote,
      })),
    }

    startTransition(async () => {
      const result = await createOrder(payload)
      if (!result.success) {
        setError(result.error)
        return
      }
      clear()
      setWhatsappUrl(result.whatsappUrl)
      window.open(result.whatsappUrl, '_blank')
    })
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <Card className="border-neutral-800 bg-brand-card text-neutral-50">
        <CardContent className="space-y-3 pt-6">
          <h2 className="font-semibold">Tu pedido</h2>
          {items.map((item) => (
            <div key={item.cartItemId} className="flex justify-between text-sm">
              <div>
                <p className="text-neutral-300">
                  {item.quantity}x {item.name}
                </p>
                {item.selectionNote && (
                  <p className="text-xs text-neutral-500">{item.selectionNote}</p>
                )}
              </div>
              <span className="text-neutral-400">{formatUsd(item.priceUsd * item.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-neutral-800 pt-2 font-semibold">
            <span>Total</span>
            <div className="text-right">
              <p className="text-brand-gold">{formatUsd(totalUsd)}</p>
              <p className="text-xs font-normal text-neutral-500">
                {formatBs(usdToBs(totalUsd, settings.bcv_rate))}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-neutral-800 bg-brand-card text-neutral-50">
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="customerName">Nombre</Label>
            <Input id="customerName" name="customerName" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerPhone">Teléfono</Label>
            <Input id="customerPhone" name="customerPhone" placeholder="0412-1234567" />
          </div>

          <div className="space-y-2">
            <Label>Método de entrega</Label>
            <Select
              value={deliveryMethod}
              onValueChange={(v) => setDeliveryMethod(v as DeliveryMethod)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delivery">Delivery</SelectItem>
                <SelectItem value="pickup">Retiro en local</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {deliveryMethod === 'delivery' && (
            <div className="space-y-2">
              <Label htmlFor="address">Dirección de entrega</Label>
              <Textarea id="address" name="address" required />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-neutral-800 bg-brand-card text-neutral-50">
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label>Método de pago</Label>
            <Select
              value={paymentMethod}
              onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pago_movil">Pago Móvil</SelectItem>
                <SelectItem value="efectivo">Efectivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {paymentMethod === 'pago_movil' && (
            <div className="space-y-3 rounded-md border border-neutral-800 bg-neutral-950 p-3 text-sm">
              <p className="text-neutral-300">
                Banco: <span className="font-medium">{settings.pago_movil_bank ?? '—'}</span>
              </p>
              <p className="text-neutral-300">
                Cédula/RIF: <span className="font-medium">{settings.pago_movil_id ?? '—'}</span>
              </p>
              <p className="text-neutral-300">
                Teléfono: <span className="font-medium">{settings.pago_movil_phone ?? '—'}</span>
              </p>
              <div className="space-y-2 pt-1">
                <Label htmlFor="paymentReference">N° de referencia</Label>
                <Input id="paymentReference" name="paymentReference" required />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {error && <p className="text-sm text-brand-red">{error}</p>}

      <Button
        type="submit"
        disabled={pending || items.length === 0}
        className="w-full bg-brand-gold text-black hover:bg-brand-gold/90"
      >
        {pending ? 'Procesando...' : 'Confirmar pedido'}
      </Button>
    </form>
  )
}
