'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet'
import { formatBs, formatUsd, usdToBs } from '@/lib/format'
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'

export function CartSheet({ bcvRate }: { bcvRate: number }) {
  const [open, setOpen] = useState(false)
  const { items, setQuantity, removeItem, totalUsd, totalItems } = useCart()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="relative border-neutral-700 bg-transparent text-neutral-50 hover:bg-neutral-800"
        >
          <ShoppingCart className="size-4" />
          Carrito
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-brand-red text-white">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="border-neutral-800 bg-neutral-950 text-neutral-50">
        <SheetHeader>
          <SheetTitle className="text-neutral-50">Tu pedido</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-3 overflow-y-auto px-4">
          {items.length === 0 && (
            <p className="py-8 text-center text-sm text-neutral-500">
              Todavía no has agregado productos.
            </p>
          )}
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between gap-3 rounded-md border border-neutral-800 p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{item.name}</p>
                <p className="text-xs text-neutral-500">{formatUsd(item.priceUsd)} c/u</p>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7"
                  onClick={() => setQuantity(item.productId, item.quantity - 1)}
                >
                  <Minus className="size-3.5" />
                </Button>
                <span className="w-5 text-center text-sm">{item.quantity}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7"
                  onClick={() => setQuantity(item.productId, item.quantity + 1)}
                >
                  <Plus className="size-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7 text-brand-red hover:text-brand-red"
                  onClick={() => removeItem(item.productId)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <SheetFooter className="border-t border-neutral-800 pt-4">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-sm text-neutral-400">Total</span>
            <div className="text-right">
              <p className="text-lg font-bold text-brand-gold">{formatUsd(totalUsd)}</p>
              <p className="text-xs text-neutral-500">{formatBs(usdToBs(totalUsd, bcvRate))}</p>
            </div>
          </div>
          {items.length === 0 ? (
            <Button disabled className="w-full bg-brand-gold text-black">
              Finalizar pedido
            </Button>
          ) : (
            <Button
              asChild
              className="w-full bg-brand-gold text-black hover:bg-brand-gold/90"
              onClick={() => setOpen(false)}
            >
              <Link href="/checkout">Finalizar pedido</Link>
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
