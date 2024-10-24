import { useActivityInfo } from '@/contexts/activity-info/ActivityInfoContext'
import { useOpenInstallContext } from '@/contexts/open-install/OpenInstallContext'
import useGiftModal, { GiftModalAction, GiftModalState } from '@/hooks/useGiftModal'
import useReport from '@/hooks/useReporter'
import { getLotteryResult, type LotteryGift } from '@/services/api/activity/lottery'
import FbApi from '@/services/FbApi'
import { inFanbook } from '@/utils'
import { useCallback, useMemo, useRef } from 'react'
import SquaredPagerGame from './game/squared-pager'
import TheBigWheelArrowGame from './game/the-big-wheel-arrow'

/**
 * 游戏组件
 * 处理抽奖逻辑和展示游戏界面
 */
export default function SectionGame() {
  const { activityId, mode, activityInfo, lotteryTimes, updateLotteryTimes, activityFullUrl } = useActivityInfo()
  const lotteryResultRef = useRef<LotteryGift | null>(null)
  const { openGiftModal } = useGiftModal()
  const { openFanbook } = useOpenInstallContext()
  const report = useReport()

  const canPlay = useMemo(() => mode === 'normal' && lotteryTimes > 0, [lotteryTimes, mode])

  const giftList = useMemo<any[]>(() => {
    if (!activityInfo) return []

    switch (activityInfo.template_type) {
      case 'squared_paper':
        return activityInfo.gift.map(item => {
          const gift = item.gift
          return {
            id: gift.gift_id,
            name: gift.name,
            image: gift.img,
            data: item,
            display: true,
          }
        })
      case 'the_big_wheel':
        return activityInfo.gift.map(item => {
          const gift = item.gift
          return {
            id: gift.gift_id,
            name: gift.name,
            image: gift.img,
            data: item,
          }
        })
      default:
        return []
    }
  }, [activityInfo])

  const handleDrawComplete = useCallback(
    (item: any) => {
      console.log('抽中了：', item)
      const isInFanbook = inFanbook()
      const result = lotteryResultRef.current

      if (result) {
        const state =
          result.gift_type === 0 ? GiftModalState.Regret
          : !isInFanbook ? GiftModalState.Claim
          : GiftModalState.Normal

        openGiftModal(
          {
            giftName: result.gift_name,
            giftImage: result.gift_img,
            state,
            redeemCode: result.cd_key,
            onAction: (action, code) => {
              if (isInFanbook) {
                if (action === GiftModalAction.Copy && code) {
                  FbApi.setClipboardData(code)
                }
              } else {
                openFanbook({ path: `/activity/${activityId}` })
              }
            },
          },
          {
            onOpen: () => console.log('礼物弹窗已打开'),
            onClose: () => {
              console.log('礼物弹窗已关闭')

              lotteryResultRef.current = null
            },
          }
        )
      }
    },
    [activityId, openGiftModal, openFanbook]
  )

  const getTargetItem = useCallback(async () => {
    const result = await getLotteryResult(Number(activityId))
    updateLotteryTimes()
    lotteryResultRef.current = result
    const targetIndex = giftList.findIndex(item => item.id === result.gift_id)
    console.log('%c Line:101 🥓 targetIndex', 'color:#6ec1c2', targetIndex)
    return targetIndex
  }, [activityId, giftList, updateLotteryTimes])

  const handleUnavailableClick = useCallback(() => {
    if (lotteryTimes <= 0) {
      openGiftModal({ state: GiftModalState.Tip })
    } else {
      console.warn('游戏不可用')
    }
  }, [lotteryTimes, openGiftModal])

  const handleReportDrawClick = useCallback(() => {
    report({
      event_id: 'task_draw_actv',
      event_sub_id: 'actv_draw_click',
      ext_json: {
        actv_id: activityId,
        actv_url: activityFullUrl,
      },
    })
  }, [report, activityId, activityFullUrl])

  if (!activityInfo) {
    return null
  }

  return (
    <div className="game-section mb-[1.88rem] flex items-center justify-center">
      <div className="flex flex-col gap-y-7">
        {activityInfo.template_type === 'squared_paper' ?
          <SquaredPagerGame
            items={giftList}
            onDrawStart={handleReportDrawClick}
            getTargetItem={getTargetItem}
            canPlay={canPlay}
            startButtonImage={activityInfo.draw_button_img}
            backgroundImage={activityInfo.draw_img}
            onDrawComplete={handleDrawComplete}
            onUnavailableClick={handleUnavailableClick}
          />
        : <TheBigWheelArrowGame
            items={giftList}
            getTargetSegment={getTargetItem}
            arrowImage={activityInfo.draw_button_img}
            backgroundImage={activityInfo.draw_img}
            canPlay={canPlay}
            onSpinStart={handleReportDrawClick}
            onSpinComplete={handleDrawComplete}
            onSpinningClick={() => console.log('游戏正在进行中，请稍候...')}
            onUnavailableClick={handleUnavailableClick}
          />
        }

        {mode !== 'guest' && (
          <div className="lottery-times mt-[0.75rem] flex select-none items-center justify-center">
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

SectionGame.displayName = 'SectionGame'
