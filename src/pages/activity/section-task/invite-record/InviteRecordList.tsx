import Empty from '@/components/Empty'
import { useActivityInfo } from '@/contexts/activity-info/ActivityInfoContext'
import { getInviteRecord } from '@/services/api/activity/invite'
import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'
import { Virtuoso } from 'react-virtuoso'
import InviteRecordListSkeleton from './InviteRecordListSkeleton'

/**
 * 邀请记录列表项的接口
 */
interface InviteRecordItem {
  created_at: number
  user: {
    avatar: string
    nickname: string
  }
}

/**
 * 邀请记录列表组件
 * 使用 react-virtuoso 实现虚拟列表和无限滚动
 *
 * @returns JSX.Element
 */
export default function InviteRecordList(): JSX.Element {
  const { activityId, mode } = useActivityInfo()
  const [loading, setLoading] = useState(false)
  const [lastId, setLastId] = useState(0)
  const [inviteList, setInviteList] = useState<InviteRecordItem[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)

  const fetchInviteRecordList = useCallback(
    async (currentLastId: number): Promise<InviteRecordItem[]> => {
      if (!activityId) {
        throw new Error('活动ID不存在')
      }
      if (mode === 'guest') {
        return []
      }
      try {
        const response = await getInviteRecord({
          activity_id: Number(activityId),
          last_id: currentLastId,
        })

        setLastId(response.last_id)
        setHasMore(response.list.length >= 20) // 修改这里，使用 >= 而不是 ===
        return response.list
      } catch (error) {
        console.error('获取邀请记录列表失败:', error)
        throw error
      }
    },
    [activityId, mode]
  )

  const handleLoadMore = useCallback(async () => {
    if (loading || !hasMore) return
    try {
      setLoading(true)
      const newItems = await fetchInviteRecordList(lastId)
      setInviteList(prevList => [...prevList, ...newItems])
      if (newItems.length < 20) {
        // 添加这个检查
        setHasMore(false)
      }
    } catch (error) {
      console.error('加载更多邀请记录失败', error)
    } finally {
      setLoading(false)
    }
  }, [fetchInviteRecordList, lastId, loading, hasMore])

  useEffect(() => {
    const initializeList = async () => {
      try {
        setInitialLoading(true)
        const initialList = await fetchInviteRecordList(0)
        setInviteList(initialList)
      } catch (error) {
        console.error('初始化邀请记录列表失败', error)
      } finally {
        setInitialLoading(false)
      }
    }

    initializeList()
  }, [fetchInviteRecordList])

  const renderItem = useCallback(
    (index: number, item: InviteRecordItem) => (
      <div className="flex h-[85px] items-center justify-start py-[10px]">
        <div className="pl-4 pr-3">
          <img src={item.user.avatar} loading="lazy" alt="avatar" className="pointer-events-none h-12 w-12 rounded-full" />
        </div>
        <div className="flex-1 border-b border-solid border-b-navy-light py-5">
          <div className="text-base text-navy">{item.user.nickname}</div>
          <div className="mt-[0.25rem] whitespace-nowrap text-xs text-stone">{dayjs(item.created_at * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
        </div>
      </div>
    ),
    []
  )

  const Footer = useCallback(() => {
    if (!hasMore) return null
    return <div className="py-4 text-center text-gray-500">加载更多...</div>
  }, [hasMore])

  if (initialLoading) {
    return <InviteRecordListSkeleton count={10} />
  }

  if (inviteList.length === 0) {
    return <Empty text="暂无邀请记录" className="mt-12" />
  }

  return (
    <Virtuoso
      style={{ height: '100%' }}
      data={inviteList}
      itemContent={renderItem}
      endReached={handleLoadMore}
      components={{ Footer }}
      increaseViewportBy={{ top: 100, bottom: 200 }}
    />
  )
}
