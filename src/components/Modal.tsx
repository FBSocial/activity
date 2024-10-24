import clsx from 'clsx'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactDOM from 'react-dom'

/**
 * Modal 组件的属性接口
 * @interface ModalProps
 */
export interface ModalProps {
  /** 是否显示 Modal */
  isOpen?: boolean
  /** Modal 打开时的回调函数 */
  onOpen?: () => void
  /** Modal 关闭时的回调函数 */
  onClose?: () => void
  /** Modal 的标题，可以是字符串、React 节点或返回 React 节点的函数 */
  title?: React.ReactNode | (() => React.ReactNode)
  /** Modal 的内容 */
  children?: React.ReactNode
  /** Modal 的底部内容，可以是 React 节点或返回 React 节点的函数 */
  footer?: React.ReactNode | (() => React.ReactNode)
  /** 自定义类名 */
  className?: string
  /** Modal 的顶部偏移量，可以是数字（像素）或字符串（CSS 值） */
  topOffset?: number | string
  /** 是否允许点击遮罩层关闭 Modal */
  closeOnOverlayClick?: boolean
  /** Modal 的背景图，可以是 URL 字符串或通过 Vite 导入的图片 */
  backgroundImage?: string | { default: string }
  /** Modal 的唯一识别 */
  id?: string
  /** 自定义 UI 组件 */
  ui?: {
    title?: React.ReactNode
    content?: React.ReactNode
    footer?: React.ReactNode
  }
  /** 自定义容器类名 */
  containerClassName?: string
  /** 自定义模态框类名 */
  modalClassName?: string
}

/**
 * 全局 Modal 计数器和 ID 映射
 */
let modalCounter = 0
const modalIds = new Map<string, number>()

/**
 * 生成唯一的 Modal ID
 * @returns {string} 唯一的 Modal ID
 */
function generateUniqueId(): string {
  return `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Modal 组件
 *
 * 这是一个适用于移动端的高可用 Modal 组件，支持受控和非受控模式。
 * 支持多实例，每个实例的 z-index 会递增，确保后打开的 Modal 显示在上层。
 *
 * @param {ModalProps} props - 组件属性
 * @returns {JSX.Element | null} Modal 组件或 null
 */
const Modal: React.FC<ModalProps> = ({
  id: propId,
  isOpen: isOpenProp,
  onOpen,
  onClose,
  title,
  children,
  footer,
  className,
  topOffset,
  closeOnOverlayClick = true,
  backgroundImage,
  ui,
  containerClassName: propContainerClassName,
  modalClassName: propModalClassName,
}) => {
  const [isOpen, setIsOpen] = useState(isOpenProp || false)
  const zIndexRef = useRef(0)
  const idRef = useRef<string>(propId || generateUniqueId())

  /**
   * 处理 Modal 的打开和关闭
   */
  useEffect(() => {
    if (typeof isOpenProp !== 'undefined') {
      setIsOpen(isOpenProp)
      if (isOpenProp) {
        if (!modalIds.has(idRef.current)) {
          modalCounter++
          modalIds.set(idRef.current, modalCounter)
        }
        zIndexRef.current = 1000 + modalIds.get(idRef.current)! // 基础 z-index 为 1000
        onOpen?.()
      } else if (!isOpenProp && modalIds.has(idRef.current)) {
        onClose?.()
        modalIds.delete(idRef.current)
      }
    }
  }, [isOpenProp, onOpen, onClose])

  /**
   * 处理 Modal 关闭
   */
  const handleClose = useCallback(() => {
    onClose?.()
    setIsOpen(false)
    modalIds.delete(idRef.current)
  }, [onClose])

  /**
   * 处理遮罩层点击
   */
  const handleOverlayClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault() // 阻止默认行为
      event.stopPropagation() // 阻止事件冒泡
      if (closeOnOverlayClick && event.target === event.currentTarget) {
        handleClose()
      }
    },
    [closeOnOverlayClick, handleClose]
  )

  /**
   * 处理 Modal 内容区域的点击
   */
  const handleModalClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation() // 阻止事件冒泡
  }, [])

  /**
   * 处理 ESC 键关闭 Modal 和禁止背景滚动
   */
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    const preventScroll = (event: TouchEvent) => {
      event.preventDefault() // 阻止默认的滚动行为
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      document.body.addEventListener('touchmove', preventScroll, { passive: false })
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
      document.body.removeEventListener('touchmove', preventScroll)
    }
  }, [isOpen, handleClose])

  /**
   * 计算 Modal 的样式和类名
   */
  const { modalClassName, modalStyle, containerClassName } = useMemo(() => {
    const baseModalClassName = ''
    const style: React.CSSProperties = {
      position: 'relative',
      overflow: 'hidden',
      zIndex: 50 + zIndexRef.current,
    }
    let baseContainerClassName = 'fixed inset-0 flex justify-center overflow-y-auto bg-black bg-opacity-70'

    if (backgroundImage) {
      const imageUrl = typeof backgroundImage === 'string' ? backgroundImage : backgroundImage.default
      style.backgroundImage = `url(${imageUrl})`
      style.backgroundSize = 'cover'
      style.backgroundPosition = 'center'
      style.backgroundRepeat = 'no-repeat'
    } else {
      style.backgroundColor = 'white'
    }

    if (topOffset !== undefined) {
      style.marginTop = typeof topOffset === 'number' ? `${topOffset}px` : topOffset
      baseContainerClassName += ' items-start'
    } else {
      baseContainerClassName += ' items-center'
    }

    return {
      modalClassName: clsx([baseModalClassName, 'w-[18.75rem]', propModalClassName]),
      modalStyle: style,
      containerClassName: clsx([baseContainerClassName, propContainerClassName, className]),
    }
  }, [backgroundImage, topOffset, propModalClassName, propContainerClassName, className])

  /**
   * 组件卸载时清理
   */
  useEffect(() => {
    return () => {
      modalIds.delete(idRef.current)
    }
  }, [])

  if (!isOpen) {
    return null
  }

  /**
   * 渲染 Modal 标题
   * @param {React.ReactNode | (() => React.ReactNode)} title - Modal 标题
   * @returns {JSX.Element} 渲染后的标题元素
   */
  const renderTitle = (title: React.ReactNode | (() => React.ReactNode)) => {
    if (ui?.title) {
      return ui.title
    }
    if (typeof title === 'function') {
      return title()
    }
    if (typeof title === 'string') {
      return <h2 className="text-xl font-bold">{title}</h2>
    }
    return title
  }

  return ReactDOM.createPortal(
    <div className={containerClassName} onClick={handleOverlayClick} style={{ zIndex: zIndexRef.current }} onTouchMove={e => e.preventDefault()}>
      <div
        className={modalClassName}
        style={modalStyle}
        data-modal-id={idRef.current}
        onClick={handleModalClick}
        onTouchMove={e => e.stopPropagation()}
      >
        {(title || ui?.title) && (
          <>
            {ui?.title ?
              React.cloneElement(ui.title as React.ReactElement, { title })
            : <div className="mb-4 border-b border-gray-200 pb-2">{renderTitle(title)} </div>}
          </>
        )}
        {ui?.content ? ui.content : <div>{children}</div>}
        {ui?.footer ? ui.footer : <div>{ui?.footer || (typeof footer === 'function' ? footer() : footer)}</div>}
      </div>
    </div>,
    document.body
  )
}

export default Modal
