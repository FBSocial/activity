import FbApi from '@/services/FbApi'
import { inFanbook } from '@/utils'
import { Reporter, ReporterMessage } from 'fanbook-lib-reporter'
import { useCallback, useState } from 'react'
const REPORT_ID = 'Activity-Report'

export interface ReportData {
  event_id: string
  event_sub_id:
    | 'actv_enter'
    | 'actv_draw_click'
    | 'actv_task_show'
    | 'actv_task_click'
    | 'actv_task_reward_click'
    | 'actv_advertising_show'
    | 'actv_advertising_click'
  event_sub_param?: string | number | undefined
  ext_json?: Record<string, any>
  player_id?: string
  channel_id?: string | null
  app_version?: string
  user_id?: string
  guild_id?: string
  bot_user_id?: string

  [key: string]: any // 添加这一行
}

export const useReport = () => {
  const [reporter] = useState<Reporter<ReporterMessage> | undefined>(() => {
    if (typeof window === 'undefined') {
      return
    }
    if (import.meta.env.VITE_REPORT_URL === undefined) {
      console.error('REPORT_URL is undefined')
      return
    }
    return Reporter.generateReporter(REPORT_ID, {
      // 禁止缓存数据, 防止数据重复
      cacheMsg: false,
      reportCacheOnInit: false,
      reportUrl: import.meta.env.VITE_REPORT_URL,
      commonMsgFields: async () => {
        let fbUserInfo = {}
        let fbInfo = {}
        if (inFanbook()) {
          const appVersion = navigator.userAgent.match(/FBMP\/(\d+\.\d+\.\d+(?:\+\d+)?)/)?.[1] || ''
          const { userId = '' } = await FbApi.getUserInfo()
          const { id: channel_id = '' } = (await FbApi.getCurrentChannel()) || {}
          const { id: guild_id = '' } = (await FbApi.getCurrentGuild()) || {}
          fbUserInfo = {
            userId,
            app_version: appVersion,
          }
          fbInfo = {
            channel_id,
            guild_id,
          }
        }
        return {
          log_type: 'dlog_app_bot_action_event_fb',
          ...fbUserInfo,
          ...fbInfo,
        }
      },
      transformMsg: msg => {
        const { ext_json, ...rest } = msg
        return {
          ...rest,
          ext_json: JSON.stringify(ext_json),
        }
      },
    })
  })

  return useCallback(
    (data: ReportData) => {
      reporter?.pushMsg(data)
    },
    [reporter]
  )
}

export default useReport
