import React from 'react'

/**
 * 全屏柔和骨架屏组件
 *
 * 用于在页面内容加载时显示全屏占位效果，提供柔和的动画，提高用户体验
 *
 * @returns {JSX.Element} 渲染的全屏骨架屏组件
 */
const ActivitySkeleton: React.FC = () => {
  return (
    <div className="fixed inset-0 animate-pulse bg-gray-100">
      <div className="flex h-full w-full flex-col">
        {/* 顶部区域占位 */}
        <div className="h-1/4 bg-gray-200"></div>

        {/* 中间内容区域占位 */}
        <div className="flex-grow space-y-4 p-4">
          {/* 多个占位块 */}
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="h-16 rounded-md bg-gray-200"
              style={{
                opacity: 1 - index * 0.15, // 渐变效果
              }}
            ></div>
          ))}
        </div>

        {/* 底部区域占位 */}
        <div className="h-1/6 bg-gray-200"></div>
      </div>
    </div>
  )
}

export default ActivitySkeleton
