import Image from 'next/image'
import { CartSheet } from '@/components/site/cart-sheet'

export function SiteHeader({ bcvRate }: { bcvRate: number }) {
  return (
    <header className="sticky top-0 z-10 border-b border-neutral-800 bg-brand-bg/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Fama Ranch"
            width={44}
            height={44}
            className="rounded-full border-2 border-brand-gold object-cover"
          />
          <div>
            <p className="font-bold tracking-wide text-neutral-50">FAMA RANCH</p>
            <p className="text-xs text-neutral-500">Tasa BCV: {bcvRate.toFixed(2)} Bs/$</p>
          </div>
        </div>
        <CartSheet bcvRate={bcvRate} />
      </div>
    </header>
  )
}
