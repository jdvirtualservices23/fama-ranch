export function formatUsd(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export function formatBs(amount: number) {
  return `${new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)} Bs`
}

export function usdToBs(usd: number, bcvRate: number) {
  return Math.round(usd * bcvRate * 100) / 100
}

const CARACAS_OFFSET_MS = 4 * 60 * 60 * 1000

/** Venezuela is UTC-4 year-round (no DST). Returns the ISO bounds of "today" in Caracas time. */
export function getCaracasDayRange(date = new Date()) {
  const caracasNow = new Date(date.getTime() - CARACAS_OFFSET_MS)
  const y = caracasNow.getUTCFullYear()
  const m = caracasNow.getUTCMonth()
  const d = caracasNow.getUTCDate()
  const start = new Date(Date.UTC(y, m, d, 0, 0, 0) + CARACAS_OFFSET_MS)
  const end = new Date(Date.UTC(y, m, d, 23, 59, 59, 999) + CARACAS_OFFSET_MS)
  return { start: start.toISOString(), end: end.toISOString() }
}

/** Returns today's date as YYYY-MM-DD in Caracas time (for date inputs/URLs). */
export function todayCaracasDateString() {
  const caracasNow = new Date(Date.now() - CARACAS_OFFSET_MS)
  return caracasNow.toISOString().slice(0, 10)
}

/** Bounds of a specific Caracas calendar day (YYYY-MM-DD), independent of the current instant. */
export function getCaracasDayRangeFromDateString(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const start = new Date(Date.UTC(y, m - 1, d, 0, 0, 0) + CARACAS_OFFSET_MS)
  const end = new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999) + CARACAS_OFFSET_MS)
  return { start: start.toISOString(), end: end.toISOString() }
}

/** Adds `days` (can be negative) to a YYYY-MM-DD string, returning a new YYYY-MM-DD string. */
export function shiftDateString(dateStr: string, days: number) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d))
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
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
