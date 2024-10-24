import Empty from '@/components/Empty'
import { useActivityInfo } from '@/contexts/activity-info/ActivityInfoContext'
import { getLotteryRecord, LotteryRecordItem } from '@/services/api/activity/lottery'
import FbApi from '@/services/FbApi'
import { inFanbook } from '@/utils'
import { copyToClipboard } from '@/utils/clipboard'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Virtuoso } from 'react-virtuoso'
import ActionButton from './ActionButton'
import PrizeListSkeleton from './PrizeListSkeleton'

/**
 * 奖品列表项的接口
 */
interface PrizeItem {
  index: number
  img: string
  name: string
  extra: string
  disabled: boolean
  data: LotteryRecordItem
}

/**
 * 奖品列表组件
 * 使用 react-virtuoso 实现虚拟列表和无限滚动
 *
 * @returns JSX.Element
 */
export default function PrizeList(): JSX.Element {
  const { activityId } = useActivityInfo()
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [prizeList, setPrizeList] = useState<PrizeItem[]>([])
  const [initialLoading, setInitialLoading] = useState(true)

  const fetchLotteryRecordList = useCallback(
    async (currentPage: number): Promise<PrizeItem[]> => {
      if (!activityId) {
        throw new Error('活动ID不存在')
      }
      try {
        const { list, pagination } = await getLotteryRecord({
          activity_id: Number(activityId),
          page: currentPage,
          page_size: 30,
        })

        setTotalPages(pagination.last_page)
        return list.map(item => ({
          index: item.reward_record_id,
          name: item.created_at ?? '',
          img: item.gift_img ?? '',
          extra: item.cd_key ?? '',
          disabled: false, // 根据实际情况设置
          data: item,
        }))
      } catch (error) {
        console.error('获取奖品列表失败:', error)
        throw error
      }
    },
    [activityId]
  )

  const handleActionClick = useCallback((data: LotteryRecordItem) => {
    console.log('奖品操作点击:', data)
    if (inFanbook()) {
      FbApi.setClipboardData(data?.cd_key)
    } else {
      copyToClipboard(
        data?.cd_key,
        () => {
          FbApi.toast('复制成功')
        },
        () => {
          FbApi.toast('复制失败，请重试')
        }
      )
    }
    // 在这里实现奖品操作的逻辑
  }, [])

  const handleLoadMore = useCallback(async () => {
    if (loading || page >= totalPages) return
    try {
      setLoading(true)
      const nextPage = page + 1
      const newItems = await fetchLotteryRecordList(nextPage)
      setPrizeList(prevList => [...prevList, ...newItems])
      setPage(nextPage)
    } catch (error) {
      console.error('加载更多奖品失败', error)
    } finally {
      setLoading(false)
    }
  }, [page, fetchLotteryRecordList, loading, totalPages])

  useEffect(() => {
    const initializeList = async () => {
      try {
        setInitialLoading(true)
        const initialList = await fetchLotteryRecordList(1)
        setPrizeList(initialList)
      } catch (error) {
        console.error('初始化奖品列表失败', error)
      } finally {
        setInitialLoading(false)
      }
    }

    initializeList()
  }, [fetchLotteryRecordList])

  const renderItem = useCallback(
    (index: number, item: PrizeItem) => (
      <div className="flex h-[85px] w-full items-center justify-between px-[1rem] py-[0.5rem]">
        <div className="flex-start flex flex-1 items-center">
          <div className="mr-3 flex h-[4.38rem] w-[4.38rem] items-center justify-center rounded-lg border-[0.5px] border-navy-light p-[0.34rem]">
            <img src={item.img} alt="奖品图片" className="pointer-events-none h-full w-full" />
          </div>
          <div className="flex flex-1 justify-between border-b border-solid border-b-navy-light">
            <div className="flex-1 py-5">
              <div className="line-clamp-2 text-base22 text-navy">{item.name}</div>
              <div className="mt-[0.25rem] whitespace-nowrap text-xs text-stone">{item.extra}</div>
            </div>
            <div className="ml-[1.25rem] flex min-w-[4rem] flex-shrink-0 items-center justify-center">
              <ActionButton onClick={() => handleActionClick(item.data)} disabled={item.disabled} />
            </div>
          </div>
        </div>
      </div>
    ),
    [handleActionClick]
  )

  const Footer = useMemo(() => {
    if (page >= totalPages) return undefined
    return () => <div className="py-4 text-center text-gray-500">加载更多...</div>
  }, [page, totalPages])

  if (initialLoading) {
    return <PrizeListSkeleton count={10} />
  }

  if (prizeList.length === 0) {
    return <Empty text="暂无奖励" className="mt-12" />
  }

  return (
    <Virtuoso
      style={{ height: '100%' }}
      data={prizeList}
      itemContent={renderItem}
      endReached={handleLoadMore}
      components={{ Footer }}
      increaseViewportBy={{ top: 100, bottom: 200 }}
    />
  )
}
