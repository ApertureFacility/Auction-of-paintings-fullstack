// lib/modalStore.ts
import { create } from 'zustand'

type ModalType = 'login' | 'forgot-password' | 'registration' | 'image-zoom' | 'congratsBig' | null

interface ModalStore {
  openModal: ModalType
  modalData?: any
  open: (modalName: ModalType, data?: any) => void
  close: () => void
}

export const useModalStore = create<ModalStore>((set) => ({
  openModal: null,
  modalData: null,
  open: (modalName, data) => set({ openModal: modalName, modalData: data }),
  close: () => set({ openModal: null, modalData: null }),
}))