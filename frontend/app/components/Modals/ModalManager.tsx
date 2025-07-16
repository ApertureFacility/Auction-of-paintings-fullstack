'use client'

import { useModalStore } from '../../lib/modalStore'
import AuthModal from './AuthModal/AuthModal'
import ForgotPasswordModal from './ForgotPassModal/ForgotPassModal'
import RegistrationModal from './RegistrationModal/RegistrationModal'

export default function ModalManager() {
  const { openModal, close } = useModalStore()

  return (
    <>
    <RegistrationModal isOpen={openModal==='registration'} onClose={close}/>
      <AuthModal isOpen={openModal === 'login'} onClose={close} />
      <ForgotPasswordModal isOpen={openModal === 'forgot-password'} onClose={close} />
    </>
  )
}
