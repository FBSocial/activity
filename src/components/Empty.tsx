import EmptyPng from '@/assets/images/empty.png'
import React from 'react'

/**
 * Empty 组件属性接口
 */
interface EmptyProps {
  /**
   * 自定义图片源
   */
  image?: string
  /**
   * 自定义图片大小
   */
  imageSize?: { width: string; height: string }
  /**
   * 自定义文本
   */
  text?: string
  /**
   * 自定义样式类名
   */
  className?: string
  /**
   * 自定义子元素
   */
  children?: React.ReactNode
}

/**
 * Empty 组件
 * 用于显示空状态的可配置组件
 */
export default function Empty({
  image = EmptyPng,
  imageSize = { width: '120px', height: '120px' },
  text = '暂无数据',
  className = '',
  children,
}: EmptyProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <img
        src={image}
        alt="empty"
        className="pointer-events-none block"
        style={{ width: imageSize.width, height: imageSize.height }}
        loading="lazy"
      />
      <p className="mt-4 flex items-center justify-center text-sm text-slate">{text}</p>
      {children}
    </div>
  )
}
