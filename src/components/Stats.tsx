import { CalendarCheck2, Kanban, LoaderCircle, type LucideIcon } from 'lucide-react'
import type { Job } from '../types'

interface Stat { label: string; value: number; icon: LucideIcon; color: string; bg: string; note: string }

export function Stats({ jobs }: { jobs: Job[] }) {
  const interviews = jobs.filter(j => j.status.startsWith('Entrevista')).length
  const stats: Stat[] = [
    { label: 'Total de candidaturas', value: jobs.length, icon: Kanban, color: 'text-indigo-600', bg: 'bg-indigo-50', note: '+ 3 este mês' },
    { label: 'Em processo', value: jobs.filter(j => j.status === 'Em análise' || j.status.startsWith('Entrevista')).length, icon: LoaderCircle, color: 'text-amber-600', bg: 'bg-amber-50', note: 'candidaturas ativas' },
    { label: 'Entrevistas', value: interviews, icon: CalendarCheck2, color: 'text-violet-600', bg: 'bg-violet-50', note: interviews ? 'Próxima: amanhã' : 'Nenhuma agendada' },
  ]

  return (
    <section className="grid grid-cols-2 gap-4 xl:grid-cols-3">
      {stats.map(({ label, value, icon: Icon, color, bg, note }) => (
        <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
            </div>
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg} ${color}`}><Icon className="h-4 w-4" /></div>
          </div>
          <p className="mt-3 text-[11px] font-medium text-slate-400">{note}</p>
        </div>
      ))}
    </section>
  )
}
