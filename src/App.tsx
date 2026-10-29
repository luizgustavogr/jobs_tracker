import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal'
import { Header } from './components/Header'
import { JobDetailsModal } from './components/JobDetailsModal'
import { JobFormModal } from './components/JobFormModal'
import { KanbanBoard } from './components/KanbanBoard'
import { Stats } from './components/Stats'
import { LoginPage } from './components/LoginPage'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { useJobs } from './hooks/useJobs'
import { isConfigured } from './lib/supabase'
import { STATUSES, type Status } from './types'

type Sort = 'recent' | 'oldest' | 'company'
type FormState = { open: false } | { open: true; jobId: number | null }

function MissingConfig() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-center text-white">
      <div>
        <h1 className="text-xl font-bold">Configuração ausente</h1>
        <p className="mt-2 max-w-md text-sm text-slate-300">Copie .env.example para .env.local e informe as credenciais publicáveis do Supabase.</p>
      </div>
    </main>
  )
}

export default function App() {
  if (!isConfigured) return <MissingConfig />
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  )
}

function AuthGate() {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-[#f7f8fc]" />
  return user ? <Dashboard /> : <LoginPage />
}

function Dashboard() {
  const { jobs, save, remove, move } = useJobs()
  const [activeStatus, setActiveStatus] = useState<Status | 'Todas'>('Todas')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<Sort>('recent')
  const [form, setForm] = useState<FormState>({ open: false })
  const [detailsId, setDetailsId] = useState<number | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return jobs
      .filter(j => (activeStatus === 'Todas' || j.status === activeStatus) && `${j.title} ${j.company}`.toLowerCase().includes(q))
      .sort((a, b) => sort === 'company' ? a.company.localeCompare(b.company) : sort === 'oldest' ? a.applied_date.localeCompare(b.applied_date) : b.applied_date.localeCompare(a.applied_date))
  }, [jobs, activeStatus, query, sort])

  const detailsJob = jobs.find(j => j.id === detailsId) ?? null
  const formJob = form.open ? jobs.find(j => j.id === form.jobId) ?? null : null

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-800">
      <main className="min-w-0">
        <Header />
        <div className="mx-auto max-w-[1400px] space-y-8 p-5 sm:p-8">
          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium text-indigo-600">Seu painel de carreira</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Acompanhe suas candidaturas</h2>
              <p className="mt-2 text-sm text-slate-500">Tenha clareza sobre cada oportunidade e o próximo passo.</p>
            </div>
            <button onClick={() => setForm({ open: true, jobId: null })} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700">
              <Plus className="h-4 w-4" /> Nova candidatura
            </button>
          </section>

          <Stats jobs={jobs} />

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-bold text-slate-900">Suas oportunidades</h3>
                <p className="mt-1 text-xs text-slate-400">{filtered.length} de {jobs.length} candidaturas</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar vaga..." className="h-9 w-44 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
                </div>
                <select value={sort} onChange={e => setSort(e.target.value as Sort)} className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-600 outline-none focus:border-indigo-400">
                  <option value="recent">Mais recentes</option>
                  <option value="oldest">Mais antigas</option>
                  <option value="company">Empresa (A-Z)</option>
                </select>
              </div>
            </div>

            <div className="scrollbar-none flex gap-5 overflow-x-auto border-b border-slate-100">
              {(['Todas', ...STATUSES] as const).map(status => (
                <button key={status} onClick={() => setActiveStatus(status)} className={`relative whitespace-nowrap py-4 text-xs font-semibold transition ${activeStatus === status ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-700'}`}>
                  {status}
                  {status === 'Todas' && <span className="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">{jobs.length}</span>}
                  {activeStatus === status && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-indigo-600" />}
                </button>
              ))}
            </div>

            <KanbanBoard jobs={filtered} activeStatus={activeStatus} onOpen={setDetailsId} onDelete={setDeleteId} onMove={move} />
          </section>
        </div>
      </main>

      {form.open && <JobFormModal key={form.jobId ?? 'new'} job={formJob} onClose={() => setForm({ open: false })} onSave={save} />}
      {detailsJob && (
        <JobDetailsModal job={detailsJob} onClose={() => setDetailsId(null)} onEdit={() => { setDetailsId(null); setForm({ open: true, jobId: detailsJob.id }) }} />
      )}
      {deleteId !== null && (
        <ConfirmDeleteModal onCancel={() => setDeleteId(null)} onConfirm={() => { const id = deleteId; setDeleteId(null); void remove(id) }} />
      )}
    </div>
  )
}
