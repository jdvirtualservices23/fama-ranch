import { getAvailableProductsByCategory, getSettings } from '@/lib/supabase/queries'
import { SiteHeader } from '@/components/site/site-header'
import { ProductCard } from '@/components/site/product-card'

export default async function HomePage() {
  const [sections, settings] = await Promise.all([
    getAvailableProductsByCategory(),
    getSettings(),
  ])

  const productsByCategory = new Map(sections.map((s) => [s.category.id, s.products]))
  const visibleSections = sections.filter((s) => !s.category.is_choice_pool)

  return (
    <div className="flex min-h-screen flex-col bg-brand-bg text-neutral-50">
      <SiteHeader bcvRate={settings.bcv_rate} />

      <main className="mx-auto w-full max-w-3xl flex-1 space-y-8 px-4 py-6">
        {visibleSections.every((s) => s.products.length === 0) && (
          <p className="py-16 text-center text-neutral-500">
            El menú está en preparación. Vuelve pronto.
          </p>
        )}

        {visibleSections.map(
          ({ category, products }) =>
            products.length > 0 && (
              <section key={category.id}>
                <h2 className="mb-3 text-lg font-bold text-brand-gold">{category.name}</h2>
                <div className="space-y-3">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      bcvRate={settings.bcv_rate}
                      choiceOptions={
                        product.choice_category_id
                          ? (productsByCategory.get(product.choice_category_id) ?? [])
                          : []
                      }
                    />
                  ))}
                </div>
              </section>
            )
        )}
      </main>

      <footer className="border-t border-neutral-900 px-4 py-6 text-center text-xs text-neutral-600">
        Fama Ranch — Pide en línea, paga como prefieras.
      </footer>
    </div>
  )
}
