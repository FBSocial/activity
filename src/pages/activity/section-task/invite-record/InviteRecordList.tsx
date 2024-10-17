import Empty from '@/components/Empty'
import { useVirtualList } from 'ahooks'
import { useMemo, useRef } from 'react'

/**
 * 邀请记录列表项的接口
 */
interface InviteRecordItem {
  index: number
  avatar?: string
  username?: string
  joinTime?: string
}

/**
 * 邀请记录列表组件的属性接口
 */
interface InviteRecordListProps {
  list: InviteRecordItem[] | null
}

/**
 * 邀请记录列表组件
 * 使用虚拟列表展示大量邀请记录
 *
 * @param props - 组件属性
 * @returns JSX.Element
 */
export default function InviteRecordList({ list }: InviteRecordListProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const [virtualList] = useVirtualList(list ?? [], {
    containerTarget: containerRef,
    wrapperTarget: wrapperRef,
    itemHeight: 85,
    overscan: 10,
  })

  const hasInvite = useMemo(() => {
    if (!list) return false
    return Array.isArray(list) && list.length > 0
  }, [list])

  return (
    <>
      {hasInvite ?
        <div ref={containerRef} style={{ height: '100%', overflow: 'auto' }}>
          <div ref={wrapperRef}>
            {virtualList.map(ele => (
              <div className="flex h-[85px] items-center justify-start py-[10px]">
                <div className="pl-4 pr-3">
                  <img src={ele.data.avatar} alt="avatar" className="pointer-events-none h-12 w-12 rounded-full" />
                </div>
                <div className="flex-1 border-b border-solid border-b-navy-light py-5">
                  <div className="text-base text-navy">{ele.data.username}</div>
                  <div className="mt-[0.25rem] whitespace-nowrap text-xs text-stone">{ele.data.joinTime}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      : <Empty text="暂无邀请记录" className="mt-12" />}
    </>
  )
}
