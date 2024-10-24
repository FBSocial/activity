import { useModalSheet } from '@/providers/ModalSheetProvider'
import InviteRecordList from './InviteRecordList'

export default function InviteRecord() {
  const { openModalSheet } = useModalSheet()

  const handleClick = () => {
    console.log('邀请记录点击')
    openModalSheet({
      title: '邀请记录',
      content: <InviteRecordList />,
      onCloseCallback: () => {
        console.log('close')
      },
    })
  }

  return (
    <div className="cursor-pointer" onClick={handleClick}>
      <span className="text-navy-95">邀请记录</span>
      <span>
        <iconpark-icon name="SingleRight1" />
      </span>
    </div>
  )
}
