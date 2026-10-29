import { useRef } from 'react'
import { STATUSES, type Job, type Status } from '../types'
import { JobCard } from './JobCard'

interface Props {
  jobs: Job[]
  activeStatus: Status | 'Todas'
  onOpen: (id: number) => void
  onDelete: (id: number) => void
  onMove: (id: number, status: Status) => void
}

export function KanbanBoard({ jobs, activeStatus, onOpen, onDelete, onMove }: Props) {
  const dragged = useRef<number | null>(null)
  const columns = STATUSES.filter(status => activeStatus === 'Todas' || status === activeStatus)

  return (
    <div className="kanban-scroll flex min-w-0 gap-4 pt-5 pb-3">
      {columns.map(status => {
        const columnJobs = jobs.filter(job => job.status === status)
        return (
          <section
            key={status}
            className="flex w-72 shrink-0 flex-col rounded-2xl bg-slate-50 p-3"
            onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }}
            onDrop={e => {
              e.preventDefault()
              const id = dragged.current ?? Number(e.dataTransfer.getData('text/plain'))
              dragged.current = null
              const job = jobs.find(item => item.id === id)
              if (job && job.status !== status) onMove(id, status)
            }}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500">{status}</h4>
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-slate-400">{columnJobs.length}</span>
            </div>
            <div className="min-h-32 space-y-3">
              {columnJobs.length
                ? columnJobs.map(job => (
                    <JobCard key={job.id} job={job} onOpen={onOpen} onDelete={onDelete} onDragStart={id => { dragged.current = id }} />
                  ))
                : <p className="rounded-xl border border-dashed border-slate-200 px-3 py-8 text-center text-xs text-slate-400">Arraste uma candidatura para cá</p>}
            </div>
          </section>
        )
      })}
    </div>
  )
}
