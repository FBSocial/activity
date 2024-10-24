import StickyButton from '@/components/StickyButton'
import { useActivityInfo } from '@/contexts/activity-info/ActivityInfoContext'
import { useModalSheet } from '@/providers/ModalSheetProvider'

export default function SheetRule() {
  const { openModalSheet } = useModalSheet()
  const { activityInfo } = useActivityInfo()
  const openRuleModalSheet = () => {
    openModalSheet({
      title: '活动规则',
      content: (
        <div className="h-full overflow-auto px-[1rem] py-[0.62rem] text-base1420 text-slate">
          <pre className="whitespace-pre-wrap break-words">{activityInfo?.rule}</pre>
        </div>
      ),
    })
  }
  return <StickyButton label="规则" top={'3.12rem'} onClick={openRuleModalSheet} />
}
