import clsx from 'clsx'
import React, { useMemo } from 'react'

interface StickyButtonProps {
  label: string
  className?: string
  onClick?: () => void
  disabled?: boolean
  position?: 'left' | 'right'
  positionType?: 'absolute' | 'fixed'
  top?: string
  bottom?: string
}

/**
 * StickyButton 组件
 *
 * 创建一个可点击的粘性按钮，可以贴在左边或右边，并可以自定义标签、样式、定位方式、位置和点击事件。
 */
const StickyButton: React.FC<StickyButtonProps> = ({
  label,
  className = '',
  onClick,
  disabled = false,
  position = 'right',
  positionType = 'absolute',
  top,
  bottom,
}) => {
  const baseClasses = useMemo(() => {
    return `w-6 cursor-pointer select-none border border-white/60 bg-black/50 py-[7px] text-center text-xs text-white z-10 ${positionType}`
  }, [positionType])

  const positionClasses = useMemo(() => {
    return position === 'left' ? 'left-0 rounded-r-lg' : 'right-0 rounded-l-lg'
  }, [position])

  const verticalPositionStyle = useMemo(() => {
    if (top !== undefined) return { top }
    if (bottom !== undefined) return { bottom }
    return { top: '50%', transform: 'translateY(-50%)' }
  }, [top, bottom])

  const disabledClasses = 'opacity-50 cursor-not-allowed'

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick?.()
    }
  }

  const stickyButtonClasses = useMemo(() => {
    return clsx([baseClasses, positionClasses, className, disabled && disabledClasses])
  }, [baseClasses, positionClasses, className, disabled])

  return (
    <div
      className={stickyButtonClasses}
      style={verticalPositionStyle}
      onClick={disabled ? undefined : onClick}
      onKeyDown={disabled ? undefined : handleKeyDown}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
    >
      {label}
    </div>
  )
}

export default StickyButton
