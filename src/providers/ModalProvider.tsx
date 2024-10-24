import Modal, { type ModalProps } from '@/components/Modal'
import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react'

interface ModalCallbacks {
  onOpen?: () => void
  onClose?: () => void
}

interface ModalContextType {
  openModal: (options: ModalOptions, callbacks?: ModalCallbacks) => void
  closeModal: () => void
}

type ModalOptions = Omit<ModalProps, 'isOpen' | 'onClose'>

const ModalContext = createContext<ModalContextType | undefined>(undefined)

/**
 * Modal Provider 组件
 *
 * 提供全局的 Modal 管理功能
 *
 * @param {object} props - 组件属性
 * @param {ReactNode} props.children - 子组件
 */
export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [modalOptions, setModalOptions] = useState<ModalOptions | null>(null)
  const [callbacks, setCallbacks] = useState<ModalCallbacks>({})

  const openModal = useCallback((options: ModalOptions, newCallbacks: ModalCallbacks = {}) => {
    setModalOptions(options)
    setCallbacks(newCallbacks)
    setIsOpen(true)
    newCallbacks.onOpen?.()
  }, [])

  const closeModal = useCallback(() => {
    callbacks.onClose?.()
    setCallbacks({})
    setIsOpen(false)
    setModalOptions(null)
  }, [callbacks])

  const passProps = useMemo(
    () => ({
      ...modalOptions,
      isOpen,
      onClose: closeModal,
    }),
    [modalOptions, isOpen, closeModal]
  )

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal {...passProps}>{modalOptions?.children}</Modal>
    </ModalContext.Provider>
  )
}

/**
 * 使用 Modal 的自定义 Hook
 *
 * @returns {ModalContextType} Modal 操作函数
 */
export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}
