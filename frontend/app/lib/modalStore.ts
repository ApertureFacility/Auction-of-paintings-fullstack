
import { create } from 'zustand'

type ModalType = 'login' | 'forgot-password' | null

interface ModalStore {
  openModal: ModalType
  open: (modalName: ModalType) => void
  close: () => void
}

export const useModalStore = create<ModalStore>((set) => ({
  openModal: null,
  open: (modalName) => set({ openModal: modalName }),
  close: () => set({ openModal: null }),
}))
