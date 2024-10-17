import { useActivityInfo } from '@/contexts/activity-info/ActivityInfoContext'
import { getUserActivityParticipation } from '@/services/api/activity/user'
import { useCallback, useEffect, useMemo, useState } from 'react'
import SquaredPagerGame from './game/squared-pager'
import TheBigWheelArrowGame from './game/the-big-wheel-arrow'
export default function Component() {
  const { activityId, mode, activityInfo } = useActivityInfo()
  const [lotteryTimes, setLotteryTimes] = useState(0)

  const canPlay = useMemo(() => {
    return lotteryTimes > 0
  }, [lotteryTimes])

  const giftList = useMemo(() => {
    if (!activityInfo) return []
    if (activityInfo.template_type === 'squared_paper') {
      return activityInfo.gift.map(item => {
        const gift = item.gift
        return {
          id: gift.gift_id,
          name: gift.name,
          data: item,
        }
      })
    }
    if (activityInfo.template_type === 'the_big_wheel_arrow') {
      const list = activityInfo.gift.map((item, index) => {
        const gift = item.gift
        return {
          id: gift.gift_id,
          name: gift.name,
          img: gift.img,
          data: item,
        }
      })
      return list
    }

    return activityInfo.gift
  }, [activityInfo]) as any[]

  const getLotteryTimes = useCallback(() => {
    if (mode === 'normal' && activityId) {
      getUserActivityParticipation(activityId).then(res => {
        setLotteryTimes(res.remain_total)
      })
    }
  }, [mode, activityId])

  useEffect(() => {
    getLotteryTimes()
  }, [])

  if (!activityInfo) {
    return null
  }

  return (
    <div className="game-section mb-[1.88rem] flex items-center justify-center">
      <div className="flex flex-col gap-y-7">
        {activityInfo?.template_type === 'squared_paper' ?
          <SquaredPagerGame
            items={giftList}
            targetItem={3}
            canPlay={canPlay}
            startButtonImage={activityInfo?.draw_button_img}
            backgroundImage={activityInfo?.draw_img}
            onDrawComplete={item => {
              console.log('抽中了：', item, item.name)
              alert(`旋转结束，获得奖品：${item.name}`)
            }}
            // canPlay={false}
            onUnavailableClick={() => {
              if (lotteryTimes <= 0) {
                alert('抽奖次数不足，请先做任务')
              } else {
                alert('游戏不可用')
              }
            }}
          />
        : <TheBigWheelArrowGame
            segments={giftList}
            targetSegment={6}
            canPlay={canPlay}
            onSpinStart={() => console.log('开始旋转')}
            onSpinComplete={segment => {
              console.log('旋转结束，获得奖品：', segment.name)
              alert(`旋转结束，获得奖品：${segment.name}`)
            }}
            onSpinningClick={() => {
              // 在这里显示提示，例如：
              alert('游戏正在进行中，请稍候...')
              // 或者使用更友好的UI组件来显示提示
            }}
            onUnavailableClick={() => {
              if (lotteryTimes <= 0) {
                alert('抽奖次数不足，请先做任务')
              } else {
                alert('游戏不可用')
              }
            }}
          />
        }

        {mode === 'normal' && (
          <div className="lottery-times mt-[0.75rem] flex items-center justify-center">
            <div className="like-button flex items-center justify-center rounded-[6.25rem] bg-white bg-opacity-60 px-[1.5rem] py-[0.25rem]">
              <span className="text-sm text-navy">抽奖次数：</span>
              <span className="pl-[0.12rem] text-[1.25rem] leading-[1.75rem] text-orange">{lotteryTimes}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

Component.displayName = 'SectionGame'
