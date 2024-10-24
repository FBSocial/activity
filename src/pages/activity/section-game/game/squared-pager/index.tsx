import SquaredPagerStartImg from '@/assets/images/activity/game/demo/squard_paper_start.png'
import SquaredPagerImg from '@/assets/images/activity/game/demo/squared_paper_bg.png'
import clsx from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './SquaredPagerGame.module.css'

/**
 * 表示九宫格中的单个项目
 * @interface SquaredPagerItem
 * @property {string | number} id - 项目的唯一标识符
 * @property {string} name - 项目的名称
 * @property {string} [image] - 项目的图片URL（可选）
 * @property {boolean} [display] - 是否显示项目（可选）
 * @property {any} [data] - 与项目相关的额外数据（可选）
 */
interface SquaredPagerItem {
  id: string | number
  name: string
  image?: string
  display?: boolean
  data?: any
}

/**
 * 九宫格抽奖游戏组件的属性
 * @interface SquaredPagerGameProps
 * @property {SquaredPagerItem[]} items - 九宫格中的项目列表
 * @property {() => Promise<number>} getTargetItem - 获取目标项索引的异步函数（返回从1开始的索引）
 * @property {(item: SquaredPagerItem) => void} [onDrawComplete] - 抽奖完成时的回调函数
 * @property {() => void} [onDrawStart] - 抽奖开始时的回调函数
 * @property {(progress: number) => void} [onProgress] - 抽奖进度更新时的回调函数
 * @property {() => void} [onDrawingClick] - 抽奖过程中点击时的回调函数
 * @property {boolean} [canPlay] - 是否可以进行抽奖
 * @property {() => void} [onUnavailableClick] - 不可抽奖时点击的回调函数
 * @property {number} [drawDuration] - 抽奖动画持续时间（毫秒）
 * @property {string} [backgroundImage] - 背景图片URL
 * @property {string} [startButtonImage] - 开始按钮图片URL
 * @property {(error: string) => void} [onError] - 错误处理回调函数
 */
interface SquaredPagerGameProps {
  items: SquaredPagerItem[]
  getTargetItem: () => Promise<number>
  onDrawComplete?: (item: SquaredPagerItem) => void
  onDrawStart?: () => void
  onProgress?: (progress: number) => void
  onDrawingClick?: () => void
  canPlay?: boolean
  onUnavailableClick?: () => void
  drawDuration?: number
  backgroundImage?: string
  startButtonImage?: string
  onError?: (error: string) => void
}

/**
 * 九宫格抽奖游戏组件
 * @param {SquaredPagerGameProps} props - 组件属性
 * @returns {JSX.Element} 九宫格抽奖游戏组件
 */
