import { getInventoryItems, getInventoryMovements } from '@/lib/supabase/queries'
import { InventoryManager } from '@/components/admin/inventory-manager'

export default async function AdminInventarioPage() {
  const [items, movements] = await Promise.all([getInventoryItems(), getInventoryMovements()])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Inventario</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Control de compra y consumo de insumos.
        </p>
      </div>
      <InventoryManager items={items} movements={movements} />
    </div>
  )
}
