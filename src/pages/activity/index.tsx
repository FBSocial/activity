import GiftImg from '@/assets/images/activity/game/demo/gift.png'
import GameBg from '@/assets/images/activity/game/demo/lottery_bg.jpg'
import DebugActionHeader from '@/components/debug/DebugActionHeader'
import { useActivityInfo } from '@/contexts/activity-info/ActivityInfoContext'
import { useGiftModal } from '@/hooks/useGiftModal'
import useReport from '@/hooks/useReporter'
import { useEffect } from 'react'
import SectionGame from './section-game'
import SectionMoreActivity from './section-more-activity'
import SectionStickyButton from './section-sticky-button'
import SectionTask from './section-task'

/**
 * 活动页面组件
 *
 * 实现了全屏背景色和可调整位置的大图布局
 * 使用兼容性更好的方式实现全屏背景，并确保背景色覆盖所有内容
 *
 * @returns {JSX.Element} 渲染的活动页面
 */
export function Component() {
  const { activityId, mode } = useActivityInfo()
  const report = useReport()
  const { openGiftModal } = useGiftModal()

  useEffect(() => {
    report({
      event_id: 'activity_view',
    })
  }, [])

  const handleOpenGiftModal = (state: 'loading' | 'normal' | 'claim') => {
    openGiftModal({
      giftName: '神秘宝箱',
      giftImage: GiftImg,
      giftDescription: '奖品需要到Fanbook客户端领取 快去领取吧!',
      state,
      redeemCode: '123456',
    })
  }

  return (
    <div className="relative min-h-screen bg-red-100 p-safe">
      <DebugActionHeader />
      <div
        className="absolute left-0 top-0 min-h-[40.5rem] w-full min-w-[24.38rem]"
        style={{
          backgroundImage: `url(${GameBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>
      <div className="relative px-4 pt-[10rem]">
        <SectionStickyButton />
        {/* 内容容器 */}
        <div className="flex flex-col justify-center gap-2">
          <SectionGame />
          <SectionTask />
          <SectionMoreActivity />

          <button type="button" onClick={() => handleOpenGiftModal('loading')} className="rounded bg-blue-500 p-2 text-white">
            打开奖励弹窗[加载态]
          </button>
          <button type="button" onClick={() => handleOpenGiftModal('normal')} className="rounded bg-blue-500 p-2 text-white">
            打开奖励弹窗[正常态]
          </button>
          <button type="button" onClick={() => handleOpenGiftModal('claim')} className="rounded bg-blue-500 p-2 text-white">
            打开奖励弹窗[领取态]
          </button>
        </div>
      </div>
    </div>
  )
}

Component.displayName = 'Activity'
