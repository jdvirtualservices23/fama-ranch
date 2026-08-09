import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { AdminNavLinks } from '@/components/admin/nav-links'
import { Toaster } from '@/components/ui/sonner'

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 px-6 py-4">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-neutral-500">Fama Ranch</p>
            <p className="font-semibold">Panel de administración</p>
          </div>
          <AdminNavLinks />
        </div>
        <form action={logout}>
          <Button variant="outline" size="sm" type="submit">
            Cerrar sesión
          </Button>
        </form>
      </header>
      <main className="p-6">{children}</main>
      <Toaster theme="dark" />
    </div>
  )
}
