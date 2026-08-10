'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { formatUsd } from '@/lib/format'
import type { Product } from '@/lib/types'

export function XlUpgradeDialog({
  product,
  trigger,
}: {
  product: Product & { xl_upgrade_price: number }
  trigger: React.ReactNode
}) {
  const { addItem } = useCart()
  const [open, setOpen] = useState(false)
  const xlPrice = product.price_usd + product.xl_upgrade_price

  function choose(isXl: boolean) {
    addItem({
      productId: product.id,
      name: product.name,
      priceUsd: isXl ? xlPrice : product.price_usd,
      selectionNote: isXl ? 'XL' : undefined,
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="border-neutral-800 bg-brand-card text-neutral-50">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-neutral-400">¿Cómo la quieres?</p>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-auto flex-col gap-1 py-4"
            onClick={() => choose(false)}
          >
            <span>Normal</span>
            <span className="text-brand-gold">{formatUsd(product.price_usd)}</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-1 py-4"
            onClick={() => choose(true)}
          >
            <span>XL</span>
            <span className="text-brand-gold">{formatUsd(xlPrice)}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
