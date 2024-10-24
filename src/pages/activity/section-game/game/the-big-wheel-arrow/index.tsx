import ArrowImg from '@/assets/images/activity/game/demo/the_big_wheel_arrow.png'
import GameBgImg from '@/assets/images/activity/game/demo/the_big_wheel_bg.png'
import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './index.module.css'

interface WheelSegment {
  id: string | number
  name: string
  image?: string
  display?: boolean
  data?: unknown
}

interface TheBigWheelArrowGameProps {
  items: WheelSegment[]
  getTargetSegment: () => Promise<number>
  onSpinComplete?: (segment: WheelSegment) => void
  onSpinStart?: () => void
  onProgress?: (progress: number) => void
  onSpinningClick?: () => void
  canPlay?: boolean
  onUnavailableClick?: () => void
  spinDuration?: number
  backgroundImage?: string
  arrowImage?: string
  onError?: (error: string) => void
}

/**
 * 大转盘箭头游戏组件
 * @param {TheBigWheelArrowGameProps} props - 组件属性
 * @returns {JSX.Element} 大转盘箭头游戏组件
 */
export default function TheBigWheelArrowGame({
  items = [],
  getTargetSegment,
  onSpinComplete,
  onSpinStart,
  onProgress,
  onSpinningClick,
  canPlay = true,
  onUnavailableClick,
  spinDuration = 4000,
  backgroundImage = GameBgImg,
  arrowImage = ArrowImg,
  onError,
}: TheBigWheelArrowGameProps): JSX.Element {
  const [isSpinning, setIsSpinning] = useState<boolean>(false)
  const [rotation, setRotation] = useState<number>(0)
  const animationFrameRef = useRef<number | null>(null)

  const segmentAngle = 360 / items.length

  /**
   * 缓动函数：模拟更柔和的旋转效果
   * @param {number} t - 当前进度（0-1）
   * @returns {number} 缓动后的值
   */
  const easeOutQuint = (t: number): number => {
    return 1 - Math.pow(1 - t, 5)
  }

  /**
   * 开始旋转函数
   * @returns {Promise<void>}
   */
  const startSpin = useCallback(async (): Promise<void> => {
    if (isSpinning || items.length === 0) return

    setIsSpinning(true)
    onSpinStart?.()

    try {
      const targetIndex = await getTargetSegment()
      if (targetIndex < 0 || targetIndex >= items.length) {
        throw new Error('无效的目标索引')
      }

      // 修正这里：计算目标角度，确保所有 targetIndex 对应正确的位置
      const targetAngle = segmentAngle * targetIndex
      // 增加旋转圈数，使动画更加平滑
      const totalRotation = 360 * 8 + targetAngle

      const startTime = performance.now()

      const animateProgress = (currentTime: number): void => {
        const elapsedTime = currentTime - startTime
        const progress = Math.min(elapsedTime / spinDuration, 1)

        onProgress?.(progress)

        if (progress < 1) {
          const easedProgress = easeOutQuint(progress)
          const newRotation = easedProgress * totalRotation
          setRotation(newRotation % 360)
          animationFrameRef.current = requestAnimationFrame(animateProgress)
        } else {
          // 最后一帧动画
          setRotation(targetAngle)
          requestAnimationFrame(() => {
            setIsSpinning(false)
            setTimeout(() => {
              onSpinComplete?.(items[targetIndex])
            }, 50)
          })
        }
      }

      animationFrameRef.current = requestAnimationFrame(animateProgress)
    } catch (error) {
      console.error('获取目标分段失败:', error)
      setIsSpinning(false)
      onError?.(error instanceof Error ? error.message : '未知错误')
    }
  }, [isSpinning, items, onSpinStart, getTargetSegment, segmentAngle, spinDuration, onProgress, onSpinComplete, onError])

  /**
   * 处理按钮点击事件
   */
  const handleButtonClick = useCallback((): void => {
    if (!canPlay) {
      onUnavailableClick?.()
      return
    }

    if (isSpinning) {
      onSpinningClick?.()
      // 注意：这里不再调用 startSpin，只触发回调函数
    } else {
      void startSpin()
    }
  }, [canPlay, isSpinning, startSpin, onSpinningClick, onUnavailableClick])

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const renderGiftItems = () => {
    return items.map((item, index) => {
      const angle = index * segmentAngle
      const radians = (angle - 90) * (Math.PI / 180) // 从12点钟方向开始
      const radius = 6.5 // 减小半径，使礼物更靠近中心
      const x = 9.2 + radius * Math.cos(radians)
      const y = 9.2 + radius * Math.sin(radians)

      return (
        <div
          key={item.id}
          className={styles.giftItem}
          style={{
            transform: `translate(${x}rem, ${y}rem) rotate(${angle}deg)`,
          }}
        >
          {item.display && (
            <>
              <img src={item.image} alt={item.name} className={styles.giftImage} />
              <span className={styles.giftName}>{item.name}</span>
            </>
          )}
        </div>
      )
    })
  }

  return (
    <div className="the-big-wheel-arrow-game relative h-[22.38rem] w-[22.38rem]">
      <img src={backgroundImage} alt="游戏背景" className="pointer-events-none h-full w-full select-none object-cover" loading="lazy" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          onClick={handleButtonClick}
          className={`relative z-10 focus:outline-none ${!canPlay ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
        >
          <div className="relative">
            <img
              src={arrowImage}
              alt={
                isSpinning ? '正在旋转'
                : canPlay ?
                  '开始'
                : '不可用'
              }
              className="pointer-events-none relative z-10 h-[9rem] w-[9rem] select-none object-contain"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'none' : 'transform 0.3s ease-out',
                transformOrigin: 'center 56.25%',
              }}
            />
          </div>
        </div>
      </div>
      <div className={styles.giftContainer}>{renderGiftItems()}</div>
    </div>
  )
}

TheBigWheelArrowGame.displayName = 'TheBigWheelArrowGame'
