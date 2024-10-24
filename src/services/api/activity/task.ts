import { get, post } from '../../http';

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
    progress: number;
    reward_number: number;
}

/**
 * 已登录用户任务项接口
 */
export interface LoggedInTaskItem extends TaskItem {
    reward_number: number;
    progress: number;
}

/**
 * 获取活动预览任务列表
 * @param activityId 活动ID
 * @returns 活动预览任务列表
 */
export async function getActivityPreviewTasks(activityId: number) {
    return get<TaskItem[]>(`/api/task/preview/day/${activityId}`);
}


/**
 * 获取游客任务列表
 * @param activityId 活动ID
 * @returns 游客任务列表
 */
export async function getGuestTasks(activityId: number | string) {
    return get<TaskItem[]>(`/api/task/guest/${activityId}`)
}


/**
 * 获取已登录用户的每日任务列表
 * @param activityId 活动ID
 * @returns 已登录用户的每日任务列表
 */
export async function getLoggedInUserDailyTasks(activityId: number) {
    return get<LoggedInTaskItem[]>(`/api/task/day/${activityId}`);
}

/**
 * 领取任务接口参数
 */
interface CompleteTaskParams {
    activity_id: number;
    activity_task_id: number;
}

/**
 * 领取任务接口响应
 */
interface CompleteTaskResponse {
    data: any[];
}

/**
 * 领取任务
 * @param params 领取任务参数
 * @returns 领取任务响应
 */
export async function completeTask(params: CompleteTaskParams): Promise<CompleteTaskResponse> {
    return post<CompleteTaskResponse>('/api/task/complete', params);
}
