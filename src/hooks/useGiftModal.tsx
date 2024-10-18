import GiftModalBgImg from '@/assets/images/modal/gift_modal_bg.png'
import RewardLightImage from '@/assets/images/modal/light.svg'
import ImageButton, { ButtonLabel } from '@/components/button/ImageButton'
import { useModal } from '@/providers/ModalProvider'
import React, { useCallback, useMemo } from 'react'

/**
 * 礼物模态框内容的接口
 * @interface GiftModalContent
 * @property {string} giftName - 礼物名称
 * @property {string} giftImage - 礼物图片URL
 * @property {string} giftDescription - 礼物描述
 * @property {'normal' | 'loading' | 'claim'} state - 模态框状态
 * @property {string} [redeemCode] - 可选的兑换码
 * @property {() => void} [onClaim] - 可选的领取回调函数
 * @property {(code: string) => void} [onCopy] - 可选的复制回调函数
 */
interface GiftModalContent {
  giftName: string
  giftImage: string
  giftDescription: string
  state: 'normal' | 'loading' | 'claim'
  redeemCode?: string
  onClaim?: () => void
  onCopy?: (code: string) => void
}

/**
 * 礼物模态框的自定义 Hook
 * @returns {Object} 包含打开和关闭礼物模态框的方法
 * @property {(giftContent: GiftModalContent, callbacks?: { onOpen?: () => void, onClose?: () => void }) => void} openGiftModal - 打开礼物模态框的方法
 * @property {(callback?: () => void) => void} closeGiftModal - 关闭礼物模态框的方法
 */
export const useGiftModal = () => {
  const { openModal, closeModal } = useModal()

  /**
   * 打开礼物模态框
   * @param {GiftModalContent} giftContent - 礼物的内容
   * @param {Object} [callbacks] - 可选的回调函数对象
   * @param {() => void} [callbacks.onOpen] - 模态框打开时的回调函数
   * @param {() => void} [callbacks.onClose] - 模态框关闭时的回调函数
   */
  const openGiftModal = (giftContent: GiftModalContent, callbacks?: { onOpen?: () => void; onClose?: () => void }) => {
    openModal(
      {
        ui: {
          content: <GiftModalContent {...giftContent} onClose={closeModal} />,
        },
        modalClassName: 'h-[27.75rem]  px-[2.5rem] ',
        topOffset: '5rem',
        backgroundImage: GiftModalBgImg,
      },
      callbacks
    )
  }

  /**
   * 关闭礼物模态框
   * @param {() => void} [callback] - 可选的回调函数，在模态框关闭后执行
   */
  const closeGiftModal = useCallback(
    (callback?: () => void) => {
      closeModal()
      // 如果提供了回调函数，则在关闭模态框后执行
      callback?.()
    },
    [closeModal]
  )

  return { openGiftModal, closeGiftModal }
}

/**
 * 礼物模态框内容组件
 * @param {GiftModalContent} props - 组件属性
 * @returns {JSX.Element} 礼物模态框内容的 React 组件
 */
interface GiftModalContentProps extends GiftModalContent {
  onClose: () => void
}

const GiftModalContent: React.FC<GiftModalContentProps> = ({ giftName, giftImage, giftDescription, state, redeemCode, onClaim, onCopy, onClose }) => {
  /**
   * 处理复制兑换码的函数
   */
  const handleCopy = () => {
    if (redeemCode && onCopy) {
      console.log('%c Line:66 🍩 redeemCode', 'color:#b03734', redeemCode)
      onCopy?.(redeemCode)
      // onClose() // 复制后关闭模态框
    }
  }

  const handleClaim = () => {
    onClaim?.()
    onClose() // 领取后关闭模态框
  }

  const descriptionElement = useMemo(() => {
    if (state === 'claim' && redeemCode) {
      return (
        <div className="mb-[1.25rem] mt-[0.5rem] text-center text-base22 text-navy">
          兑换码为 <span className="text-base1826 text-orange">{redeemCode}</span> 请到游戏-设置-兑换码界面兑换
        </div>
      )
    } else if (state === 'loading') {
      return <p className="mb-[1.25rem] mt-[0.5rem] text-center text-base22 text-navy">加载中...</p>
    } else {
      return <p className="mb-[1.25rem] mt-[0.5rem] text-center text-base22 text-navy">{giftDescription}</p>
    }
  }, [state, redeemCode, giftDescription])

  return (
    <div className="mt-[9.56rem] flex items-center justify-center">
      <div className="flex w-[13.75rem] flex-col items-center justify-start px-[40px]">
        <div className="relative">
          <div className="absolute -top-[50px] left-0 w-full -translate-x-1/2">
            <img
              src={RewardLightImage}
              loading="lazy"
              className="pointer-events-none h-[13.75rem] w-[13.75rem] max-w-none animate-[spin_4s_linear_infinite]"
              draggable={false}
              onDragStart={e => e.preventDefault()}
              onContextMenu={e => e.preventDefault()}
              alt="奖励光效"
            />
          </div>
          <img src={giftImage} alt={giftName} loading="lazy" className="pointer-events-none relative z-10 h-[7.5rem] w-[7.5rem] object-contain" />
        </div>
        <div className="w-[13.75rem]">
          {descriptionElement}
          <div>
            {state === 'normal' && (
              <ImageButton
                label={ButtonLabel.CopyRedeemCode}
                showAnimateGradient={true}
                className="copy-redeem-code h-[3.13rem]"
                onClick={handleCopy}
                disabled={!redeemCode}
              />
            )}
            {state === 'loading' && (
              <ImageButton disabled={true} label={ButtonLabel.CopyRedeemCode} showAnimateGradient={true} className="copy-redeem-code h-[3.13rem]" />
            )}
            {state === 'claim' && (
              <ImageButton label={ButtonLabel.Receive} showAnimateGradient={true} className="claim-now h-[3.13rem]" onClick={handleClaim} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default useGiftModal
