"use client"

import { useModalStore } from "../../../lib/modalStore"

export const ImageZoomModal = () => {
  const { openModal, modalData, close } = useModalStore()
  
  if (openModal !== 'image-zoom' || !modalData?.imageUrl) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }} onClick={close}>
      <img 
        src={modalData.imageUrl} 
        alt="Zoomed" 
        style={{
          maxWidth: '90vw',
          maxHeight: '90vh',
          objectFit: 'contain',
          borderRadius: '8px',
        }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}