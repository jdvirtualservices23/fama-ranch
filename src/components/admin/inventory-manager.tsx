'use client'

import { useActionState, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  addInventoryMovement,
  createInventoryItem,
  deleteInventoryItem,
  deleteInventoryMovement,
} from '@/app/actions/inventory'
import type { ActionState } from '@/app/actions/menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { InventoryStockChart } from '@/components/admin/inventory-stock-chart'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Trash2 } from 'lucide-react'
import type { InventoryItem, InventoryMovement } from '@/lib/types'

function NewItemDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createInventoryItem,
    undefined
  )

  useEffect(() => {
    if (open && !state?.error && state !== undefined) setOpen(false)
  }, [state, open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="border-neutral-800 bg-neutral-900 text-neutral-50">
        <DialogHeader>
          <DialogTitle>Nuevo insumo</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" placeholder="Ej. Queso Santa Bárbara" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Unidad</Label>
            <Input id="unit" name="unit" placeholder="Ej. kg, litros, unidades" defaultValue="kg" required />
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

function MovementForm({ items }: { items: InventoryItem[] }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    addInventoryMovement,
    undefined
  )

  useEffect(() => {
    if (state !== undefined && !state.error) {
      toast.success('Movimiento registrado.')
    }
  }, [state])

  return (
    <form action={formAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="item_id">Insumo</Label>
        <Select name="item_id" disabled={items.length === 0}>
          <SelectTrigger id="item_id" className="w-full">
            <SelectValue placeholder="Selecciona un insumo" />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name} ({item.unit})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="movement_type">Tipo</Label>
        <Select name="movement_type" defaultValue="compra">
          <SelectTrigger id="movement_type" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="compra">Compra (entra)</SelectItem>
            <SelectItem value="consumo">Consumo (sale)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="quantity">Cantidad</Label>
        <Input id="quantity" name="quantity" type="number" step="0.01" min="0.01" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="note">Nota (opcional)</Label>
        <Textarea id="note" name="note" placeholder="Ej. proveedor, motivo del consumo" />
      </div>
      {state?.error && <p className="text-sm text-red-500 sm:col-span-2">{state.error}</p>}
      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending || items.length === 0}>
          {pending ? 'Guardando...' : 'Registrar movimiento'}
        </Button>
      </div>
    </form>
  )
}

export function InventoryManager({
  items,
  movements,
}: {
  items: InventoryItem[]
  movements: InventoryMovement[]
}) {
  const stockByItem = useMemo(() => {
    const stock: Record<string, number> = {}
    for (const m of movements) {
      const delta = m.movement_type === 'compra' ? m.quantity : -m.quantity
      stock[m.item_id] = (stock[m.item_id] ?? 0) + delta
    }
    return stock
  }, [movements])

  const itemName = (id: string) => items.find((i) => i.id === id)?.name ?? '—'

  async function handleDeleteItem(id: string) {
    if (!confirm('¿Eliminar este insumo? También se borrará su historial de movimientos.')) return
    try {
      await deleteInventoryItem(id)
      toast.success('Insumo eliminado.')
    } catch {
      toast.error('No se pudo eliminar el insumo.')
    }
  }

  async function handleDeleteMovement(id: string) {
    if (!confirm('¿Eliminar este movimiento?')) return
    try {
      await deleteInventoryMovement(id)
      toast.success('Movimiento eliminado.')
    } catch {
      toast.error('No se pudo eliminar el movimiento.')
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-neutral-800 bg-neutral-900 text-neutral-50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Insumos y existencias</CardTitle>
          <NewItemDialog
            trigger={
              <Button size="sm" variant="outline">
                <Plus className="size-4" /> Nuevo insumo
              </Button>
            }
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <InventoryStockChart
            data={items.map((item) => ({
              name: item.name,
              stock: stockByItem[item.id] ?? 0,
              unit: item.unit,
            }))}
          />
          {items.length === 0 ? (
            <p className="text-sm text-neutral-500">No hay insumos todavía.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((item) => {
                const stock = stockByItem[item.id] ?? 0
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-md border border-neutral-800 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      <p className={`text-xs ${stock <= 0 ? 'text-red-500' : 'text-neutral-500'}`}>
                        {stock} {item.unit}
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7 shrink-0 text-red-500 hover:text-red-400"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-neutral-800 bg-neutral-900 text-neutral-50">
        <CardHeader>
          <CardTitle>Registrar compra o consumo</CardTitle>
        </CardHeader>
        <CardContent>
          <MovementForm items={items} />
        </CardContent>
      </Card>

      <Card className="border-neutral-800 bg-neutral-900 text-neutral-50">
        <CardHeader>
          <CardTitle>Historial de movimientos</CardTitle>
        </CardHeader>
        <CardContent>
          {movements.length === 0 ? (
            <p className="text-sm text-neutral-500">No hay movimientos registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-neutral-800 hover:bg-transparent">
                    <TableHead>Fecha</TableHead>
                    <TableHead>Insumo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Nota</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map((m) => (
                    <TableRow key={m.id} className="border-neutral-800">
                      <TableCell className="text-sm text-neutral-400">
                        {new Date(m.created_at).toLocaleString('es-VE', {
                          timeZone: 'America/Caracas',
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell>{itemName(m.item_id)}</TableCell>
                      <TableCell>
                        <Badge variant={m.movement_type === 'compra' ? 'default' : 'secondary'}>
                          {m.movement_type === 'compra' ? 'Compra' : 'Consumo'}
                        </Badge>
                      </TableCell>
                      <TableCell>{m.quantity}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm text-neutral-400">
                        {m.note}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7 text-red-500 hover:text-red-400"
                          onClick={() => handleDeleteMovement(m.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
