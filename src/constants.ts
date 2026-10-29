import type { Origin, Status } from './types'

export const statusStyles: Record<Status, { badge: string }> = {
  'Aplicado': { badge: 'bg-blue-50 text-blue-700' },
  'Em análise': { badge: 'bg-amber-50 text-amber-700' },
  'Entrevista': { badge: 'bg-violet-50 text-violet-700' },
  'Entrevista RH': { badge: 'bg-violet-50 text-violet-700' },
  'Entrevista Técnica': { badge: 'bg-indigo-50 text-indigo-700' },
  'Entrevista Diretoria': { badge: 'bg-fuchsia-50 text-fuchsia-700' },
  'Entrevista Cliente': { badge: 'bg-pink-50 text-pink-700' },
  'Oferta': { badge: 'bg-emerald-50 text-emerald-700' },
}

export const originStyles: Record<Origin, string> = {
  Brasileira: 'bg-slate-100 text-slate-600',
  Gringa: 'bg-sky-50 text-sky-700',
}

export const inputClass = 'w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
