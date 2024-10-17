import { Reporter, ReporterMessage } from 'fanbook-lib-reporter'
import { useCallback, useState } from 'react'
const REPORT_ID = 'Activity-Report'

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
        // if (!extraInfo) {
        //   // extraInfo = await adsUidManager.getAdsUidWithRetry()
        // }
        return {
          log_type: 'dlog_app_bot_action_event_fb',
          channel_id: null,
          //   ...extraInfo,
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
    (data: ReporterMessage) => {
      reporter?.pushMsg(data)
    },
    [reporter]
  )
}

export default useReport
