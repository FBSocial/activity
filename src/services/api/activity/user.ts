import { get } from '../../http'

/**
 * 用户活动参与信息接口
 */
export interface UserActivityParticipation {
    /** 活动ID */
    activity_id: number
    /** 用户ID */
    user_id: string
    /** 剩余参与次数 */
    remain_total: number
    /** 总参与次数 */
    total: number
    /** 参与状态 */
    status: number
}

/**
 * 获取用户活动参与信息
 *
 * @param activityId - 活动ID
 * @returns 用户活动参与的详细信息
 */
export async function getUserActivityParticipation(activityId: number | string): Promise<UserActivityParticipation> {
    return get<UserActivityParticipation>(`/api/activity/user/${activityId}`)
}
