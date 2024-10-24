import Empty from '@/components/Empty'
import { useTitle } from 'ahooks'
import React from 'react'

/**
 * 活动不存在页面组件（移动端优化版）
 *
 * 这个组件用于显示当用户访问不存在的活动页面时的错误信息。
 * 它提供了一个简洁的界面，显示相关信息，并允许用户返回活动列表页。
 * 该版本针对移动端进行了优化，包括响应式字体大小和添加返回按钮。
 */
const ActivityNotFound: React.FC = () => {
  useTitle('活动不存在')
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-100 px-4 text-center">
      <Empty text="未找到活动" />
    </div>
  )
}

export default ActivityNotFound
