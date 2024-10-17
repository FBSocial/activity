import { get, post } from '../../http';

/**
 * 抽奖礼物接口
 */
interface LotteryGift {
    gift_id: number;
    prize_id: number;
    gift_name: string;
    gift_img: string;
    gift_type: number;
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
 * @param params - 抽奖参数
 * @returns 抽奖结果
 */
export async function getLotteryResult(params: LotteryParams): Promise<LotteryGift> {
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
