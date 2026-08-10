'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export type ProductSales = {
  name: string
  quantity: number
  revenue: number
}

export function ProductSalesChart({ data }: { data: ProductSales[] }) {
  const top = [...data].sort((a, b) => b.quantity - a.quantity).slice(0, 12)

  if (top.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-neutral-800 p-8 text-center text-neutral-500">
        No hay ventas en este rango.
      </p>
    )
  }

  return (
    <div style={{ height: Math.max(top.length * 36, 200) }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={top} layout="vertical" margin={{ left: 8, right: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={false} />
          <XAxis type="number" stroke="#737373" fontSize={12} allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#a3a3a3"
            fontSize={12}
            width={160}
            tick={{ fill: '#d4d4d4' }}
          />
          <Tooltip
            contentStyle={{
              background: '#141414',
              border: '1px solid #262626',
              borderRadius: 8,
            }}
            labelStyle={{ color: '#fafafa' }}
            itemStyle={{ color: '#ffcc00' }}
            formatter={(value) => [value, 'Unidades vendidas']}
          />
          <Bar dataKey="quantity" fill="#ffcc00" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
