import React from 'react'

interface InviteRecordListSkeletonProps {
  count: number
}

/**
 * 邀请记录列表骨架屏组件
 * 用于显示邀请记录列表的加载状态
 *
 * @param {InviteRecordListSkeletonProps} props - 组件属性
 * @param {number} props.count - 要显示的骨架项目数量
 * @returns {JSX.Element} 骨架屏组件
 */
const InviteRecordListSkeleton: React.FC<InviteRecordListSkeletonProps> = ({ count }) => {
  return (
    <div className="animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex h-[85px] items-center justify-start py-[10px]">
          <div className="pl-4 pr-3">
            <div className="h-12 w-12 rounded-full bg-gray-200" />
          </div>
          <div className="flex-1 border-b border-solid border-b-navy-light py-5">
            <div className="h-5 w-1/3 rounded bg-gray-200" />
            <div className="mt-[0.25rem] h-4 w-1/4 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default InviteRecordListSkeleton
