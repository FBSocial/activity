import { get } from '../../http';

/**
 * 任务类型枚举
 */
enum TaskType {
    OneTime = 1,
    Daily = 2,
    Weekly = 3,
    Monthly = 4
}

/**
 * 任务项接口
 */
export interface TaskItem {
    activity_task_id: number;
    activity_id: number;
    name: string;
    task_event: string;
    action: string;
    position: number;
    type: TaskType;
    condition_number: number;
    task_refresh_time: number;
    status: number;
}

/**
 * 获取活动预览任务列表
 * @param activityId 活动ID
 * @returns 活动预览任务列表
 */
export async function getActivityPreviewTasks(activityId: number) {
    return get<TaskItem[]>(`/api/activity/preview/${activityId}`);
}


/**
 * 获取游客任务列表
 * @param activityId 活动ID
 * @returns 游客任务列表
 */
export async function getGuestTasks(activityId: number | string) {
    return get<TaskItem[]>(`/api/task/guest/${activityId}`)
}

