import { ActivityInfoProvider } from '@/contexts/activity-info/ActivityInfoContext'
import { OpenInstallProvider } from '@/contexts/open-install/OpenInstallContext'
import { ModalProvider } from '@/providers/ModalProvider'
import { ModalSheetProvider } from '@/providers/ModalSheetProvider'
import { inFanbook } from '@/utils'
import { Outlet } from 'react-router-dom'

export const ActivityOutlet = () => {
  const currentInFanbook = inFanbook()
  return (
    <ActivityInfoProvider>
      <ModalSheetProvider>
        <ModalProvider>
          <OpenInstallProvider shouldInitialize={!currentInFanbook}>
            <Outlet />
          </OpenInstallProvider>
        </ModalProvider>
      </ModalSheetProvider>
    </ActivityInfoProvider>
  )
}
