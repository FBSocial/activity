import clsx from 'clsx'
import React from 'react'

/**
 * StickyButton 组件
 *
 * 这个组件创建一个可点击的粘性按钮，可以自定义标签、样式和点击事件。
 *
 * @param {Object} props - 组件属性
 * @param {string} props.label - 按钮显示的文本
 * @param {string} props.className - 自定义的 CSS 类名
 * @param {Function} [props.onClick] - 点击按钮时触发的回调函数
 */
const StickyButton: React.FC<{
  label: string
  className?: string
  onClick?: () => void
}> = ({ label, className = '', onClick }) => {
  const baseClasses = 'w-6 cursor-pointer select-none rounded-l-lg border border-white/60 bg-black/50 py-[7px] text-center text-xs text-white'

  return (
    <div className={clsx(baseClasses, className)} onClick={onClick} role="button" tabIndex={0}>
      {label}
    </div>
  )
}

export default StickyButton
