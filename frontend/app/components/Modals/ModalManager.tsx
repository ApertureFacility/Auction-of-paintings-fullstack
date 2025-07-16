'use client'

import { useModalStore } from '../../lib/modalStore'
import AuthModal from './AuthModal/AuthModal'
import ForgotPasswordModal from './ForgotPassModal/ForgotPassModal'

export default function ModalManager() {
  const { openModal, close } = useModalStore()

  return (
    <>
      <AuthModal isOpen={openModal === 'login'} onClose={close} />
      <ForgotPasswordModal isOpen={openModal === 'forgot-password'} onClose={close} />
    </>
  )
}
