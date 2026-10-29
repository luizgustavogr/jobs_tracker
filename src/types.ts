export const STATUSES = ['Aplicado', 'Em análise', 'Entrevista', 'Entrevista RH', 'Entrevista Técnica', 'Entrevista Diretoria', 'Entrevista Cliente', 'Oferta'] as const
export type Status = (typeof STATUSES)[number]

export const ORIGINS = ['Brasileira', 'Gringa'] as const
export type Origin = (typeof ORIGINS)[number]

export interface Job {
  id: number
  title: string
  company: string
  location: string | null
  link: string | null
  description: string | null
  status: Status
  origin: Origin
  applied_date: string
}

export type JobInput = Omit<Job, 'id'>
