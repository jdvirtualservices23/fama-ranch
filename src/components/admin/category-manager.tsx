'use client'

import { useActionState, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { createCategory, deleteCategory, updateCategory, type ActionState } from '@/app/actions/menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import type { Category } from '@/lib/types'

function CategoryDialog({
  category,
  trigger,
}: {
  category?: Category
  trigger: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const action = category ? updateCategory : createCategory
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, undefined)

  useEffect(() => {
    if (open && !state?.error && state !== undefined) {
      setOpen(false)
    }
  }, [state, open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="border-neutral-800 bg-neutral-900 text-neutral-50">
        <DialogHeader>
          <DialogTitle>{category ? 'Editar categoría' : 'Nueva categoría'}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          {category && <input type="hidden" name="id" value={category.id} />}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" defaultValue={category?.name} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="order">Orden</Label>
            <Input
              id="order"
              name="order"
              type="number"
              defaultValue={category?.order ?? 0}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_choice_pool"
              value="true"
              defaultChecked={category?.is_choice_pool}
              className="size-4 rounded border-neutral-700"
            />
            Solo es una lista de opciones (ej. Contornos) — no se muestra como sección del menú
          </label>
          {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function CategoryManager({ categories }: { categories: Category[] }) {
  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta categoría? También se eliminarán sus productos.')) return
    try {
      await deleteCategory(id)
      toast.success('Categoría eliminada.')
    } catch {
      toast.error('No se pudo eliminar la categoría.')
    }
  }

  return (
    <Card className="border-neutral-800 bg-neutral-900 text-neutral-50">
      <CardContent className="space-y-3 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Categorías</h2>
          <CategoryDialog
            trigger={
              <Button size="sm" variant="outline">
                <Plus className="size-4" /> Nueva
              </Button>
            }
          />
        </div>
        <ul className="space-y-1">
          {categories.map((category) => (
            <li
              key={category.id}
              className="flex items-center justify-between rounded-md border border-neutral-800 px-3 py-2"
            >
              <span>{category.name}</span>
              <div className="flex items-center gap-1">
                <CategoryDialog
                  category={category}
                  trigger={
                    <Button size="icon" variant="ghost" className="size-7">
                      <Pencil className="size-3.5" />
                    </Button>
                  }
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7 text-red-500 hover:text-red-400"
                  onClick={() => handleDelete(category.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </li>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-neutral-500">No hay categorías todavía.</p>
          )}
        </ul>
      </CardContent>
    </Card>
  )
}
