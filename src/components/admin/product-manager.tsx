'use client'

import { useActionState, useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  createProduct,
  deleteProduct,
  toggleProductAvailability,
  updateProduct,
  type ActionState,
} from '@/app/actions/menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { formatUsd } from '@/lib/format'
import type { Category, Product } from '@/lib/types'

function ProductDialog({
  product,
  categories,
  trigger,
}: {
  product?: Product
  categories: Category[]
  trigger: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [choiceCategoryId, setChoiceCategoryId] = useState(product?.choice_category_id ?? '')
  const action = product ? updateProduct : createProduct
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
          <DialogTitle>{product ? 'Editar producto' : 'Nuevo producto'}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          {product && <input type="hidden" name="id" value={product.id} />}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" defaultValue={product?.name} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" name="description" defaultValue={product?.description ?? ''} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price_usd">Precio (USD)</Label>
              <Input
                id="price_usd"
                name="price_usd"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product?.price_usd}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Orden</Label>
              <Input id="order" name="order" type="number" defaultValue={product?.order ?? 0} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="xl_upgrade_price">
              Costo adicional versión XL (opcional, USD)
            </Label>
            <Input
              id="xl_upgrade_price"
              name="xl_upgrade_price"
              type="number"
              step="0.01"
              min="0"
              placeholder="Deja vacío si no aplica"
              defaultValue={product?.xl_upgrade_price ?? ''}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category_id">Categoría</Label>
            <Select name="category_id" defaultValue={product?.category_id}>
              <SelectTrigger id="category_id" className="w-full">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 rounded-md border border-neutral-800 p-3">
            <Label htmlFor="choice_category_id">
              ¿Este producto requiere elegir sabores? (opcional, ej. combos)
            </Label>
            <Select
              value={choiceCategoryId || 'none'}
              onValueChange={(v) => setChoiceCategoryId(v === 'none' ? '' : v)}
            >
              <SelectTrigger id="choice_category_id" className="w-full">
                <SelectValue placeholder="Ninguna" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Ninguna</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="choice_category_id" value={choiceCategoryId} />
            {choiceCategoryId && (
              <div className="space-y-2 pt-1">
                <Label htmlFor="choice_count">Cuántos debe elegir el cliente</Label>
                <Input
                  id="choice_count"
                  name="choice_count"
                  type="number"
                  min="1"
                  defaultValue={product?.choice_count || 1}
                  required
                />
              </div>
            )}
          </div>
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

export function ProductManager({
  products,
  categories,
}: {
  products: Product[]
  categories: Category[]
}) {
  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? '—'

  async function handleToggle(product: Product) {
    try {
      await toggleProductAvailability(product.id, !product.is_available)
    } catch {
      toast.error('No se pudo actualizar la disponibilidad.')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este producto?')) return
    try {
      await deleteProduct(id)
      toast.success('Producto eliminado.')
    } catch {
      toast.error('No se pudo eliminar el producto.')
    }
  }

  return (
    <Card className="border-neutral-800 bg-neutral-900 text-neutral-50">
      <CardContent className="space-y-3 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Productos</h2>
          <ProductDialog
            categories={categories}
            trigger={
              <Button size="sm" variant="outline" disabled={categories.length === 0}>
                <Plus className="size-4" /> Nuevo
              </Button>
            }
          />
        </div>
        {categories.length === 0 && (
          <p className="text-sm text-neutral-500">Crea una categoría primero.</p>
        )}
        <ul className="space-y-1">
          {products.map((product) => (
            <li
              key={product.id}
              className="flex items-center justify-between gap-3 rounded-md border border-neutral-800 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{product.name}</p>
                <p className="text-xs text-neutral-500">
                  {categoryName(product.category_id)} · {formatUsd(product.price_usd)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={product.is_available}
                  onCheckedChange={() => handleToggle(product)}
                  className="data-checked:bg-green-600 data-unchecked:bg-red-500"
                />
                <ProductDialog
                  product={product}
                  categories={categories}
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
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </li>
          ))}
          {products.length === 0 && (
            <p className="text-sm text-neutral-500">No hay productos todavía.</p>
          )}
        </ul>
      </CardContent>
    </Card>
  )
}
