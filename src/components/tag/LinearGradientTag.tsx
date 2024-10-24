import clsx from 'clsx'
import React from 'react'

interface LinearGradientTagProps {
  /**
   * 标签文本
   */
  text: string
  /**
   * 渐变起始颜色
   */
  startColor?: string
  /**
   * 渐变结束颜色
   */
  endColor?: string
  /**
   * 自定义类名
   */
  className?: string
}

/**
 * 线性渐变标签组件
 *
 * @param props - 组件属性
 * @returns 渲染的标签组件
 */
export const LinearGradientTag: React.FC<LinearGradientTagProps> = ({ text, startColor = '#FBC05A', endColor = '#FE9A05', className }) => {
  const gradientStyle = {
    background: `linear-gradient(90deg, ${startColor} 5%, ${endColor} 100%)`,
  }

  return (
    <span
      className={clsx(
        'inline-flex flex-col items-center justify-center',
        'min-w-[59px]',
        'rounded-[6px_6px_6px_1px]',
        'text-xxs text-white',
        'px-1 py-[1px]',
        'whitespace-nowrap',
        className
      )}
      style={gradientStyle}
    >
      {text}
    </span>
  )
}
