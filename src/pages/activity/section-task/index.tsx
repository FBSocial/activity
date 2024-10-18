import SectionTitleImg from '@/assets/images/activity/section/task/section_title.svg'
import { useActivityInfo } from '@/contexts/activity-info/ActivityInfoContext'
import { onEnvHandleActivityTask } from '@/contexts/open-install/utils'
import useReport from '@/hooks/useReporter'
import { completeTask } from '@/services/api/activity/task'
import { safeJsonParse } from '@/utils/str'
import { useEffect } from 'react'
import InviteRecord from './invite-record'
import TaskList from './task-list'

export default function Component() {
  const { taskList, updateLotteryTimes } = useActivityInfo()
  const report = useReport()
  const { activityFullUrl, activityId, activityInfo } = useActivityInfo()

  const handleTaskClick = (data?: any) => {
    console.log('任务点击', data)
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
          task_type: '',
        },
      })
      if (typeof fbJump === 'object') {
        onEnvHandleActivityTask(fbJump)
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
          task_type: '',
        },
      })
      completeTask({
        activity_id: data.activity_id,
        activity_task_id: data.activity_task_id,
      }).then(res => {
        updateLotteryTimes()
      })
    } else if (data?.status === 2) {
      report({
        event_id: 'task_draw_actv',
        event_sub_id: 'actv_task_click',
        event_sub_param: activityId,
        ext_json: {
          actv_id: activityId,
          actv_url: activityFullUrl,
          task_type: '',
        },
      })
      return
      // 已领取
    }
  }

  useEffect(() => {
    if (activityInfo)
      report({
        event_id: 'task_draw_actv',
        event_sub_id: 'actv_task_show',
        event_sub_param: activityId,
        ext_json: {
          actv_id: activityId,
          actv_url: activityFullUrl,
        },
      })
  }, [activityFullUrl, activityId, activityInfo, report])

  return (
    <div className="section-task mb-[1.88rem] rounded-2xl bg-white px-4 pb-2 pt-4">
      <div className="section-title">
        <div className="flex items-center justify-between text-xs">
          <img src={SectionTitleImg} loading="lazy" alt="section-title" className="pointer-events-none h-[1.25rem] w-[9rem]" />
          <InviteRecord />
        </div>
      </div>
      <div className="section-content">
        <TaskList list={taskList} onClick={handleTaskClick} />
      </div>
    </div>
  )
}

Component.displayName = 'SectionTask'
