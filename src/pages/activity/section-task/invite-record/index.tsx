import { useOpenInstallContext } from '@/contexts/open-install/OpenInstallContext'
import { useModalSheet } from '@/providers/ModalSheetProvider'
import { inFanbook } from '@/utils'
import { useMemo } from 'react'
import InviteRecordList from './InviteRecordList'

export default function InviteRecord() {
  const { openModalSheet } = useModalSheet()
  const { openFanbook } = useOpenInstallContext()
  const data = useMemo(() => {
    const avatars = [
      'https://randomuser.me/api/portraits/men/1.jpg',
      'https://randomuser.me/api/portraits/women/2.jpg',
      'https://randomuser.me/api/portraits/men/3.jpg',
      'https://randomuser.me/api/portraits/women/4.jpg',
      'https://randomuser.me/api/portraits/men/5.jpg',
    ]
    const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑十一', '王十二']
    return Array.from({ length: 10 }, (_, index) => ({
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      username: names[index],
      joinTime: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      index: index + 1,
    }))
  }, [])

  const handleClick = () => {
    console.log('邀请记录点击')
    if (inFanbook()) {
      openModalSheet({
        title: '邀请记录',
        content: <InviteRecordList list={data} />,
        onCloseCallback: () => {
          console.log('close')
        },
      })
    } else {
      openFanbook({
        path: '/subway-team-activities/team',
        code: '',
        guildId: '',
      })
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
