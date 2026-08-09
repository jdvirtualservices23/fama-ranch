export function formatUsd(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export function formatBs(amount: number) {
  return `${new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)} Bs`
}

export function usdToBs(usd: number, bcvRate: number) {
  return Math.round(usd * bcvRate * 100) / 100
}

/** Venezuela is UTC-4 year-round (no DST). Returns the ISO bounds of "today" in Caracas time. */
export function getCaracasDayRange(date = new Date()) {
  const offsetMs = 4 * 60 * 60 * 1000
  const caracasNow = new Date(date.getTime() - offsetMs)
  const y = caracasNow.getUTCFullYear()
  const m = caracasNow.getUTCMonth()
  const d = caracasNow.getUTCDate()
  const start = new Date(Date.UTC(y, m, d, 0, 0, 0) + offsetMs)
  const end = new Date(Date.UTC(y, m, d, 23, 59, 59, 999) + offsetMs)
  return { start: start.toISOString(), end: end.toISOString() }
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pendiente: 'Pendiente',
  en_proceso: 'En proceso',
  completado: 'Completado',
  cancelado: 'Cancelado',
}

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  pago_movil: 'Pago Móvil',
  efectivo: 'Efectivo',
  zelle: 'Zelle',
}

export const DELIVERY_METHOD_LABELS: Record<string, string> = {
  delivery: 'Delivery',
  pickup: 'Retiro en local',
}
