'use client'

import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { ComboPickerDialog } from '@/components/site/combo-picker-dialog'
import { formatBs, formatUsd, usdToBs } from '@/lib/format'
import { Plus } from 'lucide-react'
import type { Product } from '@/lib/types'

export function ProductCard({
  product,
  bcvRate,
  choiceOptions,
}: {
  product: Product
  bcvRate: number
  /** Productos disponibles para elegir, si este producto exige selección (ej. sabores de un combo). */
  choiceOptions: Product[]
}) {
  const { addItem } = useCart()
  const requiresChoice = product.choice_count > 0 && choiceOptions.length > 0

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-neutral-800 bg-brand-card p-4">
      <div className="min-w-0">
        <h3 className="font-semibold text-neutral-50">{product.name}</h3>
        {product.description && (
          <p className="mt-1 text-sm text-neutral-400">{product.description}</p>
        )}
        <p className="mt-2 text-sm">
          <span className="font-semibold text-brand-gold">{formatUsd(product.price_usd)}</span>
          <span className="ml-2 text-neutral-500">
            {formatBs(usdToBs(product.price_usd, bcvRate))}
          </span>
        </p>
      </div>
      {requiresChoice ? (
        <ComboPickerDialog
          product={product}
          options={choiceOptions}
          trigger={
            <Button
              size="sm"
              className="shrink-0 rounded-full bg-brand-gold text-black hover:bg-brand-gold/90"
            >
              Elegir
            </Button>
          }
        />
      ) : (
        <Button
          size="icon"
          className="shrink-0 rounded-full bg-brand-gold text-black hover:bg-brand-gold/90"
          onClick={() =>
            addItem({ productId: product.id, name: product.name, priceUsd: product.price_usd })
          }
          aria-label={`Agregar ${product.name}`}
        >
          <Plus className="size-4" />
        </Button>
      )}
    </div>
  )
}
