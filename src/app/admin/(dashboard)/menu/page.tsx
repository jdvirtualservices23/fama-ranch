import { getCategories, getProducts } from '@/lib/supabase/queries'
import { CategoryManager } from '@/components/admin/category-manager'
import { ProductManager } from '@/components/admin/product-manager'

export default async function AdminMenuPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Menú</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Gestiona las categorías y productos que ven los clientes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
        <CategoryManager categories={categories} />
        <ProductManager products={products} categories={categories} />
      </div>
    </div>
  )
}
