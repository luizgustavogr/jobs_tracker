import { useEffect, useState } from 'react'
import { Bell, BriefcaseBusiness, ChevronDown } from 'lucide-react'
import { formatToday } from '../lib/format'

export function Header() {
  const [today, setToday] = useState(formatToday)

  useEffect(() => {
    const id = setInterval(() => setToday(formatToday()), 60000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white"><BriefcaseBusiness className="h-4 w-4" /></div>
        <span className="font-bold text-slate-900">jobflow<span className="text-indigo-600">.</span></span>
      </div>
      <div className="hidden sm:block">
        <p className="text-xs font-medium text-slate-400">{today}</p>
        <h1 className="mt-1 text-lg font-bold text-slate-900">Olá, Luiz Gustavo! <span aria-hidden="true">👋</span></h1>
      </div>
      <div className="flex items-center gap-3">
        <button className="rounded-xl p-2.5 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700" aria-label="Notificações"><Bell className="h-5 w-5" /></button>
        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">GF</div>
          <span className="hidden text-sm font-semibold text-slate-700 sm:block">Luiz Gustavo!</span>
          <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
        </div>
      </div>
    </header>
  )
}