export default function SquaredPagerGame({
  items,
  getTargetItem,
  onDrawComplete,
  onDrawStart,
  onProgress,
  onDrawingClick,
  canPlay = true,
  onUnavailableClick,
  drawDuration = 6000,
  backgroundImage = SquaredPagerImg,
  startButtonImage = SquaredPagerStartImg,
  onError,
}: SquaredPagerGameProps): JSX.Element {
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)
  const [targetIndex, setTargetIndex] = useState<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  /**
   * 计算切换间隔时间
   * @param {number} progress - 当前进度（0-1）
   * @returns {number} 切换间隔时间（毫秒）
   */
  const calculateSwitchInterval = useCallback((progress: number): number => {
    const startInterval = 50
    const endInterval = 200
    const easeOutQuad = (t: number): number => t * (2 - t)
    return startInterval + easeOutQuad(progress) * (endInterval - startInterval)
  }, [])

  /**
   * 开始抽奖动画
   */
  const startDraw = useCallback(async () => {
    if (isDrawing || items.length === 0) return

    setIsDrawing(true)
    onDrawStart?.()

    try {
      const targetIndex = await getTargetItem()
      setTargetIndex(targetIndex)

      const startTime = Date.now()
      let currentIdx = 0
      let lastSwitchTime = startTime
      const minRounds = 3 // 至少转动的圈数
      let currentRound = 0
      let isSlowingDown = false

      const animateDraw = (): void => {
        const currentTime = Date.now()
        const elapsedTime = currentTime - startTime
        const progress = Math.min(elapsedTime / drawDuration, 1)

        onProgress?.(progress)

        if (progress < 1) {
          const switchInterval = calculateSwitchInterval(progress)

          if (currentTime - lastSwitchTime >= switchInterval) {
            currentIdx = (currentIdx + 1) % items.length
            setCurrentIndex(currentIdx)
            lastSwitchTime = currentTime

            // 检查是否完成一圈
            if (currentIdx === 0) {
              currentRound++
            }

            // 如果已经转够了最小圈数，开始减速
            if (currentRound >= minRounds && !isSlowingDown) {
              isSlowingDown = true
            }

            // 如果正在减速，并且当前索引接近目标索引，准备停止
            if (isSlowingDown) {
              const distanceToTarget = (targetIndex - currentIdx + items.length) % items.length
              if (distanceToTarget <= 2) {
                // 当距离目标还有2步或更少时，准备停止
                if (currentIdx === targetIndex) {
                  // 到达目标，停止动画
                  setCurrentIndex(targetIndex)
                  setIsDrawing(false)
                  onDrawComplete?.(items[targetIndex])
                  return
                }
              }
            }
          }
          animationFrameRef.current = requestAnimationFrame(animateDraw)
        } else {
          // 确保最后停在正确的位置
          setCurrentIndex(targetIndex)
          setIsDrawing(false)
          onDrawComplete?.(items[targetIndex])
        }
      }

      animationFrameRef.current = requestAnimationFrame(animateDraw)
    } catch (error) {
      console.error('获取目标项失败:', error)
      setIsDrawing(false)
      onError?.('获取目标项失败')
    }
  }, [isDrawing, items, getTargetItem, onDrawStart, onDrawComplete, onProgress, drawDuration, calculateSwitchInterval, onError])

  /**
   * 处理按钮点击事件
   */
  const handleButtonClick = useCallback((): void => {
    if (!canPlay) {
      onUnavailableClick?.()
      return
    }

    if (isDrawing) {
      onDrawingClick?.()
    } else {
      startDraw()
    }
  }, [canPlay, isDrawing, startDraw, onDrawingClick, onUnavailableClick])

  useEffect(() => {
    if (items.length !== 8) {
      console.error('SquaredPagerGame: 必须提供恰好8个项目')
      onError?.('项目数量不正确，应为8个')
    }
  }, [items, onError])

  /**
   * 渲染单个项目
   * @param {SquaredPagerItem} item - 要渲染的项目
   * @param {number} index - 项目的索引
   * @returns {JSX.Element} 渲染的项目元素
   */
  const renderItem = useCallback(
    (item: SquaredPagerItem, index: number): JSX.Element => (
      <div
        key={item.id}
        className={clsx('flex h-full w-full items-center justify-center overflow-hidden rounded-lg', {
          [styles.animatedBorder]: isDrawing && currentIndex === index,
          [styles.runningItem]: isDrawing && currentIndex === index,
          [styles.winningItem]: !isDrawing && index === targetIndex && currentIndex !== null,
        })}
      >
        <div className={clsx('flex h-full w-full items-center justify-center rounded-xl', styles.prizeItem)}>
          {item.display && (
            <>
              <img src={item.image} loading="lazy" alt={item.name} className={clsx([styles.prizeImage, 'pointer-events-none select-none'])} />
              {/* <span className="text-center">{item.name}</span> */}
            </>
          )}
        </div>
      </div>
    ),
    [currentIndex, isDrawing, targetIndex]
  )

  /**
   * 渲染所有项目
   * @returns {JSX.Element} 渲染的所有项目元素
   */
  const renderItems = useCallback(() => {
    if (items.length !== 8) {
      return Array(8)
        .fill(null)
        .map((_, index) => (
          <div key={index} className="flex h-full w-full items-center justify-center rounded-xl">
            <span className="text-center text-gray-500">错误</span>
          </div>
        ))
    }

    return (
      <>
        {items.slice(0, 3).map((item, index) => renderItem(item, index))}
        {renderItem(items[7], 7)}
        <div
          onClick={handleButtonClick}
          className={`flex h-full w-full cursor-pointer items-center justify-center ${!canPlay ? 'cursor-not-allowed opacity-70' : ''}`}
        >
          <img
            src={startButtonImage}
            alt={isDrawing ? '抽奖中' : '开始抽奖'}
            className="pointer-events-none h-full w-full select-none object-contain"
          />
        </div>
        {renderItem(items[3], 3)}
        {items
          .slice(4, 7)
          .reverse()
          .map((item, index) => renderItem(item, 6 - index))}
      </>
    )
  }, [items, renderItem, handleButtonClick, canPlay, isDrawing, startButtonImage])

  return (
    <div className="squared-pager-game relative h-[22.38rem] w-[22.38rem]">
      <img src={backgroundImage} alt="游戏背景" className="pointer-events-none absolute h-full w-full select-none object-cover" loading="lazy" />
      <div className="absolute inset-4 grid grid-cols-3 grid-rows-3 gap-[0.44rem]">{renderItems()}</div>
    </div>
  )
}

SquaredPagerGame.displayName = 'SquaredPagerGame'
