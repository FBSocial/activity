import clsx from 'clsx'
import React from 'react'

interface ActionButtonProps {
  onClick: () => void
  disabled?: boolean
  text?: string
}

/**
 * ActionButton 组件
 *
 * @param onClick - 点击按钮时触发的函数
 * @param disabled - 是否禁用按钮，默认为 false
 * @param text - 按钮文本，如果未提供则根据禁用状态显示默认文本
 */
const ActionButton: React.FC<ActionButtonProps> = ({ onClick, disabled = false, text }) => {
  const buttonText = text || (disabled ? '已发放' : '复制')

  return (
    <button
      className={clsx(
        'flex items-start justify-center',
        'rounded-full border px-4 py-[3px] text-sm transition-colors duration-200',
        'min-h-[1.5rem] w-[4rem] whitespace-nowrap',
        {
          'border-orange bg-white text-orange': !disabled,
          'cursor-not-allowed border-neutral bg-white text-neutral': disabled,
        }
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {buttonText}
    </button>
  )
}

export default ActionButton
