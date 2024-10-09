import { useParams } from 'react-router-dom'
import SectionGame from './section-game'
import SectionMoreActivity from './section-more-activity'
import SectionTask from './section-task'

/**
 * 活动页面组件
 *
 * 实现了全屏背景色和可调整位置的大图布局
 * 使用兼容性更好的方式实现全屏背景
 *
 * @returns {JSX.Element} 渲染的活动页面
 */
export function Component() {
  const { activityId } = useParams()

  return (
    <div className="relative h-screen p-4">
      {/* 全屏背景色 */}
      <div className="absolute inset-0 z-0 bg-red-100"></div>

      {/* 内容容器 */}
      <div className="relative z-10 flex h-full flex-col gap-y-[30px]">
        <SectionGame />
        <SectionTask />
        <SectionMoreActivity />
      </div>
    </div>
  )
}

Component.displayName = 'Activity'
