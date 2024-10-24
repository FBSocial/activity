import SectionTitleImg from '@/assets/images/activity/section/task/section_title.svg'
import { useActivityInfo } from '@/contexts/activity-info/ActivityInfoContext'
import { openInFanbook } from '@/contexts/open-install/utils'
import useReport from '@/hooks/useReporter'
import { completeTask } from '@/services/api/activity/task'
import FbApi from '@/services/FbApi'
import { inFanbook } from '@/utils'
import { safeJsonParse } from '@/utils/str'
import { useCallback, useEffect, useMemo } from 'react'
import InviteRecord from './invite-record'
import TaskList from './task-list'

export default function Component() {
  const { taskList, updateLotteryTimes, updateTaskList, activityFullUrl, activityUrlPath, activityId, activityInfo } = useActivityInfo()
  const report = useReport()

  const handleTaskClick = useCallback(
    (data?: any) => {
      console.log('任务点击', data)
      const taskName = data?.name?.replace('%s', `${data?.task_refresh_time}`)
      if (data?.status === 0) {
        const action = safeJsonParse<{ params: Record<string, string> } | undefined>(data?.action)
        const fbJump = action?.params
        console.log('%c Line:66 🍓 action', 'color:#e41a6a', fbJump)

        report({
          event_id: 'task_draw_actv',
          event_sub_id: 'actv_task_click',
          event_sub_param: activityId,
          ext_json: {
            actv_id: activityId,
            actv_url: activityFullUrl,
            task_type: data?.task_event,
            task_name: taskName,
          },
        })
        if (typeof fbJump === 'object') {
          if (inFanbook()) {
            // 在Fanbook环境中,调用dispatchActivityTask
            FbApi.dispatchActivityTask(fbJump)
          } else {
            // 不在Fanbook环境中,调用openInFanbook
            // 注意:我们需要将args转换为openInFanbook所需的格式
            openInFanbook({
              path: activityUrlPath,
            })
          }
        }
        // 未完成
      } else if (data?.status === 1) {
        // 已完成 待领取
        report({
          event_id: 'task_draw_actv',
          event_sub_id: 'actv_task_reward_click',
          event_sub_param: activityId,
          ext_json: {
            actv_id: activityId,
            actv_url: activityFullUrl,
            task_type: data?.task_event,
            task_name: taskName,
            task_reward: {},
          },
        })
        completeTask({
          activity_id: data.activity_id,
          activity_task_id: data.activity_task_id,
        }).then(res => {
          updateLotteryTimes()
          updateTaskList()
        })
      } else if (data?.status === 2) {
        report({
          event_id: 'task_draw_actv',
          event_sub_id: 'actv_task_click',
          event_sub_param: activityId,
          ext_json: {
            actv_id: activityId,
            actv_url: activityFullUrl,
            task_type: data?.task_event,
            task_name: taskName,
          },
        })
        return
        // 已领取
      }
    },
    [report, activityId, activityFullUrl, activityUrlPath, updateLotteryTimes, updateTaskList]
  )

  const memoizedTaskList = useMemo(() => <TaskList list={taskList} onClick={handleTaskClick} />, [taskList, handleTaskClick])

  useEffect(() => {
    if (activityInfo) {
      if (Array.isArray(taskList) && taskList.length > 0) {
        for (const task of taskList) {
          const taskName = task?.data?.name?.replace('%s', `${task.data?.task_refresh_time}`)
          report({
            event_id: 'task_draw_actv',
            event_sub_id: 'actv_task_show',
            event_sub_param: activityId,
            ext_json: {
              actv_id: activityId,
              actv_url: activityFullUrl,
              task_type: task.data?.task_event,
              task_name: taskName,
            },
          })
        }
      }
    }
  }, [taskList, activityInfo, report, activityId, activityFullUrl])

  return (
    <div className="section-task mb-[1.88rem] rounded-2xl bg-white px-4 pb-2 pt-4">
      <div className="section-title">
        <div className="flex items-center justify-between text-xs">
          <img src={SectionTitleImg} loading="lazy" alt="section-title" className="pointer-events-none h-[1.25rem] w-[9rem] select-none" />
          <InviteRecord />
        </div>
      </div>
      <div className="section-content">{memoizedTaskList}</div>
    </div>
  )
}

Component.displayName = 'SectionTask'
