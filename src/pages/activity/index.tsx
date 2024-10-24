import GameBg from '@/assets/images/activity/game/demo/lottery_bg.jpg'
import ActivitySkeleton from '@/components/ActivitySkeleton'
import DebugActionHeader from '@/components/debug/DebugActionHeader'
import { useActivityInfo } from '@/contexts/activity-info/ActivityInfoContext'
import useReport from '@/hooks/useReporter'
import { useEffect, useMemo } from 'react'
import SectionGame from './section-game'
import SectionMoreActivity from './section-more-activity'
import SectionStickyButton from './section-sticky-button'
import SectionTask from './section-task'

/**
 * 活动页面组件
 *
 * 实现了全屏背景色和可调整位置的大图布局
 * 使用兼容性更好的方式实现全屏背景，并确保背景色覆盖所有内容
 * 根据优先级动态调整内容渲染顺序，"更多活动"始终置底
 *
 * @returns {JSX.Element} 渲染的活动页面
 */
export function Component() {
  const { activityFullUrl, activityId, activityInfo } = useActivityInfo()
  const report = useReport()

  /**
   * 根据优先级排序的内容组件
   */
  const sortedContent = useMemo(() => {
    if (!activityInfo) return null

    const priority = activityInfo.priority || 0

    const contentComponents = [
      { component: <SectionGame />, type: 1 },
      { component: <SectionTask />, type: 2 },
    ]

    // 根据优先级调整顺序
    if (priority === 1 || priority === 2) {
      return contentComponents.sort((a, b) => (a.type === priority ? -1 : 1))
    }

    return contentComponents
  }, [activityInfo])

  useEffect(() => {
    if (activityInfo) {
      report({
        event_id: 'task_draw_actv',
        event_sub_id: 'actv_enter',
        ext_json: {
          actv_id: activityId,
          actv_url: activityFullUrl,
        },
      })
    }
  }, [activityFullUrl, activityId, activityInfo, report])

  const bgColor = useMemo(() => {
    if (!activityInfo) return '#ffffff'
    return activityInfo.bg_img_color || '#ffffff'
  }, [activityInfo])

  const mainBgImg = useMemo(() => {
    if (!activityInfo) return GameBg
    return activityInfo.header_img || GameBg
  }, [activityInfo])

  if (!activityInfo || !sortedContent) return <ActivitySkeleton />

  return (
    <div className="relative min-h-screen w-full p-safe" style={{ backgroundColor: bgColor }}>
      <div className="absolute left-0 top-0 w-full">
        <img src={mainBgImg} alt="背景图片" className="pointer-events-none h-auto w-full select-none" style={{ verticalAlign: 'top' }} />
      </div>
      <div className="relative z-10 p-safe">
        <DebugActionHeader />
        <div className="relative flex w-full px-4 pt-[10rem]">
          <SectionStickyButton />
          {/* 内容容器 */}
          <div className="flex w-full flex-col gap-2">
            {sortedContent.map((item, index) => (
              <div key={index}>{item.component}</div>
            ))}
            {/* 更多活动始终置底 */}
            <SectionMoreActivity />
          </div>
        </div>
      </div>
    </div>
  )
}

Component.displayName = 'Activity'
