'use client'

import { useRouter } from 'next/navigation'

export function DateJumpInput({ date, max }: { date: string; max: string }) {
  const router = useRouter()

  return (
    <input
      type="date"
      defaultValue={date}
      max={max}
      onChange={(e) => {
        if (e.target.value) router.push(`/admin?date=${e.target.value}`)
      }}
      className="h-8 rounded-md border border-input bg-transparent px-2 text-sm"
    />
  )
}
