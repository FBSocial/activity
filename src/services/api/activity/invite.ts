import { get } from '../../http';

/**
 * 邀请记录项接口
 */
interface InviteRecordItem {
    id: number;
    code: string;
    join_user_id: string;
    created_at: number;
    user_id: string;
    user: {
        user_id: string;
        avatar: string;
        username: string;
        nickname: string;
    };
}

/**
 * 邀请记录响应接口
 */
interface InviteRecordResponse {
    list: InviteRecordItem[];
    count: number;
    last_id: number;
}

/**
 * 获取邀请记录
 * @param activityId 活动ID
 * @param lastId 上一页最后一条记录的ID，首次请求传0
 * @returns 邀请记录响应
 */
export async function getInviteRecord({ activity_id, last_id }: { activity_id: number; last_id: number }): Promise<InviteRecordResponse> {
    return get<InviteRecordResponse>(`/api/activity/invite/${activity_id}?last_id=${last_id}`);
}
