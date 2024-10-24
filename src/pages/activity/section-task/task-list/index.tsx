import { TaskClickButton } from '@/components/button/TaskClickButton'
import { LinearGradientTag } from '@/components/tag/LinearGradientTag'
import React from 'react'

// 定义任务项的接口
export interface TaskItemProps {
  name: string
  extra?: string
  status: 'default' | 'disabled' | 'completed'
  onClick?: (data?: any) => void
  data?: any
  rewardTimes?: number // 新增奖励次数属性
}

// 定义 TaskItem 组件
const TaskItem: React.FC<TaskItemProps> = ({ name, extra, status, onClick, data, rewardTimes = 1 }) => {
  const handleClick = () => {
    console.log('任务点击')
    onClick?.(data)
  }
  return (
    <div className="task-item">
      <div className="flex items-center justify-between py-[14px]">
        <div className="task-item-title flex items-center justify-start">
          <div className="mr-1 text-base22 text-navy-95">
            <div className="flex items-center justify-start">
              <div className="name mr-1 line-clamp-2 text-base22 text-navy">{name}</div>
              <LinearGradientTag text={`抽奖机会+${rewardTimes}`} />
            </div>
            {extra && <div className="extra p-[2px] text-xs text-neutral">{extra}</div>}
          </div>
        </div>
        <div>
          <TaskClickButton status={status} onClick={handleClick} />
        </div>
      </div>
    </div>
  )
}

// 定义 TaskList 组件的 props 接口
interface TaskListProps {
  list: TaskItemProps[] | undefined | null
  onClick?: (data?: any) => void
}

// 定义 TaskList 组件
const TaskList: React.FC<TaskListProps> = ({ list, onClick }) => {
  if (!list || list.length === 0) {
    return null
  }

  return (
    <div className="task-list">
      {list.map((item, index) => (
        <TaskItem key={`task-${index}`} {...item} onClick={onClick} />
      ))}
    </div>
  )
}

export default TaskList
