'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Minus, Plus } from 'lucide-react'
import type { Product } from '@/lib/types'

export function ComboPickerDialog({
  product,
  options,
  trigger,
}: {
  product: Product
  options: Product[]
  trigger: React.ReactNode
}) {
  const { addItem } = useCart()
  const [open, setOpen] = useState(false)
  const [counts, setCounts] = useState<Record<string, number>>({})

  const total = Object.values(counts).reduce((sum, n) => sum + n, 0)
  const required = product.choice_count

  function updateCount(name: string, delta: number) {
    setCounts((prev) => {
      const next = Math.max(0, (prev[name] ?? 0) + delta)
      if (total + delta > required && delta > 0) return prev
      return { ...prev, [name]: next }
    })
  }

  function handleConfirm() {
    const selectionNote = Object.entries(counts)
      .filter(([, n]) => n > 0)
      .map(([name, n]) => `${n}x ${name}`)
      .join(', ')

    addItem({
      productId: product.id,
      name: product.name,
      priceUsd: product.price_usd,
      selectionNote,
    })
    setCounts({})
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setCounts({})
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="border-neutral-800 bg-brand-card text-neutral-50">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-neutral-400">
          Elige {required} {required === 1 ? 'sabor' : 'sabores'} ({total}/{required})
        </p>
        <div className="max-h-[50vh] space-y-1 overflow-y-auto">
          {options.map((option) => {
            const count = counts[option.name] ?? 0
            return (
              <div
                key={option.id}
                className="flex items-center justify-between gap-3 rounded-md border border-neutral-800 px-3 py-2"
              >
                <span className="text-sm">{option.name}</span>
                <div className="flex items-center gap-1.5">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7"
                    disabled={count === 0}
                    onClick={() => updateCount(option.name, -1)}
                  >
                    <Minus className="size-3.5" />
                  </Button>
                  <span className="w-5 text-center text-sm">{count}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7"
                    disabled={total >= required}
                    onClick={() => updateCount(option.name, 1)}
                  >
                    <Plus className="size-3.5" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
        <DialogFooter>
          <Button
            disabled={total !== required}
            onClick={handleConfirm}
            className="w-full bg-brand-gold text-black hover:bg-brand-gold/90"
          >
            Agregar al carrito
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
