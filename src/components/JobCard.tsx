import { MapPin, Trash2 } from 'lucide-react'
import { originStyles, statusStyles } from '../constants'
import type { Job } from '../types'

interface Props {
  job: Job
  onOpen: (id: number) => void
  onDelete: (id: number) => void
  onDragStart: (id: number) => void
}

export function JobCard({ job, onOpen, onDelete, onDragStart }: Props) {
  return (
    <article
      draggable
      onDragStart={e => {
        onDragStart(job.id)
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', String(job.id))
      }}
      onClick={() => onOpen(job.id)}
      className="group cursor-grab rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-sm font-bold text-indigo-700">{job.company.charAt(0).toUpperCase()}</div>
          <h4 className="truncate text-sm font-bold text-slate-900">{job.title}</h4>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onDelete(job.id) }}
          aria-label="Excluir candidatura"
          className="rounded-lg p-1.5 text-slate-300 transition hover:bg-rose-50 hover:text-rose-500"
        ><Trash2 className="h-3.5 w-3.5" /></button>
      </div>
      <p className="mt-2 truncate text-xs font-medium text-slate-500">{job.company}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className={`rounded-md px-1.5 py-1 text-[10px] font-bold ${statusStyles[job.status].badge}`}>{job.status}</span>
        <span className={`rounded-md px-1.5 py-1 text-[10px] font-bold ${originStyles[job.origin]}`}>{job.origin}</span>
      </div>
      <p className="mt-3 truncate text-[11px] text-slate-400"><MapPin className="mr-1 inline h-3 w-3" />{job.location || 'Local não informado'}</p>
    </article>
  )
}
