'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export type StockBar = {
  name: string
  stock: number
  unit: string
}

export function InventoryStockChart({ data }: { data: StockBar[] }) {
  if (data.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-neutral-800 p-8 text-center text-neutral-500">
        Agrega un insumo para ver su existencia aquí.
      </p>
    )
  }

  return (
    <div style={{ height: Math.max(data.length * 36, 160) }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={false} />
          <XAxis type="number" stroke="#737373" fontSize={12} />
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
            formatter={(value, _name, item) => [
              `${value} ${(item.payload as StockBar).unit}`,
              'Existencia',
            ]}
          />
          <Bar dataKey="stock" radius={[0, 4, 4, 0]}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.stock <= 0 ? '#ff4444' : '#ffcc00'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
