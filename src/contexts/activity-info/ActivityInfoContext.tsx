import type { TaskItemProps } from '@/pages/activity/section-task/task-list'
import { getActivityDetail, getActivityPreview, type ActivityDetail } from '@/services/api/activity/detail'
import { getActivityPreviewTasks, getGuestTasks } from '@/services/api/activity/task'
import { getToken } from '@/utils/auth-utils'
import { base64ToJson } from '@/utils/json'
import Cookies from 'js-cookie'
import queryString from 'query-string'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// 定义模式类型
type ActivityMode = 'guest' | 'preview' | 'normal'

// 定义 context 的类型
interface ActivityInfoContextType {
  activityId: string | undefined
  activityUrlPath: string
  activityInfo: ActivityDetail | null
  loading: boolean
  error: Error | null
  refreshActivityInfo: () => Promise<void>
  mode: ActivityMode
  setMode: (mode: ActivityMode) => void
  taskList: TaskItemProps[]
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
            if (token === userToken) {
              return 'preview'
            } else {
              Cookies.set('token', token)
              return 'preview'
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

  const fetchTaskList = async () => {
    setLoading(true)
    try {
      if (!activityId) {
        throw new Error('活动ID不存在')
      }
      let res
      switch (mode) {
        case 'guest':
          res = await getGuestTasks(activityId)
          break
        case 'preview':
          res = await getActivityPreviewTasks(Number(activityId))
          break
        case 'normal':
          // 正式模式下，任务列表应该包含在活动详情中
          return
      }

      const list = res?.map(item => ({
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
    } catch (error) {
      console.error('获取任务列表失败', error)
      setError(error instanceof Error ? error : new Error('获取任务列表失败'))
    } finally {
      setLoading(false)
    }
  }

  const fetchActivityDetail = async () => {
    setLoading(true)
    try {
      if (!activityId) {
        throw new Error('活动ID不存在')
      }
      let res
      switch (mode) {
        case 'guest':
        case 'normal':
          res = await getActivityDetail(Number(activityId))
          break
        case 'preview':
          res = await getActivityPreview(Number(activityId))
          break
      }

      if (res) {
        console.log('%c Line:104 🥤 res', 'color:#b03734', res)

        // 设置活动名称为网站标题
        if (res.name) {
          document.title = res.name
        }

        setActivityInfo(res)
        if (mode === 'normal') {
          // 假设正式模式下，任务列表包含在活动详情中
          setTaskList(res.tasks || [])
        }
      }
    } catch (error) {
      console.error('获取活动详情失败', error)
      setError(error instanceof Error ? error : new Error('获取活动详情失败'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activityId && modeInitialized) {
      fetchActivityDetail()
      if (mode !== 'normal') {
        fetchTaskList()
      }
    }
  }, [activityId, mode, modeInitialized])

  const refreshActivityInfo = async () => {
    await fetchActivityDetail()
    if (mode !== 'normal') {
      await fetchTaskList()
    }
  }

  const value: ActivityInfoContextType = {
    activityId,
    activityUrlPath,
    activityInfo,
    loading,
    error,
    refreshActivityInfo,
    mode,
    setMode,
    taskList,
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
