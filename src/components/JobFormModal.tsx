import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { inputClass } from '../constants'
import { getSafeUrl } from '../lib/format'
import { ORIGINS, STATUSES, type Job, type JobInput, type Origin, type Status } from '../types'
import { Modal } from './Modal'

interface Props {
  job: Job | null
  onClose: () => void
  onSave: (input: JobInput, id: number | null) => Promise<boolean>
}

const labelClass = 'mb-1.5 block text-xs font-semibold text-slate-600'

export function JobFormModal({ job, onClose, onSave }: Props) {
  const [title, setTitle] = useState(job?.title ?? '')
  const [company, setCompany] = useState(job?.company ?? '')
  const [location, setLocation] = useState(job?.location ?? '')
  const [status, setStatus] = useState<Status>(job?.status ?? 'Aplicado')
  const [origin, setOrigin] = useState<Origin>(job?.origin ?? 'Brasileira')
  const [date, setDate] = useState(job?.applied_date ?? new Date().toISOString().slice(0, 10))
  const [link, setLink] = useState(job?.link ?? '')
  const [description, setDescription] = useState(job?.description ?? '')

  async function submit(event: FormEvent) {
    event.preventDefault()
    const ok = await onSave({
      title: title.trim(),
      company: company.trim(),
      location: location.trim() || 'Local não informado',
      link: getSafeUrl(link.trim()) || null,
      description: description.trim(),
      status,
      origin,
      applied_date: date,
    }, job?.id ?? null)
    if (ok) onClose()
  }

  return (
    <Modal onClose={onClose} zIndex="z-20">
      <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{job ? 'Editar candidatura' : 'Adicionar candidatura'}</h2>
            <p className="mt-1 text-xs text-slate-400">{job ? 'Atualize os dados desta oportunidade.' : 'Registre uma nova oportunidade para acompanhar.'}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-50"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className={labelClass}>Cargo</label>
            <input autoFocus required value={title} onChange={e => setTitle(e.target.value)} className={inputClass} placeholder="Ex: Desenvolvedor Front-end" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Empresa</label>
              <input required value={company} onChange={e => setCompany(e.target.value)} className={inputClass} placeholder="Ex: Nubank" />
            </div>
            <div>
              <label className={labelClass}>Local / modelo</label>
              <input value={location} onChange={e => setLocation(e.target.value)} className={inputClass} placeholder="Remoto" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className={labelClass}>Etapa</label>
              <select value={status} onChange={e => setStatus(e.target.value as Status)} className={`${inputClass} bg-white`}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Origem da vaga</label>
              <select value={origin} onChange={e => setOrigin(e.target.value as Origin)} className={`${inputClass} bg-white`}>
                {ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Data da candidatura</label>
              <input type="date" required value={date} onChange={e => setDate(e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label htmlFor="jobLink" className={labelClass}>Link da vaga</label>
            <input id="jobLink" type="url" value={link} onChange={e => setLink(e.target.value)} className={inputClass} placeholder="https://exemplo.com/vaga" />
          </div>
          <div>
            <label htmlFor="jobDescription" className={labelClass}>Descrição da vaga</label>
            <textarea id="jobDescription" rows={7} value={description} onChange={e => setDescription(e.target.value)} className={`${inputClass} resize-y leading-6`} placeholder="Cole ou escreva aqui a descrição completa da vaga..." />
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50">Cancelar</button>
            <button className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">{job ? 'Salvar alterações' : 'Salvar candidatura'}</button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
