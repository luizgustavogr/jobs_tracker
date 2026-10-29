import { ExternalLink, Pencil, X } from 'lucide-react'
import { originStyles, statusStyles } from '../constants'
import { formatDate, getSafeUrl } from '../lib/format'
import type { Job } from '../types'
import { Modal } from './Modal'

interface Props {
  job: Job
  onClose: () => void
  onEdit: () => void
}

export function JobDetailsModal({ job, onClose, onEdit }: Props) {
  const safeLink = getSafeUrl(job.link)

  return (
    <Modal onClose={onClose} zIndex="z-30">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-600">{job.company} · {job.location || 'Local não informado'}</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">{job.title}</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-50"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className={`rounded-md px-2 py-1 text-xs font-bold ${statusStyles[job.status].badge}`}>{job.status}</span>
          <span className={`rounded-md px-2 py-1 text-xs font-bold ${originStyles[job.origin]}`}>{job.origin}</span>
          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">Candidatura em {formatDate(job.applied_date)}</span>
        </div>
        {safeLink && (
          <a href={safeLink} target="_blank" rel="noopener noreferrer" className="mt-4 flex w-fit items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100">
            <ExternalLink className="h-4 w-4" /> Abrir link da vaga
          </a>
        )}
        <div className="mt-6 border-t border-slate-100 pt-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Descrição da vaga</h3>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">{job.description || 'Nenhuma descrição foi adicionada para esta vaga.'}</p>
        </div>
        <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
          <button type="button" onClick={onEdit} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
            <Pencil className="h-4 w-4" /> Editar candidatura
          </button>
        </div>
      </div>
    </Modal>
  )
}
