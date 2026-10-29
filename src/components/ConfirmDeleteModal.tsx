import { Trash2 } from 'lucide-react'
import { Modal } from './Modal'

interface Props {
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmDeleteModal({ onCancel, onConfirm }: Props) {
  return (
    <Modal onClose={onCancel} zIndex="z-40">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500"><Trash2 className="h-5 w-5" /></div>
        <h2 className="mt-4 text-lg font-bold text-slate-900">Excluir candidatura?</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">Essa ação removerá a candidatura do banco de dados e não poderá ser desfeita.</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50">Cancelar</button>
          <button onClick={onConfirm} className="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700">Excluir</button>
        </div>
      </div>
    </Modal>
  )
}
