import FbApi from '@/services/FbApi'
import { inFanbook } from '@/utils'
import { getUrlParameter } from '@/utils/url'

/**
 * 在 Fanbook 中打开指定路径
 * @param {Object} options - 打开选项
 * @param {string} [options.path=''] - 要打开的路径
 * @param {string} [options.code=''] - 相关代码
 * @param {string} [options.guildId=''] - 公会 ID
 * @param {string} [options.channelId=''] - 频道 ID
 * @param {string} [options.urlQstr=''] - URL 字符串
 * @param {string} [options.c=''] - 邀请码
 */
export function openInFanbook({
    path = '',
    code = '',
    guildId = '',
    channelId = '',
    urlQstr = '',
    c = ''
}: {
    path?: string
    code?: string
    guildId?: string
    channelId?: string
    urlQstr?: string
    c?: string
    env?: string
}) {
    if (!window.openInstall) {
        console.error('OpenInstall 未初始化，无法打开 Fanbook')
        return
    }

    const data: { scene?: string; path?: string; code?: string; guildId?: string; channelId?: string; urlQstr?: string; c?: string; env?: string } = {
        path,
        code,
        guildId,
        channelId,
    }

    const ic = getUrlParameter('ic');
    const env = getUrlParameter('env');
    const defaultUrlStr = ic ? `?scene=invite&c=${ic}` : '';

    data.urlQstr = urlQstr || defaultUrlStr;
    // 如果有邀请码,则使用邀请码,否则使用urlQstr解析出来的邀请码
    data.c = c || ic;

    data.env = env;
    console.log("openInFanbook 🍋 data", "color:#ea7e5c", data, defaultUrlStr);
    window.openInstall.wakeupOrInstall({
        data,
        timeout: 1000,
    })
}



/**
 * 处理活动任务
 * 如果在Fanbook环境中,调用dispatchActivityTask
 * 否则,调用openInFanbook
 *
 * @param {Object} args - 活动任务参数
 * @returns {Promise<void>}
 */
export async function onEnvHandleActivityTask(args: any): Promise<void> {
    try {
        if (inFanbook()) {
            // 在Fanbook环境中,调用dispatchActivityTask
            await FbApi.dispatchActivityTask(args);
        } else {
            // 不在Fanbook环境中,调用openInFanbook
            // 注意:我们需要将args转换为openInFanbook所需的格式
            openInFanbook({
                path: "",
            });
        }
    } catch (error) {
        console.error('处理活动任务时发生错误:', error);
    }
}
