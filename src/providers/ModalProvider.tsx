import Modal, { type ModalProps } from '@/components/Modal'
import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react'

interface ModalContextType {
  openModal: (options: ModalOptions) => void
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
  const [modalOptions, setModalOptions] = useState<ModalOptions | null>(null)

  const openModal = useCallback((options: ModalOptions) => {
    setModalOptions(options)
  }, [])

  const closeModal = useCallback(() => {
    setModalOptions(null)
  }, [])

  const passProps = useMemo(() => {
    if (modalOptions === null) {
      return { onClose: closeModal }
    }
    return {
      ...modalOptions,
      isOpen: !!modalOptions,
      onClose: closeModal,
    }
  }, [modalOptions, closeModal])

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal {...passProps}>{typeof modalOptions?.ui?.content === 'function' ? null : modalOptions?.children}</Modal>
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
