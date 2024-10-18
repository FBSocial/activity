import { useActivityInfo } from '@/contexts/activity-info/ActivityInfoContext'
import useGiftModal from '@/hooks/useGiftModal'
import useReport from '@/hooks/useReporter'
import { getLotteryResult } from '@/services/api/activity/lottery'
import { useMemo, useState } from 'react'
import SquaredPagerGame from './game/squared-pager'
import TheBigWheelArrowGame from './game/the-big-wheel-arrow'

export default function Component() {
  const { activityId, mode, activityInfo, lotteryTimes, activityFullUrl } = useActivityInfo()
  const [targetSegment, setTargetSegment] = useState<number>(0)
  const [lotteryResult, setLotteryResult] = useState<any>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { openGiftModal } = useGiftModal()
  const report = useReport()

  const canPlay = useMemo(() => {
    if (mode !== 'normal') return false
    return lotteryTimes > 0
  }, [lotteryTimes, mode])

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

  if (!activityInfo) {
    return null
  }

  return (
    <div className="game-section mb-[1.88rem] flex items-center justify-center">
      <div className="flex flex-col gap-y-7">
        {activityInfo?.template_type === 'squared_paper' ?
          <SquaredPagerGame
            items={giftList}
            onDrawStart={() => {
              report({
                event_id: 'task_draw_actv',
                event_sub_id: 'actv_draw_click',
                ext_json: {
                  actv_id: activityId,
                  actv_url: activityFullUrl,
                },
              })
            }}
            getTargetItem={async () => {
              // 这里可以是一个API调用来获取中奖结果
              const result = await getLotteryResult(Number(activityId))
              setLotteryResult(result) // 保存抽奖结果
              console.log('%c Line:60 🧀 result', 'color:#ffdd4d', result)
              const winningIndex = giftList.findIndex(item => item.id === result.gift_id)
              console.log('%c Line:60 🍢 winningIndex', 'color:#6ec1c2', winningIndex)
              return winningIndex
            }}
            canPlay={canPlay}
            startButtonImage={activityInfo?.draw_button_img}
            backgroundImage={activityInfo?.draw_img}
            onDrawComplete={item => {
              console.log('抽中了：', item, item.name)
              if (lotteryResult) {
                openGiftModal(
                  {
                    giftName: lotteryResult.gift_name,
                    giftImage: lotteryResult.gift_img,
                    giftDescription: '奖品需要到Fanbook客户端领取 快去领取吧!',
                    state: 'normal',
                    redeemCode: lotteryResult.cdkey,
                  },
                  {
                    onOpen: () => {
                      console.log('onOpen')
                      // setLotteryResult(null)
                    },
                    onClose: () => {
                      console.log('onClose')
                      // setLotteryResult(null)
                    },
                  }
                )
              }
            }}
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
            targetSegment={targetSegment}
            canPlay={canPlay}
            onSpinComplete={segment => {
              console.log('旋转结束，获得奖品：', segment.name)
            }}
            onSpinningClick={() => {
              alert('游戏正在进行中，请稍候...')
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

        {mode !== 'guest' && (
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
