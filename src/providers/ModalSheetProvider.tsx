import SheetHeader from '@/components/SheetHeader'
import React, { createContext, useCallback, useContext, useState } from 'react'
import { Sheet } from 'react-modal-sheet'

/**
 * ModalSheet 配置接口
 * @template T - 回调数据的类型
 */
interface ModalSheetConfig<T> {
  /**
   * ModalSheet 的标题
   */
  title: string
  /**
   * ModalSheet 的内容组件或函数组件
   */
  content: React.ReactNode | React.ComponentType<ModalSheetContentProps<T>>
  /**
   * 可选的 Sheet 类名
   */
  sheetClassName?: string
  /**
   * 可选的容器类名
   */
  containerClassName?: string
  /**
   * 可选的关闭回调函数
   */
  onCloseCallback?: () => void
}

/**
 * ModalSheet 内容属性接口
 * @template T - 回调数据的类型
 */
interface ModalSheetContentProps<T = unknown> {
  /**
   * 关闭 ModalSheet 的回调函数
   */
  onClose: () => void
  /**
   * 可选的回调函数，用于传递数据
   * @param data - 要传递的数据
   */
  onCallback?: (data: T) => void
}

/**
 * ModalSheet 上下文接口
 */
interface ModalSheetContextType {
  /**
   * 打开 ModalSheet
   * @template T - 回调数据的类型
   * @param config - ModalSheet 配置
   */
  openModalSheet: <T>(config: ModalSheetConfig<T>) => void
  /**
   * 关闭 ModalSheet
   */
  closeModalSheet: () => void
}

/**
 * ModalSheet 上下文
 */
const ModalSheetContext = createContext<ModalSheetContextType | undefined>(undefined)

/**
 * ModalSheet Provider 组件
 * @param props - 组件属性
 * @param props.children - 子组件
 */
export const ModalSheetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<ModalSheetConfig<Record<string, unknown>>>({ title: '', content: null })

  const closeModalSheet = useCallback(() => {
    setIsOpen(false)
    if (config.onCloseCallback) {
      config.onCloseCallback()
    }
  }, [config])

  const openModalSheet = useCallback<ModalSheetContextType['openModalSheet']>(newConfig => {
    setConfig(newConfig as ModalSheetConfig<Record<string, unknown>>)
    setIsOpen(true)
  }, [])

  const renderContent = () => {
    if (React.isValidElement(config.content)) {
      return config.content
    } else if (typeof config.content === 'function') {
      const ContentComponent = config.content as React.ComponentType<ModalSheetContentProps>
      return <ContentComponent onClose={closeModalSheet} />
    }
    return null
  }

  return (
    <ModalSheetContext.Provider value={{ openModalSheet, closeModalSheet }}>
      {children}
      <Sheet
        isOpen={isOpen}
        onClose={closeModalSheet}
        detent="content-height"
        style={{
          overscrollBehavior: 'contain',
          paddingBottom: 0,
          zIndex: 49,
        }}
        className={`p-safe ${config.sheetClassName || ''}`}
      >
        <Sheet.Container className={`z-50 h-[60vh] pb-safe ${config.containerClassName || ''}`}>
          <SheetHeader title={config.title} onClose={closeModalSheet} />
          <Sheet.Content>{renderContent()}</Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={closeModalSheet} />
      </Sheet>
    </ModalSheetContext.Provider>
  )
}

/**
 * 使用 ModalSheet 的自定义 Hook
 * @returns ModalSheet 上下文
 * @throws 如果在 ModalSheetProvider 外部使用，则抛出错误
 */
export const useModalSheet = (): ModalSheetContextType => {
  const context = useContext(ModalSheetContext)
  if (context === undefined) {
    throw new Error('useModalSheet 必须在 ModalSheetProvider 内部使用')
  }
  return context
}
