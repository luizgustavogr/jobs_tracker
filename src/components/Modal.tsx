import type { ReactNode } from 'react'

interface Props {
  onClose: () => void
  zIndex: string
  children: ReactNode
}

export function Modal({ onClose, zIndex, children }: Props) {
  return (
    <div
      className={`modal-backdrop fixed inset-0 ${zIndex} flex items-center justify-center p-4`}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      {children}
    </div>
  )
}
