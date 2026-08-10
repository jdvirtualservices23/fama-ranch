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
    <div className="dark min-h-screen bg-neutral-950 text-neutral-50">
      <header className="border-b border-neutral-800">
        <div className="flex items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-neutral-500">Fama Ranch</p>
            <p className="font-semibold">Panel de administración</p>
          </div>
          <form action={logout}>
            <Button variant="outline" size="sm" type="submit">
              Cerrar sesión
            </Button>
          </form>
        </div>
        <AdminNavLinks />
      </header>
      <main className="p-6">{children}</main>
      <Toaster theme="dark" />
    </div>
  )
}
