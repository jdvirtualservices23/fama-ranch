import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function MetricCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <Card className="border-neutral-800 bg-neutral-900 text-neutral-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-neutral-400">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
        {hint && <p className="mt-1 text-xs text-neutral-500">{hint}</p>}
      </CardContent>
    </Card>
  )
}
