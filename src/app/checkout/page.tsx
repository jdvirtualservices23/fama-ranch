import Link from 'next/link'
import { getSettings } from '@/lib/supabase/queries'
import { CheckoutForm } from '@/components/site/checkout-form'
import { ChevronLeft } from 'lucide-react'

export default async function CheckoutPage() {
  const settings = await getSettings()

  return (
    <div className="flex min-h-screen flex-col bg-brand-bg text-neutral-50">
      <header className="border-b border-neutral-800 px-4 py-3">
        <div className="mx-auto flex max-w-xl items-center gap-2">
          <Link href="/" className="text-neutral-400 hover:text-neutral-100">
            <ChevronLeft className="size-5" />
          </Link>
          <p className="font-bold tracking-wide">Finalizar pedido</p>
        </div>
      </header>
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-6">
        <CheckoutForm settings={settings} />
      </main>
    </div>
  )
}
