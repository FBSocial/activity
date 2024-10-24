import clsx from 'clsx'
import React, { useMemo } from 'react'

/**
 * 按钮状态类型
 */
type ButtonStatus = 'default' | 'disabled' | 'completed'

/**
 * 状态文本配置接口
 */
interface StatusTextConfig {
  default: string
  disabled: string
  completed: string
}

/**
 * 状态样式配置接口
 */
interface StatusStyleConfig {
  backgroundColor: string
  textColor: string
}

/**
 * TaskClickButton 组件的属性接口
 */
interface TaskClickButtonProps {
  /**
   * 按钮文本，如果提供则覆盖默认的状态文本
   */
  text?: string
  /**
   * 按钮状态
   */
  status: ButtonStatus
  /**
   * 状态文本配置，可以覆盖默认的状态文本
   */
  statusTextConfig?: Partial<StatusTextConfig>
  /**
   * 状态样式配置，可以覆盖默认的状态样式
   */
  statusStyleConfig?: Partial<Record<ButtonStatus, StatusStyleConfig>>
  /**
   * 点击事件处理函数
   */
  onClick?: () => void
  /**
   * 自定义类名
   */
  className?: string
  /**
   * 自定义样式
   */
  style?: React.CSSProperties
  /**
   * 是否禁用按钮
   */
  disabled?: boolean
}

/**
 * 默认状态文本配置
 */
const DEFAULT_STATUS_TEXT: StatusTextConfig = {
  default: '去完成',
  disabled: '已领取',
  completed: '待领取',
}

/**
 * 默认状态样式配置
 */
const DEFAULT_STATUS_STYLE: Record<ButtonStatus, StatusStyleConfig> = {
  default: { backgroundColor: 'bg-orange', textColor: 'text-white' },
  disabled: { backgroundColor: 'bg-yellow-light', textColor: 'text-orange' },
  completed: { backgroundColor: 'bg-yellow-light', textColor: 'text-orange' },
}

/**
 * TaskClickButton 组件
 *
 * 这是一个灵活的按钮组件，可以根据不同的状态显示不同的样式和文本。
 * 支持自定义状态文本配置和样式配置。
 *
 * @param props - 组件属性
 * @returns 渲染的按钮组件
 */
export const TaskClickButton: React.FC<TaskClickButtonProps> = ({
  text,
  status = 'default',
  statusTextConfig,
  statusStyleConfig,
  onClick,
  className,
  style,
  disabled: propDisabled,
}) => {
  const isDisabled = useMemo(() => propDisabled || status === 'disabled', [propDisabled, status])

  const mergedStatusTextConfig = useMemo(
    () => ({
      ...DEFAULT_STATUS_TEXT,
      ...statusTextConfig,
    }),
    [statusTextConfig]
  )

  const mergedStatusStyleConfig = useMemo(
    () => ({
      ...DEFAULT_STATUS_STYLE,
      ...statusStyleConfig,
    }),
    [statusStyleConfig]
  )

  const statusText = useMemo(() => text || mergedStatusTextConfig[status], [text, mergedStatusTextConfig, status])
  const statusStyle = useMemo(() => mergedStatusStyleConfig[status], [mergedStatusStyleConfig, status])

  return (
    <button
      className={clsx(
        'flex flex-row items-center justify-center',
        'min-h-[28px] min-w-[72px]',
        'rounded-full',
        'text-xxs',
        'px-4 py-1.5',
        'transition-colors duration-300 ease-in-out',
        statusStyle.backgroundColor,
        statusStyle.textColor,
        { 'cursor-not-allowed opacity-50': isDisabled },
        className
      )}
      style={style}
      onClick={!isDisabled ? onClick : undefined}
      disabled={isDisabled}
    >
      {statusText}
    </button>
  )
}
