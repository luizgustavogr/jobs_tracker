import { useEffect, useState } from 'react'
import { BriefcaseBusiness, LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { formatToday } from '../lib/format'

export function Header() {
  const { user, signOut } = useAuth()
  const [today, setToday] = useState(formatToday)

  useEffect(() => {
    const id = setInterval(() => setToday(formatToday()), 60000)
    return () => clearInterval(id)
  }, [])

  const fullName: string = user?.user_metadata?.full_name ?? user?.email ?? ''
  const firstName = fullName.split(' ')[0]
  const avatarUrl: string | undefined = user?.user_metadata?.avatar_url
  const initials = fullName.split(' ').filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase()

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white"><BriefcaseBusiness className="h-4 w-4" /></div>
        <span className="font-bold text-slate-900">jobflow<span className="text-indigo-600">.</span></span>
      </div>
      <div className="hidden sm:block">
        <p className="text-xs font-medium text-slate-400">{today}</p>
        <h1 className="mt-1 text-lg font-bold text-slate-900">Olá, {firstName}! <span aria-hidden="true">👋</span></h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {avatarUrl
            ? <img src={avatarUrl} alt="" referrerPolicy="no-referrer" className="h-9 w-9 rounded-full" />
            : <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">{initials}</div>}
          <span className="hidden text-sm font-semibold text-slate-700 sm:block">{fullName}</span>
        </div>
        <button onClick={() => void signOut()} className="rounded-xl p-2.5 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700" aria-label="Sair" title="Sair"><LogOut className="h-5 w-5" /></button>
      </div>
    </header>
  )
}
