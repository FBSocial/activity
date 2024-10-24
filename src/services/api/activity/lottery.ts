import { detectDeviceType } from '@/utils';
import { get, post } from '../../http';

/**
 * 抽奖礼物接口
 */
export interface LotteryGift {
    draw_gift_id: number; // 活动奖品配置ID
    gift_id: number; // 礼包ID
    gift_name: string; // 礼包名称
    gift_img: string; // 礼包图片
    gift_type: number; // 礼包种类：0 谢谢参与，1 礼包
    cd_key?: string; // 兑换码，仅当 gift_type = 1 时存在
    prize_id: number; // 奖励ID，当 gift_type = 1 时为发放的奖励ID，当 gift_type = 0 时可能为 0
}

/**
 * 平台枚举
 */
enum Platform {
    iOS = 1,
    Android = 2
}

/**
 * 抽奖参数接口
 */
interface LotteryParams {
    activity_id: number;
    platform: Platform;
}



/**
 * 进行抽奖
 * @param activityId - 活动ID
 * @returns 抽奖结果
 */
export async function getLotteryResult(activityId: number): Promise<LotteryGift> {
    const params: LotteryParams = {
        activity_id: activityId,
        platform: detectDeviceType() === 'ios' ? Platform.iOS : Platform.Android
    };
    return post<LotteryGift>('/api/draw/get', params);
}



/**
 * 抽奖记录项接口
 */
export interface LotteryRecordItem {
    reward_record_id: number;
    activity_id: number;
    user_id: string;
    gift_id: number;
    gift_name: string;
    gift_img: string;
    gift_num: number;
    gift_type: number;
    created_at: string;
    updated_at: string;
    status: number;
    cd_key: string
}

/**
 * 分页信息接口
 */
interface Pagination {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
}

/**
 * 抽奖记录响应接口
 */
export interface LotteryRecordResponse {
    list: LotteryRecordItem[];
    pagination: Pagination;
}

/**
 * 抽奖记录查询参数接口
 */
interface LotteryRecordParams {
    activity_id: number;
    page: number;
    page_size: number;
}

/**
 * 获取抽奖记录
 * @param params - 查询参数
 * @returns 抽奖记录响应
 */
export async function getLotteryRecord(params: LotteryRecordParams): Promise<LotteryRecordResponse> {
    const { activity_id, page, page_size } = params;
    return get<LotteryRecordResponse>(`/api/draw/record?activity_id=${activity_id}&page=${page}&page_size=${page_size}`);
}
