import FbApi from '@/services/FbApi'
import { inFanbook } from '@/utils'

/**
 * 在 Fanbook 中打开指定路径
 * @param {Object} options - 打开选项
 * @param {string} options.path - 要打开的路径（必需）
 * @param {string} [options.code] - 相关代码（可选）
 * @param {string} [options.guildId] - 公会 ID（可选）
 * @param {string} [options.channelId] - 频道 ID（可选）
 * @param {string} [options.urlStr] - URL 字符串（可选）
 */
export function openInFanbook({
    path,
    code,
    guildId,
    channelId,
    urlStr,
}: {
    path: string
    code?: string
    guildId?: string
    channelId?: string
    urlStr?: string
}) {
    if (!window.openInstall) {
        console.error('OpenInstall 未初始化，无法打开 Fanbook')
        return
    }

    const data: { scene?: string; path: string; code?: string; guildId?: string; channelId?: string; urlStr?: string } = {
        path,
    }

    if (code) data.code = code
    if (guildId) data.guildId = guildId
    if (channelId) data.channelId = channelId
    if (urlStr) data.urlStr = urlStr

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