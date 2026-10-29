import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_KEY

// Tudo com prefixo VITE_ vai para o bundle público: só a chave publicável pode estar aqui.
function isPrivilegedKey(value: string) {
  if (value.startsWith('sb_secret_')) return true
  try {
    const payload = JSON.parse(atob(value.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return payload.role === 'service_role'
  } catch {
    return false
  }
}

if (key && isPrivilegedKey(key)) {
  throw new Error('VITE_SUPABASE_KEY contém uma chave privada (service_role/secret). Use apenas a chave publicável e revogue esta.')
}

export const isConfigured = Boolean(url && key)

export const supabase = createClient(url ?? 'http://localhost', key ?? 'missing')
