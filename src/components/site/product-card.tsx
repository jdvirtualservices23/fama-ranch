'use client'

import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { formatBs, formatUsd, usdToBs } from '@/lib/format'
import { Plus } from 'lucide-react'
import type { Product } from '@/lib/types'

export function ProductCard({ product, bcvRate }: { product: Product; bcvRate: number }) {
  const { addItem } = useCart()

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
    </div>
  )
}
