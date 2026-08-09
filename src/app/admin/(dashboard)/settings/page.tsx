import { getSettings } from '@/lib/supabase/queries'
import { SettingsForm } from '@/components/admin/settings-form'

export default async function AdminSettingsPage() {
  const settings = await getSettings()

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Esta información se refleja al instante en el menú de los clientes.
        </p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  )
}
