import { get } from '../../http';

/**
 * 礼物接口
 */
export interface Gift {
    gift_id: number;
    name: string;
    img: string;
    type: number;
}

/**
 * 抽奖礼物接口
 */
export interface DrawGift {
    draw_gift_id: number;
    draw_id: number;
    gift_id: number;
    activity_id: number;
    position: number;
    type: number;
    gift: Gift;
}

/**
 * 活动详情接口
 */
export interface ActivityDetail {
    activity_id: number;
    name: string;
    bg_img_color: string;
    header_img: string;
    start_time: string;
    end_time: string;
    template_type: string;
    draw_img: string;
    draw_button_img: string;
    task_img: string;
    guild_id: string;
    game_binding_url: string;
    game_binding_status: number;
    game_id: number;
    game_id_ios: number;
    mall_id: string;
    more_title: string | null;
    more_activity: any[]; // 可能需要根据实际情况定义更具体的类型
    gift: DrawGift[];
    rule: string;
    //  '优先展示；0=无,1=抽奖,2=任务'
    priority: number;
}


/**
 * 获取活动详情
 * @param activityId 活动ID ,
 * @returns 活动详情
 */
export async function getActivityDetail(activityId?: number) {
    return get<ActivityDetail>(`/api/activity/${activityId}`);
}




/**
 * 获取活动预览详情
 * @param activityId 活动ID
 * @returns 活动预览详情
 */
export async function getActivityPreview(activityId: number) {
    return get<ActivityDetail>(`/api/activity/preview/${activityId}`);
}

