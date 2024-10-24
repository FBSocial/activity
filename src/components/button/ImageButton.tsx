import { useDebounceFn } from 'ahooks'
import clsx from 'clsx'
import React, { useMemo } from 'react'

// 导入按钮图片
import ActivityEndedImage from '@/assets/images/button/activity_ended.svg'
import ActivityNotStartImage from '@/assets/images/button/activity_not_started.svg'
import CopyRedeemCodeImage from '@/assets/images/button/copy_redeem_code.svg'
import GetMoreRewardsImage from '@/assets/images/button/get_more_rewards.svg'
import IKnowImage from '@/assets/images/button/i_know.svg'
import InviteImage from '@/assets/images/button/invite.svg'
import JoinImage from '@/assets/images/button/join.svg'
import RaiseImage from '@/assets/images/button/raise_now.svg'
import RaiseTeamImage from '@/assets/images/button/raise_team.svg'
import ReceiveImage from '@/assets/images/button/receive.svg'
import ReceiveRewardsImage from '@/assets/images/button/receive_rewards.svg'
import ViewAllRewardsImage from '@/assets/images/button/view_all_rewards.svg'
import ViewRewardsImage from '@/assets/images/button/view_rewards.svg'

/**
 * 按钮标签枚举
 * @enum {number}
 */
export enum ButtonLabel {
  /** 加入 */
  Join,
  /** 立即发起 */
  RaiseNow,
  /** 发起组团 */
  RaiseTeam,
  /** 邀请好友成团 */
  Invite,
  /** 复制兑换码 */
  CopyRedeemCode,
  /** 立即领取 */
  Receive,
  /** 获取更多奖励 */
  GetMoreRewards,
  /** 领取奖励 */
  ReceiveRewards,
  /** 查看奖励 */
  ViewRewards,
  /** 活动已结束 */
  ActivityEnded,
  /** 活动未开始 */
  ActivityNotStart,
  /** 查看全部奖励 */
  ViewAllRewards,
  /** 我知道了 */
  IKnow,
}

/**
 * 按钮标签到图片的映射
 * @type {Record<ButtonLabel, string>}
 */
const labelImageMap: Record<ButtonLabel, string> = {
  [ButtonLabel.Join]: JoinImage,
  [ButtonLabel.RaiseNow]: RaiseImage,
  [ButtonLabel.RaiseTeam]: RaiseTeamImage,
  [ButtonLabel.Invite]: InviteImage,
  [ButtonLabel.CopyRedeemCode]: CopyRedeemCodeImage,
  [ButtonLabel.Receive]: ReceiveImage,
  [ButtonLabel.GetMoreRewards]: GetMoreRewardsImage,
  [ButtonLabel.ReceiveRewards]: ReceiveRewardsImage,
  [ButtonLabel.ViewRewards]: ViewRewardsImage,
  [ButtonLabel.ActivityEnded]: ActivityEndedImage,
  [ButtonLabel.ActivityNotStart]: ActivityNotStartImage,
  [ButtonLabel.ViewAllRewards]: ViewAllRewardsImage,
  [ButtonLabel.IKnow]: IKnowImage,
}

/**
 * ImageButton 组件的属性接口
 * @interface
 * @extends {React.ButtonHTMLAttributes<HTMLButtonElement>}
 */
interface ImageButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 按钮标签 */
  label: ButtonLabel
  /** 是否显示动画渐变效果 */
  showAnimateGradient?: boolean
}

/**
 * ImageButton 组件
 *
 * 这个组件渲染一个带有图片的按钮，根据提供的标签显示不同的图片。
 *
 * @param {ImageButtonProps} props - 组件属性
 * @returns {JSX.Element} ImageButton 组件
 */
export default function ImageButton({ label, className, showAnimateGradient, disabled, onClick, ...buttonProps }: ImageButtonProps): JSX.Element {
  /** 根据标签获取对应的图片 */
  const labelImage = labelImageMap[label]

  /**
   * 计算按钮加载器效果的类名
   * @type {string[]}
   */
  const addButtonLoaderEffect = useMemo(() => {
    if (showAnimateGradient && !disabled) {
      return ['relative', 'overflow-hidden', 'loader']
    }
    return []
  }, [showAnimateGradient, disabled])

  /**
   * 防抖处理的点击事件
   * @type {(evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void}
   */
  const { run: debouncedClick } = useDebounceFn(
    (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      onClick?.(evt)
    },
    { wait: 100 }
  )

  return (
    <button
      {...buttonProps}
      className={clsx(['h-[50px] w-full rounded-full', addButtonLoaderEffect, className, disabled && 'opacity-50'])}
      style={{
        background: 'linear-gradient(90deg, #FF8439 6%, #F94B2D 87%)',
      }}
      disabled={disabled}
      onClick={debouncedClick}
    >
      <img
        onClick={evt => evt.stopPropagation()}
        draggable={false}
        src={labelImage}
        loading="lazy"
        alt=""
        className="pointer-events-none inline-block select-none"
      />
    </button>
  )
}
