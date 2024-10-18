import StickyButton from '@/components/StickyButton'
import { useActivityInfo } from '@/contexts/activity-info/ActivityInfoContext'
import { useModalSheet } from '@/providers/ModalSheetProvider'
import { inFanbook } from '@/utils'
import { useCallback } from 'react'
import PrizeList from './PrizeList'

export default function SheetPrize() {
  const { openModalSheet } = useModalSheet()
  const { mode } = useActivityInfo()

  const openPrizeModalSheet = useCallback(async () => {
    if (mode === 'normal') {
      openModalSheet({
        title: '奖品',
        content: <PrizeList />,
      })
    }
  }, [mode, openModalSheet])

  return <>{inFanbook() && <StickyButton label="奖品" top={'7rem'} onClick={openPrizeModalSheet} />}</>
}
