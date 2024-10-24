import StickyButton from '@/components/StickyButton'
import { useModalSheet } from '@/providers/ModalSheetProvider'
import { inFanbook } from '@/utils'
import { useCallback } from 'react'
import PrizeList from './PrizeList'

export default function SheetPrize() {
  const { openModalSheet } = useModalSheet()

  const openPrizeModalSheet = useCallback(async () => {
    openModalSheet({
      title: '奖品',
      content: <PrizeList />,
    })
  }, [openModalSheet])

  return <>{inFanbook() && <StickyButton label="奖品" top={'7rem'} onClick={openPrizeModalSheet} />}</>
}
