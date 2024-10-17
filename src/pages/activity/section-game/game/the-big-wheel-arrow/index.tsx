import ArrowImg from '@/assets/images/activity/game/demo/the_big_wheel_arrow.png'
import GameBgImg from '@/assets/images/activity/game/demo/the_big_wheel_bg.png'
import { useCallback, useEffect, useRef, useState } from 'react'

interface WheelSegment {
  id: string | number
  name: string
  // 可以根据需要添加其他属性，如颜色、图片等
}

interface TheBigWheelArrowGameProps<T extends WheelSegment[] | number> {
  segments: T
  targetSegment: number // 现在从1开始计数
  onSpinComplete?: (segment: T extends WheelSegment[] ? WheelSegment : number) => void
  onSpinStart?: () => void
  onProgress?: (progress: number) => void
  onSpinningClick?: () => void
  canPlay?: boolean
  onUnavailableClick?: () => void
  spinDuration?: number
}

/**
 * 大转盘箭头游戏组件
 * @template T - segments 的类型，可以是 WheelSegment[] 或 number
 * @param {object} props - 组件属性
 * @param {T} props.segments - 转盘分段列表或分段数量
 * @param {number} props.targetSegment - 目标分段的索引（从1开始）
 * @param {function} [props.onSpinComplete] - 旋转完成回调函数，参数类型取决于 segments 的类型
 * @param {function} [props.onSpinStart] - 开始旋转回调函数
 * @param {function} [props.onProgress] - 旋转进度回调函数，参数为旋转进度（0-1之间的数值）
 * @param {function} [props.onSpinningClick] - 在旋转过程中点击按钮时的回调函数
 * @param {boolean} [props.canPlay=true] - 控制游戏是否可以玩，默认为true
 * @param {function} [props.onUnavailableClick] - 在游戏不可玩时点击按钮的回调函数
 * @param {number} [props.spinDuration=3000] - 旋转持续时间，单位毫秒，默认为3000毫秒（3秒）
 * @returns {JSX.Element} 大转盘箭头游戏组件
 */
export default function TheBigWheelArrowGame<T extends WheelSegment[] | number>({
  segments,
  targetSegment,
  onSpinComplete,
  onSpinStart,
  onProgress,
  onSpinningClick,
  canPlay = true,
  onUnavailableClick,
  spinDuration = 3000,
}: TheBigWheelArrowGameProps<T>) {
  const [isSpinning, setIsSpinning] = useState(false)
  const segmentsCount = Array.isArray(segments) ? segments.length : segments
  const segmentAngle = 360 / (segmentsCount as number)
  const [rotation, setRotation] = useState(0)
  const spinTimeoutRef = useRef<number | null>(null)

  /**
   * 开始旋转函数
   * @returns {void}
   */
  const startSpin = useCallback(() => {
    if (!isSpinning) {
      setIsSpinning(true)
      onSpinStart?.()

      // 计算目标角度（注意：targetSegment 现在从1开始）
      const targetAngle = segmentAngle * (targetSegment - 1)

      // 计算当前旋转角度（取模360度）
      const currentAngle = rotation % 360

      // 计算需要旋转的角度
      let rotationNeeded = targetAngle - currentAngle

      // 如果需要旋转的角度为负数或0，增加一个完整的旋转
      if (rotationNeeded <= 0) {
        rotationNeeded += 360
      }

      // 添加额外的旋转以确保至少转动几圈
      const extraRotations = 360 * 5 // 5圈额外旋转
      const totalRotation = rotation + rotationNeeded + extraRotations

      // 使用传入的 spinDuration 替换原来的固定值
      const startTime = Date.now()

      const animateProgress = () => {
        const currentTime = Date.now()
        const elapsedTime = currentTime - startTime
        const progress = Math.min(elapsedTime / spinDuration, 1)

        onProgress?.(progress)

        if (progress < 1) {
          requestAnimationFrame(animateProgress)
        }
      }

      // 开始进动画
      requestAnimationFrame(animateProgress)

      // 使用 requestAnimationFrame 来确保状态更新后再开始新的旋转
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setRotation(totalRotation)

          spinTimeoutRef.current = window.setTimeout(() => {
            setIsSpinning(false)
            if (Array.isArray(segments)) {
              onSpinComplete?.(segments[targetSegment - 1] as T extends WheelSegment[] ? WheelSegment : number)
            } else {
              onSpinComplete?.(targetSegment as T extends WheelSegment[] ? WheelSegment : number)
            }
          }, spinDuration)
        })
      })
    }
  }, [isSpinning, segments, targetSegment, onSpinStart, onSpinComplete, onProgress, rotation, segmentAngle, spinDuration])

  /**
   * 处理按钮点击事件
   * @returns {void}
   */
  const handleButtonClick = useCallback(() => {
    if (!canPlay) {
      onUnavailableClick?.()
      return
    }

    if (isSpinning) {
      onSpinningClick?.()
    } else {
      startSpin()
    }
  }, [canPlay, isSpinning, startSpin, onSpinningClick, onUnavailableClick])

  useEffect(() => {
    // 清理函数，用于在组件卸载时取消定时器
    return () => {
      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="the-big-wheel-arrow-game relative h-[22.38rem] w-[22.38rem]">
      <img src={GameBgImg} alt="game-bg" className="h-full w-full" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div onClick={handleButtonClick} className={`relative z-10 focus:outline-none ${!canPlay ? 'cursor-not-allowed opacity-70' : ''}`}>
          <div className="relative">
            <img
              src={ArrowImg}
              alt={
                isSpinning ? '正在旋转'
                : canPlay ?
                  '开始'
                : '不可用'
              }
              className={`pointer-events-none relative z-10 h-[8.18rem] w-[8.18rem]`}
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? `transform ${spinDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1)` : 'transform 0.3s ease-out',
                transformOrigin: 'center 56.5%',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

TheBigWheelArrowGame.displayName = 'TheBigWheelArrowGame'
