import type { TaskItemProps } from '@/pages/activity/section-task/task-list'
import { getActivityDetail, getActivityPreview, type ActivityDetail } from '@/services/api/activity/detail'
import { getActivityPreviewTasks, getGuestTasks, getLoggedInUserDailyTasks, type TaskItem } from '@/services/api/activity/task'
import { getUserActivityParticipation } from '@/services/api/activity/user'
import { inFanbook } from '@/utils'
import { getToken } from '@/utils/auth-utils'
import { base64ToJson } from '@/utils/json'
import Cookies from 'js-cookie'
import queryString from 'query-string'
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

// 定义模式类型
type ActivityMode = 'guest' | 'preview' | 'normal'

// 定义任务状态类型
type TaskStatus = 'default' | 'disabled' | 'completed'

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
  updateTaskList: () => Promise<void>
  lotteryTimes: number
  updateLotteryTimes: () => Promise<void>
}

// 创建 context
const ActivityInfoContext = createContext<ActivityInfoContextType | undefined>(undefined)

/**
 * 确定活动模式
 * @returns {ActivityMode} 活动模式
 */
const determineMode = (): ActivityMode => {
  const query = queryString.parseUrl(window.location.search).query
  const userToken = getToken()
  const specialQuery = query?.fbpvm ?? ''

  if (specialQuery) {
    try {
      const { mode, token } = base64ToJson<{ mode: string; token: string }>(specialQuery as string)
      if (mode === 'preview') {
        if (!inFanbook()) {
          Cookies.set('token', token)
        }
        return 'preview'
      }
    } catch (error) {
      console.error('解析 activityPreview 参数失败:', error)
    }
  }

  return userToken ? 'normal' : 'guest'
}

/**
 * 将任务数据转换为 TaskItemProps
 * @param {TaskItem} item 任务数据
 * @returns {TaskItemProps} 转换后的任务项属性
 */
const mapTaskToProps = (item: TaskItem): TaskItemProps => ({
  name: item.name?.replace('%s', `${item.task_refresh_time}`) ?? '',
  extra: item.status === 0 ? `已完成${item.progress}/${item.condition_number}` : '',
  status: getTaskStatus(item.status),
  data: item,
  rewardTimes: item.reward_number,
})

/**
 * 获取任务状态
 * @param {number} status 任务状态码
 * @returns {TaskStatus} 任务状态
 */
const getTaskStatus = (status: number): TaskStatus => {
  switch (status) {
    case 0:
      return 'default'
    case 2:
      return 'disabled'
    default:
      return 'completed'
  }
}

// Provider 组件
export function ActivityInfoProvider({ children }: { children: ReactNode }) {
  const [activityInfo, setActivityInfo] = useState<ActivityDetail | null>(null)
  const [taskList, setTaskList] = useState<TaskItemProps[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [lotteryTimes, setLotteryTimes] = useState<number>(0)

  const [mode, setMode] = useState<ActivityMode>(determineMode)
  const [dataLoaded, setDataLoaded] = useState<boolean>(false)
  const isInitialMount = useRef(true)

  // 活动ID
  const { activityId } = useParams<{ activityId: string }>()
  // 活动路径
  const activityUrlPath = `/activity/${activityId}`
  // 带域名的全路径
  const activityFullUrl = `${window?.location?.origin}${activityUrlPath}`

  const getTasksForMode = useMemo(
    () => ({
      guest: () => getGuestTasks(activityId!),
      preview: () => getActivityPreviewTasks(Number(activityId)),
      normal: () => getLoggedInUserDailyTasks(Number(activityId)),
    }),
    [activityId]
  )

  const fetchActivityData = useCallback(async () => {
    if (!activityId || dataLoaded) {
      return
    }

    setLoading(true)
    try {
      // 获取活动详情
      const activityRes = await (mode === 'preview' ? getActivityPreview(Number(activityId)) : getActivityDetail(Number(activityId)))

      if (activityRes?.name) {
        document.title = activityRes.name
        setActivityInfo(activityRes)
      }

      // 获取任务列表
      const taskRes = await getTasksForMode[mode]()

      if (Array.isArray(taskRes)) {
        const list = taskRes.map(mapTaskToProps)
        setTaskList(list)
      } else {
        setTaskList([])
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
  }, [activityId, dataLoaded, mode, getTasksForMode])

  useEffect(() => {
    if (isInitialMount.current) {
      fetchActivityData()
      isInitialMount.current = false
    }
  }, [fetchActivityData])

  const refreshActivityInfo = useCallback(async () => {
    setDataLoaded(false)
    await fetchActivityData()
  }, [fetchActivityData])

  const updateLotteryTimes = useCallback(async () => {
    if (mode === 'normal' && activityId) {
      try {
        const participationRes = await getUserActivityParticipation(activityId)
        setLotteryTimes(participationRes.remain_total)
      } catch (error) {
        console.error('更新抽奖次数失败', error)
        setError(error instanceof Error ? error : new Error('更新抽奖次数失败'))
      }
    }
  }, [mode, activityId])

  const updateTaskList = useCallback(async () => {
    if (!activityId) {
      return
    }

    try {
      const taskRes = await getTasksForMode[mode]()
      if (Array.isArray(taskRes)) {
        const list = taskRes.map(mapTaskToProps)
        setTaskList(list)
      } else {
        setTaskList([])
      }
    } catch (error) {
      console.error('更新任务列表失败', error)
    }
  }, [activityId, mode, getTasksForMode])

  const value: ActivityInfoContextType = useMemo(
    () => ({
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
      updateTaskList,
      lotteryTimes,
      updateLotteryTimes,
    }),
    [
      activityId,
      activityUrlPath,
      activityFullUrl,
      activityInfo,
      loading,
      error,
      refreshActivityInfo,
      mode,
      taskList,
      updateTaskList,
      lotteryTimes,
      updateLotteryTimes,
    ]
  )

  return <ActivityInfoContext.Provider value={value}>{children}</ActivityInfoContext.Provider>
}

/**
 * 自定义 hook 用于使用这个 context
 * @throws {Error} 如果在 ActivityInfoProvider 外部使用
 * @returns {ActivityInfoContextType} ActivityInfo context
 */
export function useActivityInfo(): ActivityInfoContextType {
  const context = useContext(ActivityInfoContext)
  if (context === undefined) {
    throw new Error('useActivityInfo 必须在 ActivityInfoProvider 内部使用')
  }
  return context
}
