import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Job, JobInput, Status } from '../types'

const TABLE = 'applications'

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([])

  const load = useCallback(async () => {
    const { data, error } = await supabase.from(TABLE).select('*').order('applied_date', { ascending: false })
    if (error) { alert(`Não foi possível carregar as candidaturas: ${error.message}`); return }
    setJobs((data as Job[]).map(job => ({ ...job, origin: job.origin || 'Brasileira' })))
  }, [])

  useEffect(() => { void load() }, [load])

  const save = useCallback(async (input: JobInput, id: number | null) => {
    const request = id === null
      ? supabase.from(TABLE).insert(input)
      : supabase.from(TABLE).update(input).eq('id', id)
    const { error } = await request
    if (error) { alert(`Não foi possível ${id === null ? 'salvar' : 'editar'} a candidatura: ${error.message}`); return false }
    await load()
    return true
  }, [load])

  const remove = useCallback(async (id: number) => {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) { alert(`Não foi possível excluir a candidatura: ${error.message}`); return }
    await load()
  }, [load])

  const move = useCallback(async (id: number, status: Status) => {
    let previous: Status | undefined
    setJobs(list => list.map(job => {
      if (job.id !== id) return job
      previous = job.status
      return { ...job, status }
    }))
    const { error } = await supabase.from(TABLE).update({ status }).eq('id', id)
    if (error) {
      setJobs(list => list.map(job => (job.id === id && previous ? { ...job, status: previous } : job)))
      alert(`Não foi possível atualizar a etapa: ${error.message}`)
    }
  }, [])

  return { jobs, save, remove, move }
}
