import RewardCryImage from '@/assets/images/cry.png'
import GiftModalBgImg from '@/assets/images/modal/gift_modal_bg.png'
import GiftModalRegretBgImg from '@/assets/images/modal/gift_modal_regret_bg.png'
import GiftModalTipBgImg from '@/assets/images/modal/gift_modal_tip_bg.png'
import RewardLightImage from '@/assets/images/modal/light.svg'
import ImageButton, { ButtonLabel } from '@/components/button/ImageButton'
import { useModal } from '@/providers/ModalProvider'
import React, { useCallback, useMemo } from 'react'

/**
 * 礼物模态框状态枚举
 */
export enum GiftModalState {
  Normal = 'normal',
  Loading = 'loading',
  Claim = 'claim',
  Regret = 'regret',
  Tip = 'tip',
}

/**
 * 礼物模态框动作枚举
 */
export enum GiftModalAction {
  Claim = 'claim',
  Copy = 'copy',
}

/**
 * 礼物模态框内容的接口
 */
interface GiftModalContent {
  giftName?: string
  giftImage?: string
  giftDescription?: string
  state: GiftModalState
  redeemCode?: string
  onAction?: (action: GiftModalAction, code?: string) => void
  closeOnCopy?: boolean // 新增配置项
}

/**
 * 礼物模态框的自定义 Hook
 */
export const useGiftModal = () => {
  const { openModal, closeModal } = useModal()

  const getBackgroundImage = (state: GiftModalState): string => {
    switch (state) {
      case GiftModalState.Regret:
        return GiftModalRegretBgImg
      case GiftModalState.Tip:
        return GiftModalTipBgImg
      default:
        return GiftModalBgImg
    }
  }

  const openGiftModal = useCallback(
    (giftContent: GiftModalContent, callbacks?: { onOpen?: () => void; onClose?: () => void }) => {
      const handleClose = () => {
        closeModal()
        callbacks?.onClose?.()
      }

      openModal(
        {
          ui: {
            content: <GiftModalContent {...giftContent} onClose={handleClose} />,
          },
          modalClassName: 'h-[27.75rem] px-[2.5rem]',
          topOffset: '5rem',
          backgroundImage: getBackgroundImage(giftContent.state),
        },
        {
          onOpen: callbacks?.onOpen,
          onClose: handleClose,
        }
      )
    },
    [openModal, closeModal]
  )

  const closeGiftModal = useCallback(
    (callback?: () => void) => {
      closeModal()
      callback?.()
    },
    [closeModal]
  )

  return { openGiftModal, closeGiftModal }
}

interface GiftModalContentProps extends GiftModalContent {
  onClose: () => void
}

const GiftModalContent: React.FC<GiftModalContentProps> = ({
  giftName,
  giftImage,
  giftDescription,
  state,
  redeemCode,
  onAction,
  onClose,
  closeOnCopy = false, // 默认为 false
}) => {
  const handleAction = useCallback(
    (action: GiftModalAction) => {
      if (action === GiftModalAction.Copy && redeemCode) {
        onAction?.(action, redeemCode)
        if (closeOnCopy) {
          onClose()
        }
      } else if (action === GiftModalAction.Claim) {
        onAction?.(action)
        onClose()
      }
    },
    [onAction, redeemCode, onClose, closeOnCopy]
  )

  const descriptionElement = useMemo(() => {
    switch (state) {
      case GiftModalState.Normal:
        return redeemCode ?
            <div className="mb-[1.25rem] mt-[0.5rem] text-center text-base22 text-navy">
              兑换码为 <span className="text-base1826 text-orange">{redeemCode}</span> 请到游戏-设置-兑换码界面兑换
            </div>
          : null
      case GiftModalState.Claim:
        return (
          <p className="mb-[1.25rem] mt-[0.5rem] text-center text-base22 text-navy">{giftDescription || '奖品需要到Fanbook客户端领取 快去领取吧!'}</p>
        )

      case GiftModalState.Loading:
        return <p className="mb-[1.25rem] mt-[0.5rem] text-center text-base22 text-navy">{giftDescription || '加载中...'}</p>
      case GiftModalState.Regret:
        return <p className="mb-[1.25rem] mt-[0.5rem] text-center text-base22 text-navy">{giftDescription || '非常遗憾没有中奖！'}</p>
      case GiftModalState.Tip:
        return (
          <p className="mb-[1.25rem] mt-[0.5rem] text-center text-base22 text-navy">{giftDescription || '当前无抽奖机会， 可通过完成任务获取哦～'}</p>
        )
      default:
        return <p className="mb-[1.25rem] mt-[0.5rem] text-center text-base22 text-navy">{giftDescription || '非常遗憾没有中奖！'}</p>
    }
  }, [state, redeemCode, giftDescription])

  const buttonConfigs = useMemo(
    () => ({
      [GiftModalState.Normal]: {
        label: ButtonLabel.CopyRedeemCode,
        className: 'copy-redeem-code h-[3.13rem]',
        onClick: () => handleAction(GiftModalAction.Copy),
        disabled: !redeemCode,
        showAnimateGradient: true,
      },
      [GiftModalState.Loading]: {
        label: ButtonLabel.CopyRedeemCode,
        className: 'copy-redeem-code h-[3.13rem]',
        disabled: true,
        showAnimateGradient: true,
      },
      [GiftModalState.Claim]: {
        label: ButtonLabel.Receive,
        className: 'claim-now h-[3.13rem]',
        onClick: () => handleAction(GiftModalAction.Claim),
        showAnimateGradient: true,
      },
      [GiftModalState.Regret]: {
        label: ButtonLabel.IKnow,
        className: 'close-modal h-[3.13rem]',
        onClick: onClose,
        showAnimateGradient: true,
      },
      [GiftModalState.Tip]: {
        label: ButtonLabel.IKnow,
        className: 'close-modal h-[3.13rem]',
        onClick: onClose,
        showAnimateGradient: true,
      },
    }),
    [handleAction, onClose, redeemCode]
  )

  return (
    <div className="mt-[9.56rem] flex items-center justify-center">
      <div className="flex w-[13.75rem] flex-col items-center justify-start px-[40px]">
        <div className="relative">
          {state !== GiftModalState.Tip && state !== GiftModalState.Regret && (
            <div className="absolute -top-[50px] left-0 w-full -translate-x-1/2">
              <img
                src={RewardLightImage}
                className="pointer-events-none h-[13.75rem] w-[13.75rem] max-w-none animate-[spin_4s_linear_infinite]"
                draggable={false}
                onDragStart={e => e.preventDefault()}
                onContextMenu={e => e.preventDefault()}
                alt="奖励光效"
              />
            </div>
          )}
          {state === GiftModalState.Tip ?
            <img src={RewardCryImage} alt="奖励哭泣" className="pointer-events-none relative z-10 h-[7.5rem] w-[7.5rem] object-contain" />
          : <img src={giftImage} alt={giftName} className="pointer-events-none relative z-10 h-[7.5rem] w-[7.5rem] object-contain" />}
        </div>
        <div className="w-[13.75rem]">
          {descriptionElement}
          <div>{buttonConfigs[state] && <ImageButton {...buttonConfigs[state]} />}</div>
        </div>
      </div>
    </div>
  )
}

export default useGiftModal
