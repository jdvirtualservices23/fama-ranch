'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/menu', label: 'Menú' },
  { href: '/admin/metricas', label: 'Métricas' },
  { href: '/admin/inventario', label: 'Inventario' },
  { href: '/admin/settings', label: 'Configuración' },
]

export function AdminNavLinks() {
  const pathname = usePathname()

  return (
    <nav className="scrollbar-none flex gap-1 overflow-x-auto px-6 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {links.map((link) => {
        const active = link.href === '/admin' ? pathname === '/admin' : pathname.startsWith(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'shrink-0 rounded-md px-3 py-1.5 text-sm whitespace-nowrap transition-colors',
              active
                ? 'bg-neutral-800 text-neutral-50'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100'
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
