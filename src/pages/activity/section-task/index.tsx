import SectionTitleImg from '@/assets/images/activity/section/task/section_title.svg'
import { useActivityInfo } from '@/contexts/activity-info/ActivityInfoContext'
import { onEnvHandleActivityTask } from '@/contexts/open-install/utils'
import { safeJsonParse } from '@/utils/str'
import InviteRecord from './invite-record'
import TaskList from './task-list'

export default function Component() {
  const { activityUrlPath, activityId, taskList } = useActivityInfo()
  console.log('%c Line:11 🥕 activityUrlPath, activityId', 'color:#33a5ff', activityUrlPath, activityId)

  const handleTaskClick = (data?: any) => {
    console.log('任务点击', data)
    if (data?.status === 0) {
      const action = safeJsonParse<{ params: Record<string, string> } | undefined>(data?.action)
      const fbJump = action?.params
      console.log('%c Line:66 🍓 action', 'color:#e41a6a', fbJump)

      if (typeof fbJump === 'object') {
        onEnvHandleActivityTask(fbJump)
      }
      // 未完成
    } else if (data?.status === 2) {
      // 已完成
    } else if (data?.status === 3) {
      return
      // 已领取
    }
  }

  return (
    <div className="section-task mb-[1.88rem] rounded-2xl bg-white px-4 pb-2 pt-4">
      <div className="section-title">
        <div className="flex items-center justify-between text-xs">
          <img src={SectionTitleImg} alt="section-title" className="pointer-events-none h-[1.25rem] w-[9rem]" />
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
