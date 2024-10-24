import { useActivityInfo } from '@/contexts/activity-info/ActivityInfoContext'
import useReport from '@/hooks/useReporter'
import { useEffect, useMemo } from 'react'

/**
 * 更多活动组件
 *
 * 该组件用于显示更多活动的信息,包括标题图片和活动列表。
 * 它使用 ActivityInfoContext 来获取活动信息。
 */
export default function SectionMoreActivity() {
  const { activityFullUrl, activityId, activityInfo } = useActivityInfo()
  const report = useReport()

  /**
   * 标题图片的URL
   */
  const titleImg = useMemo(() => activityInfo?.more_title ?? undefined, [activityInfo?.more_title])

  /**
   * 活动列表
   */
  const list = useMemo(() => activityInfo?.more_activity ?? [], [activityInfo?.more_activity])

  /**
   * 是否有更多活动
   */
  const hasMoreActivity = useMemo(() => Array.isArray(list) && list.length > 0, [list])

  useEffect(() => {
    if (activityInfo && hasMoreActivity) {
      report({
        event_id: 'task_draw_actv',
        event_sub_id: 'actv_advertising_show',
        ext_json: {
          actv_id: activityId,
          actv_url: activityFullUrl,
        },
      })
    }
  }, [activityFullUrl, activityId, activityInfo, hasMoreActivity, report])

  if (!hasMoreActivity) {
    return null
  }

  return (
    <div className="section-more-activity mb-[1.88rem]">
      <div className="title flex items-center justify-center p-[10px]">
        {titleImg && <img src={titleImg} alt="更多活动标题" className="pointer-events-none min-h-[20px] w-[138px] select-none" loading="lazy" />}
      </div>
      <div className="section-content">
        {list.map((item, index) => (
          <div className="activity my-[15px] flex items-center justify-center" key={item.id ?? index}>
            <div
              onClick={() => {
                report({
                  event_id: 'task_draw_actv',
                  event_sub_id: 'actv_advertising_click',
                  ext_json: {
                    actv_id: activityId,
                    actv_url: activityFullUrl,
                    adv_url: item.url,
                  },
                })
              }}
            >
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <img
                  src={item.banner}
                  loading="lazy"
                  alt={item.name ?? `活动 ${index + 1}`}
                  className="pointer-events-none block h-[11.5rem] w-[24.13rem] select-none rounded-[0.38rem]"
                />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

SectionMoreActivity.displayName = 'SectionMoreActivity'
