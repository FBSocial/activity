import React from 'react'

/**
 * 奖品列表骨架屏组件
 *
 * @param {number} count - 骨架项目的数量
 * @returns {JSX.Element}
 */
const PrizeListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex h-[85px] w-full items-center justify-between px-[1rem] py-[0.5rem]">
          <div className="flex-start flex flex-1 items-center">
            <div className="mr-3 h-[4.38rem] w-[4.38rem] rounded-lg bg-gray-200"></div>
            <div className="flex flex-1 justify-between border-b border-solid border-b-navy-light">
              <div className="flex-1 py-5">
                <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                <div className="mt-2 h-3 w-1/2 rounded bg-gray-200"></div>
              </div>
              <div className="ml-[1.25rem] flex min-w-[4rem] flex-shrink-0 items-center justify-center">
                <div className="h-8 w-16 rounded bg-gray-200"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PrizeListSkeleton
