import { useOpenInstallContext } from '@/contexts/open-install/OpenInstallContext'
import { useModalSheet } from '@/providers/ModalSheetProvider'
import { inFanbook } from '@/utils'
import InviteRecordList from './InviteRecordList'

export default function InviteRecord() {
  const { openModalSheet } = useModalSheet()
  const { openFanbook } = useOpenInstallContext()

  const handleClick = () => {
    console.log('邀请记录点击')
    if (inFanbook()) {
      openModalSheet({
        title: '邀请记录',
        content: <InviteRecordList />,
        onCloseCallback: () => {
          console.log('close')
        },
      })
    } else {
      openFanbook()
    }
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
