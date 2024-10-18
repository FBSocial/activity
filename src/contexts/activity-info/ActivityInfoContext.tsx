import type { TaskItemProps } from '@/pages/activity/section-task/task-list'
import { getActivityDetail, getActivityPreview, type ActivityDetail } from '@/services/api/activity/detail'
import { getActivityPreviewTasks, getGuestTasks, getLoggedInUserDailyTasks } from '@/services/api/activity/task'
import { getUserActivityParticipation } from '@/services/api/activity/user'
import { inFanbook } from '@/utils'
import { getToken } from '@/utils/auth-utils'
import { base64ToJson } from '@/utils/json'
import Cookies from 'js-cookie'
import queryString from 'query-string'
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// 定义模式类型
type ActivityMode = 'guest' | 'preview' | 'normal'

// 定义 context 的类型
interface ActivityInfoContextType {
  activityId: string | undefined
  activityUrlPath: string
  activityFullUrl: string
  activityInfo: ActivityDetail | null
  loading: boolean
  error: Error | null
  refreshActivityInfo: () => Promise<void>
  mode: ActivityMode
  setMode: (mode: ActivityMode) => void
  taskList: TaskItemProps[]
  lotteryTimes: number
  updateLotteryTimes: () => Promise<void>
}

// 创建 context
const ActivityInfoContext = createContext<ActivityInfoContextType | undefined>(undefined)

// Provider 组件
export function ActivityInfoProvider({ children }: { children: ReactNode }) {
  const [activityInfo, setActivityInfo] = useState<ActivityDetail | null>(null)
  const [taskList, setTaskList] = useState<TaskItemProps[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const [modeInitialized, setModeInitialized] = useState<boolean>(false)
  const [mode, setMode] = useState<ActivityMode>(() => {
    const determineMode = (): ActivityMode => {
      const query = queryString.parseUrl(window.location.search).query
      const userToken = getToken()

      if (query?.activityPreview) {
        try {
          const { mode, token } = base64ToJson<{ mode: string; token: string }>(query.activityPreview as string)

          if (mode === 'preview') {
            if (inFanbook()) {
              return 'preview'
            } else {
              if (token === userToken) {
                return 'preview'
              } else {
                Cookies.set('token', token)
                return 'preview'
              }
            }
          }
        } catch (error) {
          console.error('解析 activityPreview 参数失败:', error)
        }
      }

      return userToken ? 'normal' : 'guest'
    }

    const initialMode = determineMode()
    setModeInitialized(true)
    return initialMode
  })

  // 活动ID
  const { activityId } = useParams()
  // 活动路径
  const activityUrlPath = `/activity/${activityId}`
  // 带域名的全路径
  const activityFullUrl = `${window?.location?.origin}${activityUrlPath}`

  // 新增一个状态来跟踪是否已经加载过数据
  const [dataLoaded, setDataLoaded] = useState<boolean>(false)

  // 合并 fetchActivityDetail 和 fetchTaskList 为一个函数
  const fetchActivityData = useCallback(async () => {
    if (!activityId || !modeInitialized || dataLoaded) {
      return
    }

    setLoading(true)
    try {
      // 获取活动详情
      let activityRes
      switch (mode) {
        case 'guest':
        case 'normal':
          activityRes = await getActivityDetail(Number(activityId))
          break
        case 'preview':
          activityRes = await getActivityPreview(Number(activityId))
          break
      }

      if (activityRes) {
        if (activityRes.name) {
          document.title = activityRes.name
        }
        setActivityInfo(activityRes)
      }

      // 获取任务列表
      let taskRes
      switch (mode) {
        case 'guest':
          taskRes = await getGuestTasks(activityId)
          break
        case 'preview':
          taskRes = await getActivityPreviewTasks(Number(activityId))
          break
        case 'normal':
          taskRes = await getLoggedInUserDailyTasks(Number(activityId))
          break
      }

      if (taskRes) {
        const list = taskRes.map(item => ({
          name: item?.name?.replace('%s', `${item?.task_refresh_time}`),
          extra: item.status === 0 ? `已完成${item?.progress}/${item?.condition_number}` : '',
          status:
            item.status === 0 ? 'default'
            : item.status === 2 ? 'disabled'
            : 'completed',
          data: item,
          rewardTimes: item?.reward_number,
        })) as TaskItemProps[]
        setTaskList(list)
      }

      // 在 normal 模式下获取抽奖次数
      if (mode === 'normal') {
        const participationRes = await getUserActivityParticipation(activityId)
        setLotteryTimes(participationRes.remain_total)
      }

      setDataLoaded(true)
    } catch (error) {
      console.error('获取活动数据失败', error)
      setError(error instanceof Error ? error : new Error('获取活动数据失败'))
    } finally {
      setLoading(false)
    }
  }, [activityId, mode, modeInitialized, dataLoaded])

  useEffect(() => {
    fetchActivityData()
  }, [fetchActivityData])

  const refreshActivityInfo = useCallback(async () => {
    setDataLoaded(false) // 重置 dataLoaded 状态
    await fetchActivityData()
  }, [fetchActivityData])

  const [lotteryTimes, setLotteryTimes] = useState<number>(0)

  const updateLotteryTimes = useCallback(async () => {
    if (mode === 'normal' && activityId) {
      try {
        const participationRes = await getUserActivityParticipation(activityId)
        setLotteryTimes(participationRes.remain_total)
      } catch (error) {
        console.error('更新抽奖次数失败', error)
      }
    }
  }, [mode, activityId])

  const value: ActivityInfoContextType = {
    activityId,
    activityUrlPath,
    activityFullUrl,
    activityInfo,
    loading,
    error,
    refreshActivityInfo,
    mode,
    setMode,
    taskList,
    lotteryTimes,
    updateLotteryTimes,
  }

  return <ActivityInfoContext.Provider value={value}>{children}</ActivityInfoContext.Provider>
}

// 自定义 hook 用于使用这个 context
export function useActivityInfo() {
  const context = useContext(ActivityInfoContext)
  if (context === undefined) {
    throw new Error('useActivityInfo 必须在 ActivityInfoProvider 内部使用')
  }
  return context
}
